from __future__ import annotations

import csv
import io
import os

import httpx


def fetch_insider_trades(limit: int = 100) -> list[dict[str, str]]:
    url = os.getenv("SEBI_INSIDER_TRADES_CSV_URL", "")
    if not url:
        return []
    with httpx.Client(timeout=20.0) as client:
        response = client.get(url)
        response.raise_for_status()
    rows = csv.DictReader(io.StringIO(response.text))
    out: list[dict[str, str]] = []
    for row in rows:
        symbol = str(row.get("Symbol") or row.get("SYMBOL") or "UNKNOWN").upper()
        trade_type = str(row.get("Acquisition/Disposal") or row.get("TRADE_TYPE") or "trade")
        out.append(
            {
                "source": "sebi_insider",
                "symbol": symbol,
                "title": "Insider Trade",
                "text": f"Insider {trade_type} reported for {symbol}",
                "link": url,
            }
        )
        if len(out) >= limit:
            break
    return out
