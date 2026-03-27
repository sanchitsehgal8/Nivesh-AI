from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

import pandas as pd
import yfinance as yf
from ta.momentum import RSIIndicator
from ta.trend import MACD
from ta.volatility import BollingerBands


@dataclass(slots=True)
class PatternSignal:
    symbol: str
    pattern_name: str
    confidence: float
    summary: str
    timeframe: str
    detected_at: datetime


def scan_symbol_patterns(symbol: str, period: str = "6mo", interval: str = "1d") -> list[PatternSignal]:
    frame = yf.download(f"{symbol}.NS", period=period, interval=interval, progress=False, auto_adjust=True)
    if frame.empty:
        return []

    close = frame["Close"]
    high = frame["High"]
    low = frame["Low"]
    volume = frame["Volume"]
    out: list[PatternSignal] = []
    now = datetime.now(timezone.utc)

    macd_df = MACD(close=close, window_fast=12, window_slow=26, window_sign=9)
    macd_line = macd_df.macd()
    macd_signal = macd_df.macd_signal()
    if len(macd_line.dropna()) > 0 and len(macd_signal.dropna()) > 0 and float(macd_line.iloc[-1]) > float(macd_signal.iloc[-1]):
        out.append(
            PatternSignal(
                symbol=symbol,
                pattern_name="Bullish MACD Crossover",
                confidence=0.80,
                summary="MACD crossed above signal line, indicating momentum shift.",
                timeframe=interval.upper(),
                detected_at=now,
            )
        )

    rsi = RSIIndicator(close=close, window=14).rsi()
    if len(rsi.dropna()) > 5 and float(rsi.iloc[-1]) > 55:
        out.append(
            PatternSignal(
                symbol=symbol,
                pattern_name="RSI Strength Recovery",
                confidence=0.72,
                summary="RSI moved back above 55 after a weak phase.",
                timeframe=interval.upper(),
                detected_at=now,
            )
        )

    bbands = BollingerBands(close=close, window=20, window_dev=2)
    bb_high = bbands.bollinger_hband()
    if len(bb_high.dropna()) > 0 and float(close.iloc[-1]) > float(bb_high.iloc[-1]):
        out.append(
            PatternSignal(
                symbol=symbol,
                pattern_name="Upper Bollinger Break",
                confidence=0.66,
                summary="Price closed above upper Bollinger Band with expansion potential.",
                timeframe=interval.upper(),
                detected_at=now,
            )
        )

    vol_spike = float(volume.iloc[-1]) > float(pd.Series(volume).tail(20).mean() * 1.5)
    breakout = float(close.iloc[-1]) >= float(high.tail(20).max() * 0.995)
    if vol_spike and breakout:
        out.append(
            PatternSignal(
                symbol=symbol,
                pattern_name="Volume Breakout",
                confidence=0.78,
                summary="20-day high breakout with significant volume confirmation.",
                timeframe=interval.upper(),
                detected_at=now,
            )
        )
    return out
