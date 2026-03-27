from __future__ import annotations

import os

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
except Exception:  # noqa: BLE001
    ChatGoogleGenerativeAI = None  # type: ignore[assignment]


async def generate_market_script(date: str, topics: list[str]) -> str:
    topic_text = ", ".join(topics)
    api_key = os.getenv("GOOGLE_GEMINI_API_KEY", "")
    if not api_key or ChatGoogleGenerativeAI is None:
        return (
            f"Good evening. This is your Nivesh AI market briefing for {date}. "
            f"Today we cover {topic_text}. We saw selective strength in quality large caps, "
            "momentum in breakout names, and cautious positioning in rate-sensitive sectors. "
            "Review risk bands before acting on short-term signals."
        )

    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=api_key,
        temperature=0.3,
    )
    prompt = (
        "Create a 30-90 second market briefing script for India equities. "
        f"Date: {date}. Topics: {topic_text}. "
        "Style: concise, explainable, risk-aware, with clear transitions."
    )
    response = await model.ainvoke(prompt)
    return str(response.content)
