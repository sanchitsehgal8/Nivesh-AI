from __future__ import annotations

from typing import Any, Literal, TypedDict

from agents.llm_runtime import run_langchain_hf_synthesis


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
    llm_used: bool
    llm_provider: str | None


def _fallback(payload: dict[str, Any]) -> SynthesisOutput:
    confidence = min(max(float(payload.get("confidence", 0.68)), 0.0), 1.0)
    risk_val = min(max(float(payload.get("risk", 0.45)), 0.0), 1.0)
    risk_band: Literal["low", "medium", "high"] = (
        "low" if risk_val < 0.34 else "medium" if risk_val < 0.67 else "high"
    )

    recommendation = "Hold with caution"
    if confidence > 0.78 and risk_band != "high":
        recommendation = "Accumulate on dips"
    elif risk_band == "high":
        recommendation = "Reduce exposure"

    reasoning_parts = payload.get("reasoning_parts", [])
    reasoning = " | ".join([str(x) for x in reasoning_parts[:3]]) or "Mixed signals across factors."

    return {
        "recommendation": recommendation,
        "confidence_score": confidence,
        "risk_band": risk_band,
        "reasoning": reasoning,
        "citations": [str(c) for c in payload.get("citations", [])][:6],
        "supporting_signals": [str(s) for s in payload.get("supporting_signals", [])][:8],
        "llm_used": False,
        "llm_provider": None,
    }


def run_synthesis_agent(payload: SynthesisInput) -> SynthesisOutput:
    llm_out = run_langchain_hf_synthesis(payload)
    if llm_out.get("llm_used"):
        risk_band = str(llm_out.get("risk_band", "medium")).lower()
        if risk_band not in {"low", "medium", "high"}:
            risk_band = "medium"
        confidence_score = min(max(float(llm_out.get("confidence_score", 0.7)), 0.0), 1.0)
        return {
            "recommendation": str(llm_out.get("recommendation", "Hold with caution")),
            "confidence_score": confidence_score,
            "risk_band": risk_band,  # type: ignore[typeddict-item]
            "reasoning": str(llm_out.get("reasoning", "Insufficient data")),
            "citations": [str(c) for c in llm_out.get("citations", payload.get("citations", []))][:6],
            "supporting_signals": [
                str(s) for s in llm_out.get("supporting_signals", payload.get("supporting_signals", []))
            ][:8],
            "llm_used": True,
            "llm_provider": str(llm_out.get("llm_provider", "huggingface")),
        }

    return _fallback(payload)
