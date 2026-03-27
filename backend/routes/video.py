from __future__ import annotations

from fastapi import APIRouter

from backend.models.portfolio import VideoGenerateRequest, VideoGenerateResponse
from video_engine.script_generator import generate_market_script

router = APIRouter(prefix="/video", tags=["video"])


@router.post("/generate", response_model=VideoGenerateResponse)
async def generate_video(request: VideoGenerateRequest) -> VideoGenerateResponse:
    script = await generate_market_script(request.date, request.topics)
    return VideoGenerateResponse(
        video_url="https://example.com/videos/daily-briefing.mp4",
        script=script,
        duration_seconds=60,
    )
