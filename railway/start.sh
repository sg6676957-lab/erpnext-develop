#!/usr/bin/env bash
set -euo pipefail

BENCH_DIR="/home/frappe/frappe-bench"
export PATH="/home/frappe/.local/bin:${PATH}"
BENCH_BIN="${BENCH_DIR}/env/bin/bench"
if [ ! -x "${BENCH_BIN}" ]; then
  if command -v bench >/dev/null 2>&1; then
    BENCH_BIN="$(command -v bench)"
  else
    echo "bench executable not found; expected ${BENCH_DIR}/env/bin/bench or bench on PATH" >&2
    exit 1
  fi
fi

cd "${BENCH_DIR}"

SITE_NAME="${SITE_NAME:-site1.local}"
ADMIN_PW="${ADMIN_PW:-admin}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_ROOT_USER="${DB_ROOT_USER:-root}"
DB_ROOT_PW="${DB_ROOT_PW:-${MYSQL_ROOT_PASSWORD:-}}"
SOCKETIO_PORT="${SOCKETIO_PORT:-9000}"
GUNICORN_PORT="${GUNICORN_PORT:-8000}"
FRAPPE_REDIS_CACHE="${FRAPPE_REDIS_CACHE:-redis://127.0.0.1:6379}"
FRAPPE_REDIS_QUEUE="${FRAPPE_REDIS_QUEUE:-redis://127.0.0.1:6379}"
FRAPPE_REDIS_SOCKETIO="${FRAPPE_REDIS_SOCKETIO:-${FRAPPE_REDIS_QUEUE}}"

${BENCH_BIN} set-config -g db_host "${DB_HOST}"
${BENCH_BIN} set-config -g db_port "${DB_PORT}"
${BENCH_BIN} set-config -g redis_cache "${FRAPPE_REDIS_CACHE}"
${BENCH_BIN} set-config -g redis_queue "${FRAPPE_REDIS_QUEUE}"
${BENCH_BIN} set-config -g redis_socketio "${FRAPPE_REDIS_SOCKETIO}"
${BENCH_BIN} set-config -g socketio_port "${SOCKETIO_PORT}"
${BENCH_BIN} set-config -g default_site "${SITE_NAME}"

if [ ! -f "${BENCH_DIR}/sites/${SITE_NAME}/site_config.json" ]; then
  if [ -z "${DB_ROOT_PW}" ]; then
    echo "DB_ROOT_PW (or MYSQL_ROOT_PASSWORD) is required to create the site." >&2
    exit 1
  fi
  ${BENCH_BIN} new-site "${SITE_NAME}" \
    --admin-password "${ADMIN_PW}" \
    --db-root-username "${DB_ROOT_USER}" \
    --db-root-password "${DB_ROOT_PW}" \
    --db-host "${DB_HOST}" \
    --db-port "${DB_PORT}" \
    --mariadb-user-host-login-scope "%" \
    --install-app erpnext

  if [ -d "${BENCH_DIR}/apps/hrms" ]; then
    ${BENCH_BIN} --site "${SITE_NAME}" install-app hrms
  fi

  ${BENCH_BIN} --site "${SITE_NAME}" migrate
fi

mkdir -p "${BENCH_DIR}/sites/assets"
if ! compgen -G "${BENCH_DIR}/sites/assets/erpnext/dist/css/erpnext-web.bundle*.css" > /dev/null \
  || ! compgen -G "${BENCH_DIR}/sites/assets/frappe/dist/css/login.bundle*.css" > /dev/null \
  || ! compgen -G "${BENCH_DIR}/sites/assets/frappe/dist/js/frappe-web.bundle*.js" > /dev/null; then
  echo "Missing built assets. Rebuild the image to generate assets in the build stage." >&2
  exit 1
fi

node "${BENCH_DIR}/apps/frappe/socketio.js" &
${BENCH_BIN} worker --queue long,default,short &
${BENCH_BIN} schedule &

export BACKEND="127.0.0.1:${GUNICORN_PORT}"
export SOCKETIO="127.0.0.1:${SOCKETIO_PORT}"

"${BENCH_DIR}/env/bin/gunicorn" \
  --chdir="${BENCH_DIR}/sites" \
  --bind="0.0.0.0:${GUNICORN_PORT}" \
  --threads=4 \
  --workers=2 \
  --worker-class=gthread \
  --worker-tmp-dir=/dev/shm \
  --timeout=120 \
  --preload \
  frappe.app:application &

exec /usr/local/bin/nginx-entrypoint.sh
