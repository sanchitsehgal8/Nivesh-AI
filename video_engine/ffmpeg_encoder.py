from __future__ import annotations

from pathlib import Path


def encode_video(input_manifest: str) -> str:
    out_dir = Path("/tmp/nivesh_ai").resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    output = out_dir / "daily_briefing.mp4"
    # Placeholder bytes for local development pipelines.
    output.write_bytes(b"\x00\x00\x00\x18ftypmp42")
    _ = input_manifest
    return str(output)
