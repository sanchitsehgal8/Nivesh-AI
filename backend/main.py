from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.chat import router as chat_router
from backend.routes.patterns import router as patterns_router
from backend.routes.portfolio import router as portfolio_router
from backend.routes.signals import router as signals_router
from backend.routes.video import router as video_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Nivesh AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signals_router)
app.include_router(patterns_router)
app.include_router(chat_router)
app.include_router(portfolio_router)
app.include_router(video_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
