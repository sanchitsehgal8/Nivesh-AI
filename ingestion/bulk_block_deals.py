from __future__ import annotations

import csv
import io
import os

import httpx


def fetch_bulk_block_deals(limit: int = 100) -> list[dict[str, str]]:
    url = os.getenv("SEBI_BULK_BLOCK_CSV_URL", "")
    if not url:
        return []
    with httpx.Client(timeout=20.0) as client:
        response = client.get(url)
        response.raise_for_status()
    rows = csv.DictReader(io.StringIO(response.text))
    out: list[dict[str, str]] = []
    for row in rows:
        symbol = str(row.get("Symbol") or row.get("SYMBOL") or "UNKNOWN").upper()
        qty = str(row.get("Quantity") or row.get("QTY") or "")
        out.append(
            {
                "source": "sebi_bulk_block",
                "symbol": symbol,
                "title": "Bulk/Block Deal",
                "text": f"Bulk/block deal in {symbol} quantity {qty}",
                "link": url,
            }
        )
        if len(out) >= limit:
            break
    return out
