from __future__ import annotations

import json
import os
from typing import Sequence

import psycopg


def _dsn() -> str:
    value = os.getenv("DATABASE_URL", "")
    if not value:
        raise RuntimeError("DATABASE_URL must be set for pgvector operations")
    return value


def upsert_vectors(vectors: Sequence[list[float]], source_type: str = "unknown") -> int:
    if not vectors:
        return 0
    with psycopg.connect(_dsn()) as conn, conn.cursor() as cur:
        for idx, vector in enumerate(vectors):
            cur.execute(
                """
                INSERT INTO embeddings (source_type, source_id, embedding, metadata)
                VALUES (%s, gen_random_uuid(), %s::vector, %s::jsonb)
                """,
                (source_type, json.dumps(vector), json.dumps({"position": idx})),
            )
        conn.commit()
    return len(vectors)


def similarity_search(query_vector: list[float], limit: int = 5) -> list[dict[str, object]]:
    with psycopg.connect(_dsn()) as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT id::text, source_type, source_id::text, metadata,
                   1 - (embedding <=> %s::vector) AS score
            FROM embeddings
            ORDER BY embedding <=> %s::vector
            LIMIT %s
            """,
            (json.dumps(query_vector), json.dumps(query_vector), limit),
        )
        rows = cur.fetchall()
    return [
        {
            "id": row[0],
            "source_type": row[1],
            "source_id": row[2],
            "metadata": row[3],
            "score": float(row[4]),
        }
        for row in rows
    ]
