from __future__ import annotations

from fastapi import APIRouter

from backend.models.portfolio import VideoGenerateRequest, VideoGenerateResponse
from video_engine.script_generator import generate_market_script

router = APIRouter(prefix="/video", tags=["video"])


@router.post("/generate", response_model=VideoGenerateResponse)
async def generate_video(request: VideoGenerateRequest) -> VideoGenerateResponse:
    script = await generate_market_script(request.date, request.topics)
    # Public, stable sample asset used for local/dev playback reliability.
    generated_url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    duration = max(30, min(90, 35 + len(request.topics) * 8))
    return VideoGenerateResponse(
        video_url=generated_url,
        script=script,
        duration_seconds=duration,
    )
