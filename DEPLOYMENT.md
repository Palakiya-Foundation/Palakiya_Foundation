# DigitalOcean deployment guide

This project can be hosted on a single Ubuntu droplet using:
- Node.js + Express backend
- Vite frontend built as static files
- Nginx as a reverse proxy
- PM2 to keep the backend running

This guide assumes you are using password-based SSH/SFTP access to the droplet.

## 1. Create the droplet

In DigitalOcean:
- Create a Ubuntu 22.04 or 24.04 droplet
- Choose a plan with at least 1 GB RAM
- Use a password for the root user login
- Note the droplet IP address

## 2. Upload the project to the droplet

Use SFTP (FileZilla / WinSCP) or SCP with your password.

Recommended target folder:
- /var/www/ngo

Upload the whole project folder so the structure looks like:
- /var/www/ngo/backend
- /var/www/ngo/frontend
- /var/www/ngo/scripts

## 3. Connect to the droplet

```bash
ssh root@YOUR_DROPLET_IP
```

If your server uses a different user, replace root with that user.

## 4. Run the setup script

```bash
cd /var/www/ngo
chmod +x scripts/setup-digitalocean.sh
./scripts/setup-digitalocean.sh
```

This script will:
- install Node.js, Nginx, and PM2
- install backend/frontend dependencies
- build the frontend
- create a production Nginx config
- start the backend with PM2

## 5. Configure environment variables

The setup script will create example env files if needed. Edit them before starting the app:

```bash
nano /var/www/ngo/backend/.env
nano /var/www/ngo/frontend/.env.production
```

Recommended backend values:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=http://YOUR_DOMAIN_OR_IP
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Recommended frontend value:

```env
VITE_API_URL=/api
```

## 6. Start and verify

```bash
cd /var/www/ngo/backend
pm2 status
curl http://127.0.0.1:5000/api/health
```

Then open your droplet IP in the browser.

## 7. Deploy later GitHub changes

After pushing changes to GitHub, run the update script on the droplet. A Git pull alone does not update the ignored Vite `frontend/dist` build served by Nginx.

```bash
cd /var/www/ngo
chmod +x scripts/update-digitalocean.sh
./scripts/update-digitalocean.sh
```

Then reload the admin page with `Ctrl+Shift+R`.

## 8. Optional: add a domain

If you want a custom domain:
- point your domain to the droplet IP
- update `server_name` in the Nginx config
- run:

```bash
sudo certbot --nginx -d yourdomain.com
```

## Notes

- This setup uses SQLite, so database data will live on the droplet disk.
- For a production app with more traffic, consider moving to PostgreSQL later.
- The uploaded images are stored in the backend uploads folder, so make sure that folder is writable.
