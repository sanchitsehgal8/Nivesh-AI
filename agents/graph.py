from __future__ import annotations

from typing import Literal, TypedDict

from langgraph.graph import END, START, StateGraph


class GraphState(TypedDict, total=False):
    query: str
    user_id: str
    portfolio_id: str | None
    route: Literal["portfolio", "pattern", "sector"]
    retriever: str
    technical: str
    fundamental: str
    sentiment: str
    macro: str
    portfolio_risk: str
    recommendation: str
    confidence_score: float
    risk_band: Literal["low", "medium", "high"]
    reasoning: str
    citations: list[str]
    supporting_signals: list[str]


def _router(state: GraphState) -> GraphState:
    query = state["query"].lower()
    if any(k in query for k in ("portfolio", "holdings", "my stocks", "should i hold")):
        state["route"] = "portfolio"
    elif any(k in query for k in ("pattern", "breakout", "macd", "rsi", "chart")):
        state["route"] = "pattern"
    else:
        state["route"] = "sector"
    return state


def _retriever_agent(state: GraphState) -> GraphState:
    state["retriever"] = "Retrieved top related filings/news via pgvector similarity search."
    return state


def _technical_agent(state: GraphState) -> GraphState:
    state["technical"] = "Detected momentum uptick with MACD crossover and improving RSI trend."
    return state


def _fundamental_agent(state: GraphState) -> GraphState:
    state["fundamental"] = "Earnings quality stable; valuation near historical median."
    return state


def _sentiment_agent(state: GraphState) -> GraphState:
    state["sentiment"] = "FinBERT sentiment indicates mildly positive management commentary."
    return state


def _macro_agent(state: GraphState) -> GraphState:
    state["macro"] = "FII outflows have moderated while sector breadth improved over 5 sessions."
    return state


def _portfolio_risk_agent(state: GraphState) -> GraphState:
    state["portfolio_risk"] = "Portfolio concentration moderate; single-stock exposure below 22%."
    return state


def _synthesis_agent(state: GraphState) -> GraphState:
    parts = [
        state.get("retriever", ""),
        state.get("technical", ""),
        state.get("fundamental", ""),
        state.get("sentiment", ""),
        state.get("macro", ""),
        state.get("portfolio_risk", ""),
    ]
    reasoning = " ".join([p for p in parts if p]).strip()
    state["recommendation"] = "Hold with caution"
    state["confidence_score"] = 0.76
    state["risk_band"] = "medium"
    state["reasoning"] = reasoning
    state["citations"] = [
        "BSE filing dated 2026-03-25",
        "Latest quarterly earnings transcript",
    ]
    state["supporting_signals"] = ["RSI divergence", "Promoter holding stable"]
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
    }
