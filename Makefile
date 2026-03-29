.PHONY: backend frontend down status up

backend:
	bash scripts/dev_backend.sh 8001

frontend:
	bash scripts/dev_frontend.sh

down:
	-lsof -ti tcp:8001 | xargs -n 1 kill -9
	-lsof -ti tcp:5174 | xargs -n 1 kill -9
	@echo "Stopped backend/frontend ports (8001/5174)."

status:
	@echo "Backend (8001):"
	@lsof -nP -iTCP:8001 -sTCP:LISTEN || true
	@echo "Frontend (5174):"
	@lsof -nP -iTCP:5174 -sTCP:LISTEN || true

up:
	@make down
	nohup bash scripts/dev_backend.sh 8001 >/tmp/nivesh_api.log 2>&1 &
	nohup bash scripts/dev_frontend.sh >/tmp/nivesh_frontend.log 2>&1 &
	@sleep 1
	@echo "Backend health:"
	@curl -sS http://127.0.0.1:8001/health || true
	@echo
	@echo "Frontend URL: http://127.0.0.1:5174"
