from __future__ import annotations

from dataclasses import dataclass

import pandas as pd


@dataclass(slots=True)
class BacktestResult:
    pattern_name: str
    symbol: str
    lookahead_days: int
    sample_size: int
    success_rate: float
    avg_return: float


def backtest_pattern_success(
    symbol: str,
    closes: pd.Series,
    signal_mask: pd.Series,
    lookahead_days: int = 30,
) -> BacktestResult:
    future_returns = closes.shift(-lookahead_days) / closes - 1
    triggered = future_returns[signal_mask.fillna(False)]
    valid = triggered.dropna()
    if len(valid) == 0:
        return BacktestResult(
            pattern_name="unknown",
            symbol=symbol,
            lookahead_days=lookahead_days,
            sample_size=0,
            success_rate=0.0,
            avg_return=0.0,
        )
    success_rate = float((valid > 0).mean())
    avg_return = float(valid.mean())
    return BacktestResult(
        pattern_name="generic",
        symbol=symbol,
        lookahead_days=lookahead_days,
        sample_size=int(len(valid)),
        success_rate=success_rate,
        avg_return=avg_return,
    )
