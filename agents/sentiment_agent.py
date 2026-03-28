from __future__ import annotations

from typing import TypedDict

from pipelines.signal_detector import FinbertSignalDetector


class SentimentOutput(TypedDict):
    reasoning: str
    supporting_signals: list[str]
    confidence_delta: float
    risk_delta: float


def run_sentiment_agent(text: str) -> SentimentOutput:
    detector = FinbertSignalDetector()
    detection = detector.classify(text, metadata={"source": "chat_query"})
    return {
        "reasoning": (
            f"SentimentAgent inferred {detection.risk_level} risk sentiment from query context "
            f"with confidence {detection.confidence_score:.2f}."
        ),
        "supporting_signals": [
            f"Derived signal type: {detection.signal_type}",
            f"Sentiment confidence: {detection.confidence_score:.2f}",
        ],
        "confidence_delta": (detection.confidence_score - 0.5) * 0.3,
        "risk_delta": 0.1 if detection.risk_level == "high" else -0.05 if detection.risk_level == "low" else 0.0,
    }
