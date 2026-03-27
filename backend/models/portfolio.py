from __future__ import annotations

from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    query: str = Field(min_length=3, max_length=1000)
    portfolio_id: UUID | None = None
    user_id: UUID


class ChatResponse(BaseModel):
    recommendation: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    risk_band: Literal["low", "medium", "high"]
    reasoning: str
    citations: list[str]
    supporting_signals: list[str]


class VideoGenerateRequest(BaseModel):
    date: str
    topics: list[str]


class VideoGenerateResponse(BaseModel):
    video_url: str
    script: str
    duration_seconds: int


class PortfolioAnalysisRequest(BaseModel):
    portfolio_id: UUID


class HoldingItem(BaseModel):
    symbol: str
    quantity: float
    avg_buy_price: float


class PortfolioAnalysisResponse(BaseModel):
    id: UUID
    name: str
    holdings: list[HoldingItem]
    risk_band: Literal["low", "medium", "high"]
