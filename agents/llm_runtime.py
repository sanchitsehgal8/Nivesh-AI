from __future__ import annotations

import json
import os
import re
from typing import Any

from langchain_community.llms import HuggingFaceEndpoint
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate


def _extract_json(text: str) -> dict[str, Any] | None:
    text = text.strip()
    try:
        obj = json.loads(text)
        if isinstance(obj, dict):
            return obj
    except Exception:  # noqa: BLE001
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        obj = json.loads(match.group(0))
        return obj if isinstance(obj, dict) else None
    except Exception:  # noqa: BLE001
        return {"llm_used": False, "llm_provider": None}


def _build_hf_llm() -> HuggingFaceEndpoint | None:
    token = os.getenv("HF_API_TOKEN") or os.getenv("HUGGINGFACEHUB_API_TOKEN")
    model = os.getenv("HF_MODEL_ID", "Qwen/Qwen2.5-7B-Instruct")
    if not token:
        return None

    return HuggingFaceEndpoint(
        repo_id=model,
        huggingfacehub_api_token=token,
        task="text-generation",
        max_new_tokens=500,
        temperature=0.2,
        top_p=0.9,
        repetition_penalty=1.05,
    )


def run_langchain_hf_synthesis(payload: dict[str, Any]) -> dict[str, Any]:
    llm = _build_hf_llm()
    if llm is None:
        return {"llm_used": False, "llm_provider": None}

    prompt = PromptTemplate.from_template(
        """
You are an Indian equities copilot. Return ONLY strict JSON with keys:
recommendation, confidence_score, risk_band, reasoning, citations, supporting_signals.

Input:
- reasoning_parts: {reasoning_parts}
- citations: {citations}
- supporting_signals: {supporting_signals}
- confidence_base: {confidence}
- risk_base: {risk}

Rules:
- risk_band must be one of: low, medium, high
- confidence_score in [0,1]
- recommendation concise (e.g., "Hold with caution")
- reasoning max 120 words
"""
    )

    try:
        chain = prompt | llm | StrOutputParser()
        raw = chain.invoke(
            {
                "reasoning_parts": payload.get("reasoning_parts", []),
                "citations": payload.get("citations", []),
                "supporting_signals": payload.get("supporting_signals", []),
                "confidence": payload.get("confidence", 0.65),
                "risk": payload.get("risk", 0.45),
            }
        )

        parsed = _extract_json(raw)
        if not parsed:
            return {"llm_used": False, "llm_provider": None}

        return {
            "llm_used": True,
            "llm_provider": "huggingface",
            "recommendation": str(parsed.get("recommendation", "Hold with caution")),
            "confidence_score": float(parsed.get("confidence_score", 0.7)),
            "risk_band": str(parsed.get("risk_band", "medium")).lower(),
            "reasoning": str(parsed.get("reasoning", "Insufficient data")),
            "citations": [str(x) for x in parsed.get("citations", payload.get("citations", []))],
            "supporting_signals": [
                str(x) for x in parsed.get("supporting_signals", payload.get("supporting_signals", []))
            ],
        }
    except Exception:  # noqa: BLE001
        return None
        
