# Railway Deployment (ERPNext + HRMS)

This folder contains everything needed to deploy ERPNext + HRMS on Railway using a Docker build.

## 1) Update `apps.json`
Edit `railway/apps.json` to point to your ERPNext monorepo and branch. HRMS will be installed
from the `hrms-develop/hrms` subdirectory during the Docker build.

## 2) Create `APPS_JSON_BASE64`
From WSL:

```
base64 -w 0 railway/apps.json
```

Set the output as Railway variable `APPS_JSON_BASE64`.

## 3) Required Railway Variables (backend service)

```
FRAPPE_BRANCH=version-16
FRAPPE_PATH=https://github.com/frappe/frappe
APPS_JSON_BASE64=<base64 of apps.json>
PYTHON_VERSION=3.14.2
NODE_VERSION=24.13.0
```

Adjust `FRAPPE_BRANCH` to match your ERPNext branch (e.g. `develop` or `version-17`).

## 4) Create services
Create services from the same repo/image and override start commands:

Backend (default CMD in image, no override needed)
Frontend: `nginx-entrypoint.sh`
Websocket: `node /home/frappe/frappe-bench/apps/frappe/socketio.js`
Queue (short): `bench worker --queue short,default`
Queue (long): `bench worker --queue long,default,short`
Scheduler: `bench schedule`

## 5) One-time site creation (run once)
Create a one-off service or run in a job:

```
bench new-site --mariadb-user-host-login-scope='%' \
  --admin-password=<ADMIN_PW> \
  --db-root-username=root \
  --db-root-password=<DB_ROOT_PW> \
  --install-app erpnext \
  --set-default frontend \
  <SITE_NAME>

bench --site <SITE_NAME> install-app hrms
bench --site <SITE_NAME> migrate
```

## 6) Redis/MariaDB URLs
Set these in each service as needed:

```
FRAPPE_REDIS_CACHE=redis://<redis-cache>:6379
FRAPPE_REDIS_QUEUE=redis://<redis-queue>:6379
SOCKETIO_PORT=9000
```

Replace `<redis-cache>` and `<redis-queue>` with Railway service hostnames.
