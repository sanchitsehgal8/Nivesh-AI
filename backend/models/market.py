from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class Candle(BaseModel):
    ts: datetime
    open: float = Field(ge=0)
    high: float = Field(ge=0)
    low: float = Field(ge=0)
    close: float = Field(ge=0)
    volume: float = Field(ge=0)


class OhlcvResponse(BaseModel):
    symbol: str
    interval: str
    period: str
    source: str = "live"
    candles: list[Candle]
