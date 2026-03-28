# Nivesh-AI

## Quick start (local)

> Recommended Python: 3.11–3.13 (works on 3.14 with current dependency set, but ecosystem support is still evolving).

### 1) Backend API (FastAPI)

1. Create a Python 3.11+ virtual environment and activate it.
2. Install backend dependencies:

	`pip install -r backend/requirements.txt`

3. Copy env template and fill keys:

	`cp .env.example .env`

4. Run API from repo root:

	`uvicorn backend.main:app --reload --port 8000`

	If 8000 is busy, use:

	`uvicorn backend.main:app --reload --port 8001`

	Or use helper script:

	`bash scripts/dev_backend.sh 8001`

5. Verify health:

	`http://localhost:8001/health`

### 2) Frontend app (React + Vite)

1. Install dependencies:

	`cd frontend && npm install`

2. (Optional) set API URL:

	Create `frontend/.env` with:

	`VITE_API_BASE_URL=http://localhost:8001`

3. Run frontend:

	`npm run dev`

	Or use helper script from repo root:

	`bash scripts/dev_frontend.sh`

4. Open:

	`http://localhost:5173`

### 3) Database setup (Supabase)

1. Open Supabase SQL editor.
2. Run [backend/db/schema.sql](backend/db/schema.sql).
3. Ensure pgvector extension is enabled.

### 4) Celery worker (optional next)

1. Ensure Redis/Upstash URL is valid in `.env`.
2. Start worker:

	`celery -A workers.celery_app.celery_app worker -l info`

### 5) Optional scheduled jobs

- Ingest filings: `run_ingest_filings`
- Scan patterns: `run_scan_patterns`
- Generate embeddings: `run_generate_embeddings`
- Render videos: `run_render_video`

You can trigger tasks from a Python shell once worker is up.

### 6) Trigger a first end-to-end check

- Call [backend/routes/signals.py](backend/routes/signals.py) via `GET /signals/latest`
- Call [backend/routes/patterns.py](backend/routes/patterns.py) via `GET /patterns/INFY`
- Use [frontend/src/pages/ChatAssistant.tsx](frontend/src/pages/ChatAssistant.tsx) to test `POST /chat`

## Troubleshooting

- If you see `Address already in use`, free the port:

	`lsof -nP -iTCP:8001 -sTCP:LISTEN`

	`kill <PID>`

- If frontend command fails, use the correct script:

	`npm run dev`

	(not `npm runm dev`)

- If backend exits immediately, check port conflict first and then retry:

	`lsof -nP -iTCP:8001 -sTCP:LISTEN`

	`kill <PID>`

	`bash scripts/dev_backend.sh 8001`

- If backend infra variables are missing, the app serves fallback sample data so UI pages remain functional.

## Notes

- Current implementation is scaffold-level and uses placeholders for some data providers.
- Next production step is wiring real NSE/BSE ingestion APIs and adding secure auth + row-level security in Supabase.
- Set `DATABASE_URL` to use pgvector direct workers in `pipelines/embedding_pipeline.py` and `embeddings/vector_store.py`.