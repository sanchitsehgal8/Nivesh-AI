.PHONY: backend frontend

backend:
	bash scripts/dev_backend.sh 8001

frontend:
	bash scripts/dev_frontend.sh
