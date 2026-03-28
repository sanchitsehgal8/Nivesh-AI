#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-8001}"

if [[ -f "$ROOT_DIR/.venv/bin/activate" ]]; then
  # shellcheck source=/dev/null
  source "$ROOT_DIR/.venv/bin/activate"
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is in use. Run: lsof -nP -iTCP:$PORT -sTCP:LISTEN"
  echo "Then stop old process with: kill <PID>"
  exit 1
fi

cd "$ROOT_DIR"
exec uvicorn backend.main:app --reload --port "$PORT"
