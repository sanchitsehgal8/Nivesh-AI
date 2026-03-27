from __future__ import annotations

from pipelines.pattern_scanner import scan_symbol_patterns
from workers.celery_app import celery_app


@celery_app.task(
    bind=True,
    name="workers.tasks.scan_patterns.run_scan_patterns",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    retry_kwargs={"max_retries": 4},
)
def run_scan_patterns(self, symbols: list[str]) -> dict[str, int]:  # noqa: ARG001
    total = 0
    for symbol in symbols:
        total += len(scan_symbol_patterns(symbol))
    return {"patterns_detected": total}
