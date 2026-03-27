from __future__ import annotations

import feedparser

BSE_RSS_URL = "https://www.bseindia.com/xml-data/corpfiling/ann.xml"


def fetch_bse_rss(limit: int = 50) -> list[dict[str, str]]:
    feed = feedparser.parse(BSE_RSS_URL)
    out: list[dict[str, str]] = []
    for entry in feed.entries[:limit]:
        title = str(entry.get("title", "")).strip()
        summary = str(entry.get("summary", "")).strip()
        link = str(entry.get("link", "")).strip()
        symbol = (title.split(" ")[0] if title else "UNKNOWN").upper()
        out.append(
            {
                "source": "bse_rss",
                "symbol": symbol,
                "title": title,
                "text": f"{title} {summary}".strip(),
                "link": link,
            }
        )
    return out
