from __future__ import annotations

import logging
from datetime import datetime, timezone

from backend.db.supabase_client import get_supabase_client
from ingestion.bse_rss import fetch_bse_rss
from ingestion.bulk_block_deals import fetch_bulk_block_deals
from ingestion.corporate_actions import fetch_corporate_actions
from ingestion.insider_trades import fetch_insider_trades
from ingestion.nse_feed import fetch_nse_feed
from pipelines.signal_detector import FinbertSignalDetector
from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(
    bind=True,
    name="workers.tasks.ingest_filings.run_ingest_filings",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    retry_kwargs={"max_retries": 5},
)
def run_ingest_filings(self) -> dict[str, int]:  # noqa: ARG001
    detector = FinbertSignalDetector()
    client = get_supabase_client()

    collected: list[dict[str, str]] = []
    for fn in (fetch_bse_rss, fetch_nse_feed, fetch_bulk_block_deals, fetch_insider_trades, fetch_corporate_actions):
        try:
            collected.extend(fn())
        except Exception:  # noqa: BLE001
            logger.exception("Source fetch failed: %s", fn.__name__)

    inserted = 0
    seen: set[tuple[str, str]] = set()
    for item in collected[:200]:
        symbol = item.get("symbol", "UNKNOWN").upper()
        text = item.get("text", "").strip()
        if not text:
            continue
        key = (symbol, text[:80])
        if key in seen:
            continue
        seen.add(key)

        signal = detector.classify(text, metadata={"source": item.get("source", "unknown")})
        sentiment_score = signal.confidence_score if signal.risk_level != "high" else -signal.confidence_score

        client.table("filings").insert(
            {
                "symbol": symbol,
                "filing_type": item.get("source", "mixed"),
                "raw_text": text,
                "sentiment_score": sentiment_score,
                "filed_at": datetime.now(timezone.utc).isoformat(),
            }
        ).execute()
        client.table("signals").insert(
            {
                "symbol": symbol,
                "signal_type": signal.signal_type,
                "confidence_score": signal.confidence_score,
                "risk_level": signal.risk_level,
                "reasoning_summary": signal.reasoning_summary,
                "historical_accuracy": 0.62,
                "source_url": item.get("link", ""),
            }
        ).execute()
        inserted += 1

    logger.info("Ingestion completed with %s inserted filings", inserted)
    return {"inserted": inserted}
