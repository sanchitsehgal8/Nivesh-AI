from __future__ import annotations

from pathlib import Path


def render_chart_snapshot(symbol: str) -> str:
    out_dir = Path("/tmp/nivesh_ai").resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{symbol}_snapshot.png"
    # Minimal placeholder PNG bytes header so downstream pipeline has a real file.
    path.write_bytes(b"\x89PNG\r\n\x1a\n")
    return str(path)
