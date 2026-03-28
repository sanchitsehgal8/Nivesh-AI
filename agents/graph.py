from __future__ import annotations

from typing import Literal, TypedDict

from langgraph.graph import END, START, StateGraph

from agents.fundamental_agent import run_fundamental_agent
from agents.macro_agent import run_macro_agent
from agents.portfolio_risk_agent import run_portfolio_risk_agent
from agents.retriever_agent import run_retriever_agent
from agents.sentiment_agent import run_sentiment_agent
from agents.synthesis_agent import run_synthesis_agent
from agents.technical_agent import run_technical_agent


class GraphState(TypedDict, total=False):
    query: str
    user_id: str
    portfolio_id: str | None
    symbol: str
    route: Literal["portfolio", "pattern", "sector"]
    executed_agents: list[str]
    retriever: dict[str, object]
    technical: dict[str, object]
    fundamental: dict[str, object]
    sentiment: dict[str, object]
    macro: dict[str, object]
    portfolio_risk: dict[str, object]
    reasoning_parts: list[str]
    confidence_base: float
    risk_base: float
    citations: list[str]
    supporting_signals: list[str]
    recommendation: str
    confidence_score: float
    risk_band: Literal["low", "medium", "high"]
    reasoning: str
    citations: list[str]
    supporting_signals: list[str]


def _router(state: GraphState) -> GraphState:
    query = state["query"].lower()
    state["symbol"] = _extract_symbol(query)
    state["reasoning_parts"] = []
    state["citations"] = []
    state["supporting_signals"] = []
    state["executed_agents"] = ["router"]
    state["confidence_base"] = 0.62
    state["risk_base"] = 0.45

    if any(k in query for k in ("portfolio", "holdings", "my stocks", "should i hold")):
        state["route"] = "portfolio"
    elif any(k in query for k in ("pattern", "breakout", "macd", "rsi", "chart")):
        state["route"] = "pattern"
    else:
        state["route"] = "sector"
    return state


def _extract_symbol(query: str) -> str:
    tokens = [t.strip("?,.! ") for t in query.upper().split()]
    symbol_map = {
        "INFOSYS": "INFY",
        "RELIANCE": "RELIANCE",
        "TCS": "TCS",
        "HDFCBANK": "HDFCBANK",
        "ICICIBANK": "ICICIBANK",
        "NIFTY": "NIFTY",
    }
    for token in tokens:
        if token in symbol_map:
            return symbol_map[token]
    for token in tokens:
        if token.isalpha() and 2 <= len(token) <= 12:
            return token
    return "INFY"


def _accumulate(state: GraphState, payload: dict[str, object]) -> None:
    reasoning = str(payload.get("reasoning", ""))
    if reasoning:
        state["reasoning_parts"].append(reasoning)
    state["confidence_base"] = state.get("confidence_base", 0.62) + float(payload.get("confidence_delta", 0.0))
    state["risk_base"] = state.get("risk_base", 0.45) + float(payload.get("risk_delta", 0.0))
    state["citations"].extend([str(c) for c in payload.get("citations", [])])
    state["supporting_signals"].extend([str(s) for s in payload.get("supporting_signals", [])])


def _retriever_agent(state: GraphState) -> GraphState:
    state.setdefault("executed_agents", []).append("retriever")
    payload = run_retriever_agent(state["query"], state.get("symbol"))
    state["retriever"] = payload
    _accumulate(state, payload)
    return state


def _technical_agent(state: GraphState) -> GraphState:
    state.setdefault("executed_agents", []).append("technical")
    payload = run_technical_agent(state.get("symbol", "INFY"))
    state["technical"] = payload
    _accumulate(state, payload)
    return state


def _fundamental_agent(state: GraphState) -> GraphState:
    state.setdefault("executed_agents", []).append("fundamental")
    payload = run_fundamental_agent(state.get("symbol", "INFY"))
    state["fundamental"] = payload
    _accumulate(state, payload)
    return state


def _sentiment_agent(state: GraphState) -> GraphState:
    state.setdefault("executed_agents", []).append("sentiment")
    payload = run_sentiment_agent(state["query"])
    state["sentiment"] = payload
    _accumulate(state, payload)
    return state


def _macro_agent(state: GraphState) -> GraphState:
    state.setdefault("executed_agents", []).append("macro")
    payload = run_macro_agent()
    state["macro"] = payload
    _accumulate(state, payload)
    return state


def _portfolio_risk_agent(state: GraphState) -> GraphState:
    state.setdefault("executed_agents", []).append("portfolio_risk")
    payload = run_portfolio_risk_agent(state.get("portfolio_id"), holdings_count=4, max_weight=0.36)
    state["portfolio_risk"] = payload
    _accumulate(state, payload)
    return state


def _synthesis_agent(state: GraphState) -> GraphState:
    state.setdefault("executed_agents", []).append("synthesis")
    state.setdefault("executed_agents", []).append("langchain_pipeline")
    output = run_synthesis_agent(
        {
            "reasoning_parts": state.get("reasoning_parts", []),
            "citations": state.get("citations", [])
            or ["BSE filing digest", "Recent earnings commentary"],
            "supporting_signals": state.get("supporting_signals", []),
            "confidence": state.get("confidence_base", 0.62),
            "risk": state.get("risk_base", 0.45),
        }
    )
    state["recommendation"] = output["recommendation"]
    state["confidence_score"] = output["confidence_score"]
    state["risk_band"] = output["risk_band"]
    state["reasoning"] = output["reasoning"]
    state["citations"] = output["citations"]
    state["supporting_signals"] = output["supporting_signals"]
    if output.get("llm_provider") == "huggingface":
        state.setdefault("executed_agents", []).append("langchain_huggingface")
    return state


def _branch_after_router(state: GraphState) -> str:
    return state["route"]


def _after_technical(state: GraphState) -> str:
    return "fundamental" if state.get("route") == "portfolio" else "sentiment"


def _after_fundamental(state: GraphState) -> str:
    return "sentiment" if state.get("route") == "portfolio" else "synthesis"


def _after_sentiment(state: GraphState) -> str:
    return "macro" if state.get("route") == "portfolio" else "synthesis"


def _after_macro(state: GraphState) -> str:
    return "portfolio_risk" if state.get("route") == "portfolio" else "fundamental"


def build_graph():
    graph = StateGraph(GraphState)
    graph.add_node("router", _router)
    graph.add_node("retriever", _retriever_agent)
    graph.add_node("technical", _technical_agent)
    graph.add_node("fundamental", _fundamental_agent)
    graph.add_node("sentiment", _sentiment_agent)
    graph.add_node("macro", _macro_agent)
    graph.add_node("portfolio_risk", _portfolio_risk_agent)
    graph.add_node("synthesis", _synthesis_agent)

    graph.add_edge(START, "router")
    graph.add_conditional_edges(
        "router",
        _branch_after_router,
        {
            "portfolio": "retriever",
            "pattern": "technical",
            "sector": "macro",
        },
    )

    graph.add_edge("retriever", "technical")
    graph.add_conditional_edges("technical", _after_technical, {"fundamental": "fundamental", "sentiment": "sentiment"})
    graph.add_conditional_edges("fundamental", _after_fundamental, {"sentiment": "sentiment", "synthesis": "synthesis"})
    graph.add_conditional_edges("sentiment", _after_sentiment, {"macro": "macro", "synthesis": "synthesis"})
    graph.add_conditional_edges("macro", _after_macro, {"portfolio_risk": "portfolio_risk", "fundamental": "fundamental"})
    graph.add_edge("portfolio_risk", "synthesis")

    graph.add_edge("synthesis", END)
    return graph.compile()


async def run_investment_graph(query: str, user_id: str, portfolio_id: str | None) -> dict[str, object]:
    app = build_graph()
    state: GraphState = {
        "query": query,
        "user_id": user_id,
        "portfolio_id": portfolio_id,
    }
    output = await app.ainvoke(state)
    return {
        "recommendation": output.get("recommendation", "Hold with caution"),
        "confidence_score": output.get("confidence_score", 0.7),
        "risk_band": output.get("risk_band", "medium"),
        "reasoning": output.get("reasoning", "Insufficient data"),
        "citations": output.get("citations", []),
        "supporting_signals": output.get("supporting_signals", []),
        "agent_route": output.get("route"),
        "agent_trace": output.get("executed_agents", []),
    }
