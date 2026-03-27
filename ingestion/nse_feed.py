from __future__ import annotations

import os

import httpx


def fetch_nse_feed(limit: int = 50) -> list[dict[str, str]]:
    base_url = os.getenv("NSE_BASE_URL", "https://www.nseindia.com/api")
    endpoint = f"{base_url}/corporate-announcements"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
    }
    with httpx.Client(timeout=15.0, headers=headers, follow_redirects=True) as client:
        response = client.get(endpoint)
        response.raise_for_status()
        payload = response.json()

    rows = payload.get("data", []) if isinstance(payload, dict) else []
    out: list[dict[str, str]] = []
    for row in rows[:limit]:
        symbol = str(row.get("symbol", "UNKNOWN")).upper()
        subject = str(row.get("subject", "")).strip()
        details = str(row.get("details", "")).strip()
        out.append(
            {
                "source": "nse_api",
                "symbol": symbol,
                "title": subject,
                "text": f"{subject} {details}".strip(),
                "link": str(row.get("attchmntFile", "")),
            }
        )
    return out
