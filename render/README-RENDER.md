# Render Deploy Notes

This repo deploys to Render using `render.yaml` at the repo root and the Dockerfile at `railway/Dockerfile`.

Key inputs you will set in Render:
- `SITE_NAME`
- `ADMIN_PW`
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`

The app boot script is `render/start.sh`. It will create the site on first boot and then start socketio, workers, scheduler, and gunicorn in a single container.
