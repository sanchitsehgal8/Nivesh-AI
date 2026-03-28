from __future__ import annotations

from typing import TypedDict


class PortfolioRiskOutput(TypedDict):
    reasoning: str
    supporting_signals: list[str]
    confidence_delta: float
    risk_delta: float


def run_portfolio_risk_agent(portfolio_id: str | None, holdings_count: int = 3, max_weight: float = 0.4) -> PortfolioRiskOutput:
    concentration = "high" if max_weight >= 0.5 else "moderate" if max_weight >= 0.3 else "low"
    diversified = holdings_count >= 6
    return {
        "reasoning": (
            f"PortfolioRiskAgent assessed portfolio {portfolio_id or 'N/A'} with {concentration} concentration "
            f"and {'adequate' if diversified else 'limited'} diversification."
        ),
        "supporting_signals": [
            f"Estimated max weight: {max_weight:.0%}",
            f"Holdings count: {holdings_count}",
        ],
        "confidence_delta": 0.03,
        "risk_delta": 0.12 if concentration == "high" else 0.05 if concentration == "moderate" else -0.03,
    }
