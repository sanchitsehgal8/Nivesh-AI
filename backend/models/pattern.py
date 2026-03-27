from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class PatternItem(BaseModel):
    pattern_name: str
    timeframe: str
    confidence: float = Field(ge=0.0, le=1.0)
    plain_english_summary: str
    backtest_success_rate: float = Field(ge=0.0, le=1.0)
    detected_at: datetime


class PatternsResponse(BaseModel):
    symbol: str
    patterns: list[PatternItem]
