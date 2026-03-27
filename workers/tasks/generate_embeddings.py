from __future__ import annotations

import os
from uuid import UUID

import psycopg

from pipelines.embedding_pipeline import EmbeddingPipeline, EmbeddingRecord
from workers.celery_app import celery_app


@celery_app.task(
    bind=True,
    name="workers.tasks.generate_embeddings.run_generate_embeddings",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    retry_kwargs={"max_retries": 4},
)
def run_generate_embeddings(self, batch_size: int = 64) -> dict[str, int]:  # noqa: ARG001
    dsn = os.getenv("DATABASE_URL", "")
    if not dsn:
        return {"processed": 0}

    with psycopg.connect(dsn) as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT id::text, raw_text
            FROM filings
            WHERE embedding IS NULL AND raw_text IS NOT NULL
            ORDER BY created_at DESC
            LIMIT %s
            """,
            (batch_size,),
        )
        rows = cur.fetchall()

    records = [
        EmbeddingRecord(
            source_type="filing",
            source_id=UUID(row[0]),
            text=str(row[1]),
            metadata={"table": "filings"},
        )
        for row in rows
    ]
    if not records:
        return {"processed": 0}

    pipeline = EmbeddingPipeline(dsn)
    processed = pipeline.upsert_records(records)
    return {"processed": processed}
