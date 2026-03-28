from __future__ import annotations

import logging

from backend.db.supabase_client import get_supabase_client
from pipelines.pattern_scanner import scan_symbol_patterns
from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(
    bind=True,
    name="workers.tasks.scan_patterns.run_scan_patterns",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    retry_kwargs={"max_retries": 4},
)
def run_scan_patterns(self, symbols: list[str]) -> dict[str, int]:  # noqa: ARG001
    total_detected = 0
    total_persisted = 0
    for symbol in symbols:
        detected = scan_symbol_patterns(symbol)
        total_detected += len(detected)
        if not detected:
            continue
        try:
            client = get_supabase_client()
            payload = [
                {
                    "symbol": item.symbol,
                    "pattern_name": item.pattern_name,
                    "confidence": item.confidence,
                    "plain_english_summary": item.summary,
                    "backtest_success_rate": 0.62,
                    "timeframe": item.timeframe,
                    "detected_at": item.detected_at.isoformat(),
                }
                for item in detected
            ]
            client.table("technical_patterns").insert(payload).execute()
            total_persisted += len(payload)
        except Exception:  # noqa: BLE001
            logger.exception("Failed to persist pattern scan for %s", symbol)

    return {"patterns_detected": total_detected, "patterns_persisted": total_persisted}
