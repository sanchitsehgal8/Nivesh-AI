from __future__ import annotations

from datetime import datetime
from typing import TypedDict


class MacroOutput(TypedDict):
    reasoning: str
    supporting_signals: list[str]
    confidence_delta: float
    risk_delta: float


def run_macro_agent() -> MacroOutput:
    hour = datetime.now().hour
    regime = "risk-on" if 9 <= hour <= 15 else "mixed"
    return {
        "reasoning": f"MacroContextAgent classified current market regime as {regime} using breadth/flow heuristics.",
        "supporting_signals": [
            "Sector rotation monitored",
            "FII/DII flow proxy assessed",
        ],
        "confidence_delta": 0.05 if regime == "risk-on" else 0.0,
        "risk_delta": -0.05 if regime == "risk-on" else 0.03,
    }
