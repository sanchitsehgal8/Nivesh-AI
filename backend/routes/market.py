from __future__ import annotations

import logging
import random
from datetime import datetime, timedelta, timezone

import yfinance as yf
from fastapi import APIRouter

from backend.models.market import Candle, OhlcvResponse

router = APIRouter(prefix="/market", tags=["market"])
logger = logging.getLogger(__name__)


def _to_yf_symbol(symbol: str) -> str:
    s = symbol.upper()
    if s in {"NIFTY", "NIFTY50", "NIFTY_50"}:
        return "^NSEI"
    if s in {"BANKNIFTY", "NIFTYBANK", "NIFTY_BANK"}:
        return "^NSEBANK"
    return f"{s}.NS"


def _interval_minutes(interval: str) -> int:
    iv = interval.lower().strip()
    mapping = {
        "1m": 1,
        "2m": 2,
        "5m": 5,
        "15m": 15,
        "30m": 30,
        "60m": 60,
        "90m": 90,
        "1h": 60,
        "1d": 60 * 24,
        "1wk": 60 * 24 * 7,
        "1mo": 60 * 24 * 30,
        "3mo": 60 * 24 * 90,
    }
    return mapping.get(iv, 60 * 24)


def _period_days(period: str) -> int:
    p = period.lower().strip()
    mapping = {
        "5d": 5,
        "1mo": 30,
        "3mo": 90,
        "6mo": 180,
        "1y": 365,
        "2y": 730,
        "5y": 1825,
        "10y": 3650,
        "ytd": 180,
        "max": 3650,
    }
    return mapping.get(p, 180)


def _fallback_candles(symbol: str, interval: str, period: str) -> list[Candle]:
    base = 2800.0 if symbol == "RELIANCE" else 1450.0 if symbol == "HDFCBANK" else 1600.0
    step_minutes = _interval_minutes(interval)
    total_minutes = _period_days(period) * 24 * 60
    count = max(80, min(420, int(total_minutes / max(1, step_minutes))))

    seed = abs(hash(f"{symbol}:{interval}:{period}")) % (2**32)
    rng = random.Random(seed)

    now = datetime.now(timezone.utc)
    candles: list[Candle] = []
    prev = base + rng.uniform(-0.02, 0.02) * base

    for i in range(count):
        ts = now - timedelta(minutes=(count - i) * step_minutes)

        annual_drift = 0.12
        annual_vol = 0.28
        dt = max(1e-6, step_minutes / (365.0 * 24 * 60))
        shock = rng.gauss(0.0, 1.0)
        ret = (annual_drift - 0.5 * annual_vol**2) * dt + annual_vol * (dt**0.5) * shock

        close = max(1.0, prev * (1.0 + ret))
        open_price = prev * (1.0 + rng.uniform(-0.0015, 0.0015))
        high = max(open_price, close) * (1.0 + rng.uniform(0.0008, 0.008))
        low = min(open_price, close) * (1.0 - rng.uniform(0.0008, 0.008))
        volume = max(1000.0, rng.lognormvariate(11.5, 0.35))

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
        frame = yf.download(_to_yf_symbol(s), period=period, interval=interval, progress=False, auto_adjust=False)
        if frame.empty:
            candles = _fallback_candles(s, interval=interval, period=period)
            return OhlcvResponse(symbol=s, interval=interval, period=period, source="fallback", candles=candles)

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
        return OhlcvResponse(symbol=s, interval=interval, period=period, source="live", candles=candles)
    except Exception:  # noqa: BLE001
        logger.exception("Failed to fetch OHLCV for %s", s)
        candles = _fallback_candles(s, interval=interval, period=period)
        return OhlcvResponse(symbol=s, interval=interval, period=period, source="fallback", candles=candles)
