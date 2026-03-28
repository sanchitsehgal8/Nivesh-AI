from __future__ import annotations

from fastapi import APIRouter

from backend.models.portfolio import VideoGenerateRequest, VideoGenerateResponse
from video_engine.script_generator import generate_market_script

router = APIRouter(prefix="/video", tags=["video"])


@router.post("/generate", response_model=VideoGenerateResponse)
async def generate_video(request: VideoGenerateRequest) -> VideoGenerateResponse:
    script = await generate_market_script(request.date, request.topics)
    safe_date = request.date.replace("-", "")
    topic_key = "-".join(request.topics[:3]) if request.topics else "market"
    generated_url = f"https://cdn.nivesh.ai/briefings/{safe_date}-{topic_key}.mp4"
    duration = max(30, min(90, 35 + len(request.topics) * 8))
    return VideoGenerateResponse(
        video_url=generated_url,
        script=script,
        duration_seconds=duration,
    )
