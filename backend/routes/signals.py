from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from backend.cache.redis_client import CACHE_KEYS, get_redis, swr_get
from backend.db.supabase_client import get_supabase_client
from backend.models.signal import SignalItem, SignalsResponse

router = APIRouter(prefix="/signals", tags=["signals"])
logger = logging.getLogger(__name__)


async def _fetch_latest_signals() -> dict[str, list[dict[str, object]]]:
    client = get_supabase_client()
    result = (
        client.table("signals")
        .select("signal_type, confidence_score, symbol, reasoning_summary, risk_level, historical_accuracy, source_url, created_at")
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    rows = result.data or []
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
        redis = await get_redis()
        payload = await swr_get(
            redis=redis,
            key="signals:latest",
            ttl_seconds=CACHE_KEYS["signals:latest"],
            producer=_fetch_latest_signals,
        )
        parsed = [SignalItem(**item) for item in payload["signals"]]
        return SignalsResponse(signals=parsed)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to fetch latest signals")
        raise HTTPException(status_code=500, detail="Unable to fetch latest signals") from exc
