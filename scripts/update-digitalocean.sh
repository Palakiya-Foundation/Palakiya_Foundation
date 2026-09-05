#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/ngo"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

cd "$APP_DIR"
git pull --ff-only

cd "$BACKEND_DIR"
npm install
npm run prisma:generate
pm2 restart index --update-env

cd "$FRONTEND_DIR"
npm install
npm run build

sudo nginx -t
sudo systemctl reload nginx

echo "Deployment updated. Reload the admin page with Ctrl+Shift+R."