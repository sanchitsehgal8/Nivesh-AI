from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException

from backend.db.supabase_client import get_supabase_client
from backend.models.portfolio import (
    HoldingItem,
    PortfolioAnalysisRequest,
    PortfolioAnalysisResponse,
)

router = APIRouter(prefix="/portfolio-analysis", tags=["portfolio"])
logger = logging.getLogger(__name__)


def _risk_band(holdings: list[HoldingItem]) -> str:
    if not holdings:
        return "low"
    total_qty = sum(h.quantity for h in holdings) or 1.0
    max_weight = max((h.quantity / total_qty for h in holdings), default=0.0)
    if max_weight >= 0.5:
        return "high"
    if max_weight >= 0.3:
        return "medium"
    return "low"


@router.post("", response_model=PortfolioAnalysisResponse)
async def analyze_portfolio(request: PortfolioAnalysisRequest) -> PortfolioAnalysisResponse:
    try:
        client = get_supabase_client()
        portfolio_resp = (
            client.table("portfolios")
            .select("id,name")
            .eq("id", str(request.portfolio_id))
            .limit(1)
            .execute()
        )
        portfolio_rows = portfolio_resp.data or []
        if not portfolio_rows:
            return PortfolioAnalysisResponse(
                id=request.portfolio_id,
                name="Sample Portfolio",
                holdings=[
                    HoldingItem(symbol="INFY", quantity=40, avg_buy_price=1540),
                    HoldingItem(symbol="RELIANCE", quantity=20, avg_buy_price=2850),
                    HoldingItem(symbol="HDFCBANK", quantity=25, avg_buy_price=1520),
                ],
                risk_band="medium",
            )

        holdings_resp = (
            client.table("holdings")
            .select("symbol,quantity,avg_buy_price")
            .eq("portfolio_id", str(request.portfolio_id))
            .execute()
        )
        holdings = [
            HoldingItem(
                symbol=row["symbol"],
                quantity=float(row.get("quantity") or 0),
                avg_buy_price=float(row.get("avg_buy_price") or 0),
            )
            for row in (holdings_resp.data or [])
        ]
        risk = _risk_band(holdings)
        return PortfolioAnalysisResponse(
            id=UUID(portfolio_rows[0]["id"]),
            name=str(portfolio_rows[0]["name"]),
            holdings=holdings,
            risk_band=risk,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Portfolio analysis failed")
        raise HTTPException(status_code=500, detail="Unable to analyze portfolio") from exc
