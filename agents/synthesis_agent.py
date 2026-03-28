from __future__ import annotations

from typing import Literal, TypedDict


class SynthesisInput(TypedDict):
    reasoning_parts: list[str]
    citations: list[str]
    supporting_signals: list[str]
    confidence: float
    risk: float


class SynthesisOutput(TypedDict):
    recommendation: str
    confidence_score: float
    risk_band: Literal["low", "medium", "high"]
    reasoning: str
    citations: list[str]
    supporting_signals: list[str]


def run_synthesis_agent(inputs: SynthesisInput) -> SynthesisOutput:
    risk_band: Literal["low", "medium", "high"]
    if inputs["risk"] >= 0.65:
        risk_band = "high"
        recommendation = "Reduce exposure"
    elif inputs["risk"] >= 0.4:
        risk_band = "medium"
        recommendation = "Hold with caution"
    else:
        risk_band = "low"
        recommendation = "Accumulate on dips"

    reasoning = " ".join(part for part in inputs["reasoning_parts"] if part).strip()
    return {
        "recommendation": recommendation,
        "confidence_score": max(0.0, min(1.0, inputs["confidence"])),
        "risk_band": risk_band,
        "reasoning": reasoning,
        "citations": list(dict.fromkeys(inputs["citations"]))[:6],
        "supporting_signals": list(dict.fromkeys(inputs["supporting_signals"]))[:8],
    }
