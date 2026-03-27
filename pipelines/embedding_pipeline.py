from __future__ import annotations

import json
import os
from hashlib import sha256
from dataclasses import dataclass
from typing import Sequence
from uuid import UUID

import psycopg
try:
    from sentence_transformers import SentenceTransformer
except Exception:  # noqa: BLE001
    SentenceTransformer = None  # type: ignore[assignment]


@dataclass(slots=True)
class EmbeddingRecord:
    source_type: str
    source_id: UUID
    text: str
    metadata: dict[str, object]


class EmbeddingPipeline:
    def __init__(self, dsn: str) -> None:
        model_name = os.getenv("SENTENCE_TRANSFORMER_MODEL", "all-MiniLM-L6-v2")
        self._model = SentenceTransformer(model_name) if SentenceTransformer is not None else None
        self._dsn = dsn

    def upsert_records(self, records: Sequence[EmbeddingRecord]) -> int:
        if not records:
            return 0
        if self._model is not None:
            vectors = self._model.encode([r.text for r in records], normalize_embeddings=True)
            vector_payload = [v.tolist() for v in vectors]
        else:
            vector_payload = [self._fallback_embedding(r.text) for r in records]

        with psycopg.connect(self._dsn) as conn, conn.cursor() as cur:
            for record, vector in zip(records, vector_payload, strict=True):
                cur.execute(
                    """
                    INSERT INTO embeddings (source_type, source_id, embedding, metadata)
                    VALUES (%s, %s, %s::vector, %s::jsonb)
                    ON CONFLICT (source_type, source_id)
                    DO UPDATE SET embedding = EXCLUDED.embedding, metadata = EXCLUDED.metadata
                    """,
                    (
                        record.source_type,
                        str(record.source_id),
                        json.dumps(vector),
                        json.dumps(record.metadata),
                    ),
                )
            conn.commit()
        return len(records)

    @staticmethod
    def _fallback_embedding(text: str) -> list[float]:
        digest = sha256(text.encode("utf-8")).digest()
        base = [(b / 255.0) * 2.0 - 1.0 for b in digest]
        repeated = (base * (384 // len(base) + 1))[:384]
        norm = sum(x * x for x in repeated) ** 0.5 or 1.0
        return [x / norm for x in repeated]
