from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from backend.cache.redis_client import CACHE_KEYS, get_redis, swr_get
from backend.db.supabase_client import get_supabase_client
from backend.models.signal import SignalItem, SignalsResponse

router = APIRouter(prefix="/signals", tags=["signals"])
logger = logging.getLogger(__name__)


def _sample_signals() -> dict[str, list[dict[str, object]]]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "signals": [
            {
                "signal_type": "insider_buy",
                "confidence_score": 0.83,
                "stock_symbol": "RELIANCE",
                "reasoning_summary": "Promoter-linked buying at support with improving volume profile.",
                "risk_level": "medium",
                "historical_accuracy_reference": 0.72,
                "source_url": "https://www.nseindia.com",
                "created_at": now,
            },
            {
                "signal_type": "earnings_surprise",
                "confidence_score": 0.79,
                "stock_symbol": "INFY",
                "reasoning_summary": "Revenue growth beat trend and margin guidance held stable.",
                "risk_level": "low",
                "historical_accuracy_reference": 0.69,
                "source_url": "https://www.bseindia.com",
                "created_at": now,
            },
        ]
    }


async def _fetch_latest_signals() -> dict[str, list[dict[str, object]]]:
    try:
        client = get_supabase_client()
        result = (
            client.table("signals")
            .select("signal_type, confidence_score, symbol, reasoning_summary, risk_level, historical_accuracy, source_url, created_at")
            .order("created_at", desc=True)
            .limit(50)
            .execute()
        )
        rows = result.data or []
    except Exception:  # noqa: BLE001
        logger.exception("Supabase unavailable, serving sample signals")
        return _sample_signals()

    if not rows:
        return _sample_signals()
    payload = {
        "signals": [
            {
                "signal_type": row["signal_type"],
                "confidence_score": float(row.get("confidence_score") or 0),
                "stock_symbol": row["symbol"],
                "reasoning_summary": row.get("reasoning_summary") or "",
                "risk_level": row.get("risk_level") or "medium",
                "historical_accuracy_reference": row.get("historical_accuracy"),
                "source_url": row.get("source_url") or "",
                "created_at": row.get("created_at"),
            }
            for row in rows
        ]
    }
    return payload


@router.get("/latest", response_model=SignalsResponse)
async def get_latest_signals() -> SignalsResponse:
    try:
        try:
            redis = await get_redis()
            payload = await swr_get(
                redis=redis,
                key="signals:latest",
                ttl_seconds=CACHE_KEYS["signals:latest"],
                producer=_fetch_latest_signals,
            )
        except Exception:  # noqa: BLE001
            logger.exception("Redis unavailable, bypassing cache for signals")
            payload = await _fetch_latest_signals()
        parsed = [SignalItem(**item) for item in payload["signals"]]
        return SignalsResponse(signals=parsed)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to fetch latest signals")
        raise HTTPException(status_code=500, detail="Unable to fetch latest signals") from exc
