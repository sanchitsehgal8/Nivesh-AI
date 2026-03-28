from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

import yfinance as yf
from fastapi import APIRouter

from backend.models.market import Candle, OhlcvResponse

router = APIRouter(prefix="/market", tags=["market"])
logger = logging.getLogger(__name__)


def _fallback_candles(symbol: str, count: int = 120) -> list[Candle]:
    base = 2800.0 if symbol == "RELIANCE" else 1450.0 if symbol == "HDFCBANK" else 1600.0
    now = datetime.now(timezone.utc)
    candles: list[Candle] = []
    prev = base
    for i in range(count):
        ts = now - timedelta(minutes=(count - i) * 15)
        drift = ((i % 9) - 4) * 0.35 + (i / count) * 0.25
        close = max(1.0, prev + drift)
        open_price = prev
        high = max(open_price, close) + 1.4
        low = min(open_price, close) - 1.2
        volume = 100000 + (i % 12) * 1800
        candles.append(
            Candle(
                ts=ts,
                open=round(open_price, 2),
                high=round(high, 2),
                low=round(low, 2),
                close=round(close, 2),
                volume=volume,
            )
        )
        prev = close
    return candles


@router.get("/ohlcv/{symbol}", response_model=OhlcvResponse)
async def get_ohlcv(symbol: str, interval: str = "1d", period: str = "6mo") -> OhlcvResponse:
    s = symbol.upper()
    try:
        frame = yf.download(f"{s}.NS", period=period, interval=interval, progress=False, auto_adjust=False)
        if frame.empty:
            candles = _fallback_candles(s)
            return OhlcvResponse(symbol=s, interval=interval, period=period, candles=candles)

        candles = [
            Candle(
                ts=(index.to_pydatetime().replace(tzinfo=timezone.utc) if hasattr(index, "to_pydatetime") else datetime.now(timezone.utc)),
                open=float(row["Open"]),
                high=float(row["High"]),
                low=float(row["Low"]),
                close=float(row["Close"]),
                volume=float(row["Volume"] or 0),
            )
            for index, row in frame.iterrows()
        ]
        return OhlcvResponse(symbol=s, interval=interval, period=period, candles=candles)
    except Exception:  # noqa: BLE001
        logger.exception("Failed to fetch OHLCV for %s", s)
        candles = _fallback_candles(s)
        return OhlcvResponse(symbol=s, interval=interval, period=period, candles=candles)
