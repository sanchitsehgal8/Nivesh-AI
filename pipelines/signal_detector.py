from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

try:
    from transformers import pipeline
except Exception:  # noqa: BLE001
    pipeline = None  # type: ignore[assignment]

SignalType = Literal["insider_buy", "bulk_deal", "earnings_surprise", "regulatory_change"]


@dataclass(slots=True)
class SignalDetection:
    signal_type: SignalType
    confidence_score: float
    risk_level: Literal["low", "medium", "high"]
    reasoning_summary: str


class FinbertSignalDetector:
    def __init__(self, model_name: str = "ProsusAI/finbert") -> None:
        self._classifier = None
        if pipeline is not None:
            try:
                self._classifier = pipeline("text-classification", model=model_name, tokenizer=model_name)
            except Exception:  # noqa: BLE001
                self._classifier = None

    def classify(self, text: str, metadata: dict[str, str]) -> SignalDetection:
        if self._classifier is None:
            label, score = self._fallback_sentiment(text)
        else:
            sentiment = self._classifier(text[:1024])[0]
            label = str(sentiment["label"]).lower()
            score = float(sentiment["score"])

        signal_type = self._infer_signal_type(text, metadata)
        risk = "medium"
        if "warning" in text.lower() or label == "negative":
            risk = "high"
        elif label == "positive" and score > 0.8:
            risk = "low"

        reason = (
            f"Detected {signal_type.replace('_', ' ')} with FinBERT sentiment={label} "
            f"({score:.2f}) and metadata checks."
        )
        return SignalDetection(
            signal_type=signal_type,
            confidence_score=min(0.98, max(0.5, score)),
            risk_level=risk,
            reasoning_summary=reason,
        )

    @staticmethod
    def _fallback_sentiment(text: str) -> tuple[str, float]:
        lowered = text.lower()
        positive_terms = ("buy", "growth", "profit", "upgrade", "strong", "beat")
        negative_terms = ("sell", "downgrade", "loss", "weak", "penalty", "risk", "warning")
        pos = sum(1 for term in positive_terms if term in lowered)
        neg = sum(1 for term in negative_terms if term in lowered)
        if pos > neg:
            return "positive", min(0.9, 0.55 + (pos - neg) * 0.08)
        if neg > pos:
            return "negative", min(0.9, 0.55 + (neg - pos) * 0.08)
        return "neutral", 0.6

    @staticmethod
    def _infer_signal_type(text: str, metadata: dict[str, str]) -> SignalType:
        lowered = f"{text} {metadata}".lower()
        if "promoter" in lowered or "insider" in lowered:
            return "insider_buy"
        if "bulk" in lowered or "block deal" in lowered:
            return "bulk_deal"
        if "earnings" in lowered or "quarter" in lowered:
            return "earnings_surprise"
        return "regulatory_change"
