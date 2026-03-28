from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from backend.models.portfolio import TradeExecuteRequest, TradeExecuteResponse

router = APIRouter(prefix="/trades", tags=["trades"])


@router.post("/execute", response_model=TradeExecuteResponse)
async def execute_trade(request: TradeExecuteRequest) -> TradeExecuteResponse:
    order_id = f"NV-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    estimated_price = 2847.0 if request.symbol.upper() == "RELIANCE" else 1442.0 if request.symbol.upper() == "HDFCBANK" else 987.4
    return TradeExecuteResponse(
        order_id=order_id,
        status="placed",
        symbol=request.symbol.upper(),
        side=request.side,
        quantity=request.quantity,
        estimated_price=estimated_price,
        message=f"Order placed for {request.quantity} shares of {request.symbol.upper()}.",
    )
