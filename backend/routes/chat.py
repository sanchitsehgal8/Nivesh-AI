from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from agents.graph import run_investment_graph
from backend.models.portfolio import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        result = await run_investment_graph(
            query=request.query,
            user_id=str(request.user_id),
            portfolio_id=str(request.portfolio_id) if request.portfolio_id else None,
        )
        return ChatResponse(**result)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Chat pipeline failed")
        raise HTTPException(status_code=500, detail="Unable to process chat query") from exc
