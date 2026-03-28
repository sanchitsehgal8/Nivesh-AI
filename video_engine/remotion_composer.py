from __future__ import annotations

import json
from pathlib import Path


def compose_remotion_scene(script: str, image_paths: list[str]) -> str:
    out_dir = Path("/tmp/nivesh_ai").resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest = out_dir / "remotion_composition.json"
    manifest.write_text(
        json.dumps(
            {
                "script": script,
                "images": image_paths,
                "fps": 30,
                "duration_seconds": 60,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    return str(manifest)
