#!/usr/bin/env sh
set -eu

until python - <<'PY'
import os, time
import psycopg2
url = os.environ.get("DATABASE_URL")
assert url, "DATABASE_URL not set"
try:
    psycopg2.connect(url).close()
except Exception as e:
    raise SystemExit(1)
PY
do
  echo "[entrypoint] waiting for postgres..."
  sleep 1
done

cd /app
echo "[entrypoint] running alembic upgrade..."
alembic upgrade head

echo "[entrypoint] starting gunicorn..."
exec gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
