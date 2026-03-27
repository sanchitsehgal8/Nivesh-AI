from __future__ import annotations

import os

import feedparser


def fetch_corporate_actions(limit: int = 50) -> list[dict[str, str]]:
    rss_url = os.getenv("CORPORATE_ACTIONS_RSS_URL", "")
    if not rss_url:
        return []
    feed = feedparser.parse(rss_url)
    out: list[dict[str, str]] = []
    for entry in feed.entries[:limit]:
        title = str(entry.get("title", "")).strip()
        summary = str(entry.get("summary", "")).strip()
        symbol = (title.split(" ")[0] if title else "UNKNOWN").upper()
        out.append(
            {
                "source": "corporate_actions",
                "symbol": symbol,
                "title": title,
                "text": f"{title} {summary}".strip(),
                "link": str(entry.get("link", "")),
            }
        )
    return out
