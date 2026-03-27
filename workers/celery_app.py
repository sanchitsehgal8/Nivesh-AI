from __future__ import annotations

import os

from celery import Celery
from kombu import Exchange, Queue

broker = os.getenv("CELERY_BROKER_URL") or os.getenv("UPSTASH_REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery("nivesh_workers", broker=broker, backend=broker)
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_default_retry_delay=30,
    task_routes={
        "workers.tasks.ingest_filings.*": {"queue": "ingestion"},
        "workers.tasks.scan_patterns.*": {"queue": "patterns"},
        "workers.tasks.generate_embeddings.*": {"queue": "embeddings"},
        "workers.tasks.render_video.*": {"queue": "video"},
    },
    task_queues=(
        Queue("default", Exchange("default"), routing_key="default"),
        Queue("ingestion", Exchange("ingestion"), routing_key="ingestion"),
        Queue("patterns", Exchange("patterns"), routing_key="patterns"),
        Queue("embeddings", Exchange("embeddings"), routing_key="embeddings"),
        Queue("video", Exchange("video"), routing_key="video"),
        Queue("dead_letter", Exchange("dead_letter"), routing_key="dead_letter"),
    ),
)

celery_app.autodiscover_tasks(["workers.tasks"])
