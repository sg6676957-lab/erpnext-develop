#!/usr/bin/env bash
set -euo pipefail

BENCH_DIR="/home/frappe/frappe-bench"
BENCH_BIN="${BENCH_DIR}/env/bin/bench"

cd "${BENCH_DIR}"

SITE_NAME="${SITE_NAME:-site1.local}"
ADMIN_PW="${ADMIN_PW:-admin}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_ROOT_USER="${DB_ROOT_USER:-root}"
DB_ROOT_PW="${DB_ROOT_PW:-}"
SOCKETIO_PORT="${SOCKETIO_PORT:-9000}"
FRAPPE_REDIS_CACHE="${FRAPPE_REDIS_CACHE:-redis://127.0.0.1:6379}"
FRAPPE_REDIS_QUEUE="${FRAPPE_REDIS_QUEUE:-redis://127.0.0.1:6379}"
FRAPPE_REDIS_SOCKETIO="${FRAPPE_REDIS_SOCKETIO:-${FRAPPE_REDIS_QUEUE}}"

${BENCH_BIN} set-config -g db_host "${DB_HOST}"
${BENCH_BIN} set-config -g db_port "${DB_PORT}"
${BENCH_BIN} set-config -g redis_cache "${FRAPPE_REDIS_CACHE}"
${BENCH_BIN} set-config -g redis_queue "${FRAPPE_REDIS_QUEUE}"
${BENCH_BIN} set-config -g redis_socketio "${FRAPPE_REDIS_SOCKETIO}"
${BENCH_BIN} set-config -g socketio_port "${SOCKETIO_PORT}"

if [ ! -f "${BENCH_DIR}/sites/${SITE_NAME}/site_config.json" ]; then
  ${BENCH_BIN} new-site "${SITE_NAME}" \
    --admin-password "${ADMIN_PW}" \
    --db-root-username "${DB_ROOT_USER}" \
    --db-root-password "${DB_ROOT_PW}" \
    --db-host "${DB_HOST}" \
    --db-port "${DB_PORT}" \
    --no-mariadb-socket \
    --install-app erpnext

  if [ -d "${BENCH_DIR}/apps/hrms" ]; then
    ${BENCH_BIN} --site "${SITE_NAME}" install-app hrms
  fi

  ${BENCH_BIN} --site "${SITE_NAME}" migrate
fi

node "${BENCH_DIR}/apps/frappe/socketio.js" &
${BENCH_BIN} worker --queue long,default,short &
${BENCH_BIN} schedule &

exec "${BENCH_DIR}/env/bin/gunicorn" \
  --chdir="${BENCH_DIR}/sites" \
  --bind="0.0.0.0:${PORT:-8000}" \
  --threads=4 \
  --workers=2 \
  --worker-class=gthread \
  --worker-tmp-dir=/dev/shm \
  --timeout=120 \
  --preload \
  frappe.app:application
