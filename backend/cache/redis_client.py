from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import os
from typing import Awaitable, Callable, TypeVar

from redis.asyncio import Redis

logger = logging.getLogger(__name__)

T = TypeVar("T")

CACHE_KEYS: dict[str, int] = {
    "signals:latest": 300,
    "patterns:{symbol}": 600,
    "portfolio:{portfolio_id}": 120,
    "embedding_query:{hash}": 3600,
    "stock_snapshot:{symbol}": 60,
    "macro:fii_dii": 900,
}


def _build_redis_url() -> str:
    explicit = os.getenv("CELERY_BROKER_URL")
    if explicit:
        return explicit
    base = os.getenv("UPSTASH_REDIS_URL", "")
    token = os.getenv("UPSTASH_REDIS_TOKEN", "")
    if not base:
        raise RuntimeError("UPSTASH_REDIS_URL not set")
    if token and "@" in base and "://" in base and "default:" not in base:
        proto, rest = base.split("://", maxsplit=1)
        return f"{proto}://default:{token}@{rest}"
    return base


def _json_hash(payload: dict[str, object]) -> str:
    text = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


async def get_redis() -> Redis:
    url = _build_redis_url()
    return Redis.from_url(url, decode_responses=True)


async def get_json(redis: Redis, key: str) -> object | None:
    value = await redis.get(key)
    if value is None:
        return None
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        logger.warning("Invalid JSON in cache for key %s", key)
        return None


async def set_json(redis: Redis, key: str, value: object, ttl_seconds: int) -> None:
    await redis.set(key, json.dumps(value), ex=ttl_seconds)


async def swr_get(
    redis: Redis,
    key: str,
    ttl_seconds: int,
    producer: Callable[[], Awaitable[T]],
) -> T:
    cached = await get_json(redis, key)
    if cached is not None:
        async def refresh() -> None:
            try:
                fresh = await producer()
                await set_json(redis, key, fresh, ttl_seconds)
            except Exception:  # noqa: BLE001
                logger.exception("SWR refresh failed for %s", key)

        asyncio.create_task(refresh())
        return cached  # type: ignore[return-value]

    fresh = await producer()
    await set_json(redis, key, fresh, ttl_seconds)
    return fresh


def embedding_cache_key(payload: dict[str, object]) -> str:
    return f"embedding_query:{_json_hash(payload)}"
