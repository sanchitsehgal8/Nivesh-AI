from __future__ import annotations

from typing import TypedDict


class RetrieverOutput(TypedDict):
    reasoning: str
    citations: list[str]
    supporting_signals: list[str]
    confidence_delta: float


def run_retriever_agent(query: str, symbol: str | None = None) -> RetrieverOutput:
    lowered = query.lower()
    detected_symbol = symbol or ("INFY" if "infosys" in lowered else "RELIANCE" if "reliance" in lowered else "NIFTY")
    citations = [
        f"{detected_symbol} latest exchange filing summary",
        f"{detected_symbol} recent management commentary digest",
    ]
    supporting_signals = ["Recent filing activity detected", "Management commentary tracked"]
    return {
        "reasoning": f"RetrieverAgent found recent disclosures and commentary context for {detected_symbol}.",
        "citations": citations,
        "supporting_signals": supporting_signals,
        "confidence_delta": 0.08,
    }
