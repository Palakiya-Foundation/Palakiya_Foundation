#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/ngo"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

sudo apt update
sudo apt install -y curl git nginx unzip build-essential python3 make g++

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -bash -
sudo apt install -y nodejs
sudo npm install -g pm2

sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER":"$USER" "$APP_DIR"

cd "$BACKEND_DIR"
mkdir -p uploads
if [ ! -f .env ]; then
  cp .env.example .env 2>/dev/null || true
fi
npm install
npm run prisma:generate
npm run prisma:push
npm run seed

cd "$FRONTEND_DIR"
if [ ! -f .env.production ]; then
  cp .env.production.example .env.production 2>/dev/null || true
fi
npm install
npm run build

sudo tee /etc/nginx/sites-available/ngo >/dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/ngo/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /index.html {
      add_header Cache-Control "no-store, no-cache, must-revalidate" always;
      try_files $uri =404;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/ngo /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

cd "$BACKEND_DIR"
pm2 delete ngo-backend >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --env production
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$USER" --hp "$HOME"
