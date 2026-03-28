from __future__ import annotations

from typing import TypedDict

import yfinance as yf


class FundamentalOutput(TypedDict):
    reasoning: str
    supporting_signals: list[str]
    confidence_delta: float
    risk_delta: float


def run_fundamental_agent(symbol: str) -> FundamentalOutput:
    try:
        ticker = yf.Ticker(f"{symbol}.NS")
        info = ticker.info
        pe = float(info.get("trailingPE") or 0.0)
        growth = float(info.get("revenueGrowth") or 0.0)

        supporting = [
            f"Trailing P/E: {pe:.2f}" if pe else "Trailing P/E unavailable",
            f"Revenue growth: {growth * 100:.1f}%" if growth else "Revenue growth unavailable",
        ]
        attractive = (pe and pe < 28) or growth > 0.08
        return {
            "reasoning": (
                f"FundamentalAgent reviewed {symbol}: valuation and growth are "
                f"{'supportive' if attractive else 'mixed'} for medium-term holding."
            ),
            "supporting_signals": supporting,
            "confidence_delta": 0.08 if attractive else -0.03,
            "risk_delta": -0.05 if attractive else 0.06,
        }
    except Exception:  # noqa: BLE001
        return {
            "reasoning": f"FundamentalAgent fallback used for {symbol}; financial snapshot unavailable.",
            "supporting_signals": ["Fallback valuation model", "Neutral growth assumption"],
            "confidence_delta": 0.01,
            "risk_delta": 0.0,
        }
