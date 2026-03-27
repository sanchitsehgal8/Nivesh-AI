from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


class SignalItem(BaseModel):
    signal_type: Literal["insider_buy", "bulk_deal", "earnings_surprise", "regulatory_change"]
    confidence_score: float = Field(ge=0.0, le=1.0)
    stock_symbol: str
    reasoning_summary: str
    risk_level: Literal["low", "medium", "high"]
    historical_accuracy_reference: float | None = Field(default=None, ge=0.0, le=1.0)
    source_url: HttpUrl | str
    created_at: datetime | None = None


class SignalsResponse(BaseModel):
    signals: list[SignalItem]
