from __future__ import annotations

import asyncio

from video_engine.chart_snapshot import render_chart_snapshot
from video_engine.ffmpeg_encoder import encode_video
from video_engine.remotion_composer import compose_remotion_scene
from video_engine.script_generator import generate_market_script
from workers.celery_app import celery_app


@celery_app.task(
    bind=True,
    name="workers.tasks.render_video.run_render_video",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def run_render_video(self, date: str) -> dict[str, str]:  # noqa: ARG001
    topics = ["top_movers", "fii_dii", "breakouts"]
    script = asyncio.run(generate_market_script(date, topics))
    snapshots = [render_chart_snapshot("NIFTY50"), render_chart_snapshot("BANKNIFTY")]
    composition = compose_remotion_scene(script, snapshots)
    output_path = encode_video(composition)
    return {"status": "completed", "date": date, "output_path": output_path}
