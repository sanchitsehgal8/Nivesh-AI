from __future__ import annotations

from typing import TypedDict

import yfinance as yf


class TechnicalOutput(TypedDict):
    reasoning: str
    supporting_signals: list[str]
    confidence_delta: float
    risk_delta: float


def run_technical_agent(symbol: str) -> TechnicalOutput:
    try:
        data = yf.download(f"{symbol}.NS", period="3mo", interval="1d", progress=False, auto_adjust=True)
        if data.empty:
            raise ValueError("No price data")
        close = data["Close"]
        sma20 = float(close.tail(20).mean())
        last = float(close.iloc[-1])
        prev = float(close.iloc[-2]) if len(close) > 1 else last
        momentum_up = last > sma20 and last > prev
        signals = [
            "Price above 20-day mean" if last > sma20 else "Price below 20-day mean",
            "Positive short-term momentum" if last > prev else "Negative short-term momentum",
        ]
        return {
            "reasoning": (
                f"TechnicalAgent scanned {symbol}: price={last:.2f}, 20D mean={sma20:.2f}, "
                f"momentum={'up' if momentum_up else 'down'}."
            ),
            "supporting_signals": signals,
            "confidence_delta": 0.1 if momentum_up else -0.08,
            "risk_delta": -0.08 if momentum_up else 0.12,
        }
    except Exception:  # noqa: BLE001
        return {
            "reasoning": f"TechnicalAgent fallback used for {symbol}; market data unavailable.",
            "supporting_signals": ["Fallback technical profile", "Neutral trend assumption"],
            "confidence_delta": 0.02,
            "risk_delta": 0.0,
        }
