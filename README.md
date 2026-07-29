# Palakiya Foundation   Premium NGO Website

A modern, full-stack NGO website with a public-facing site and a powerful admin dashboard.
Built with **React (Vite)** + **Tailwind CSS** on the frontend and **Node.js / Express** + **Prisma / SQLite** on the backend, with **JWT** authentication for the admin.

---

##  Features

### Public Website
- **Home**   animated hero, live impact counters, featured programs, testimonials, latest articles, CTA
- **About**   story, mission & vision, core values, team
- **Programs**   filterable card grid + detailed program pages
- **Gallery**   masonry grid with category filters and keyboard-navigable lightbox
- **Articles**   blog listing with category filters + detail pages
- **Contact**   validated form (saved to DB), contact info, map, social links
- Fully responsive, soft green/blue gradient palette, Framer Motion animations, loading skeletons

### Admin Dashboard (`/admin`)
- Secure JWT login
- Dashboard with stats & recent messages
- CRUD for **Programs**, **Articles**, **Gallery** (file upload *or* image URL)
- View / delete **contact submissions** (with read tracking)
- Edit **homepage content** (hero text, statistics, mission/vision, contact & social)   all dynamic

---

##    Tech Stack

| Layer    | Tech                                                        |
|----------|-------------------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Framer Motion, Axios, Lucide Icons |
| Backend  | Node.js, Express, Prisma ORM, JWT, bcrypt, Multer, express-validator |
| Database | SQLite (via Prisma)                                         |

---

##   Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run setup     # generates Prisma client, creates DB, seeds demo data
npm run dev       # starts API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # starts site on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend automatically.

---

##   Admin Login

```
URL:      http://localhost:5173/admin/login
Email:    admin@ngo.org
Password: admin123
```

> Change these (and `JWT_SECRET`) in `backend/.env` before deploying.

---

##   Project Structure

```
backend/
  prisma/        schema.prisma + seed.js
  src/
    config/      prisma client
    controllers/ route logic (auth, program, article, gallery, contact, content, testimonial)
    middleware/  auth (JWT), error handling, file upload
    routes/      Express routers
    utils/       slug + async helpers
    index.js     server entry
  uploads/       locally stored images
frontend/
  src/
    api/         axios client
    components/  reusable UI (cards, sections, admin modal/toast/etc.)
    context/     auth + site-content providers
    layouts/     public layout
    pages/       public pages + admin/ dashboard pages
    App.jsx      routes
```

---

##  API Overview

| Method | Endpoint                 | Auth | Description                |
|--------|--------------------------|------|----------------------------|
| POST   | `/api/auth/login`        |      | Admin login                |
| GET    | `/api/auth/me`           | âœ…   | Current admin              |
| GET    | `/api/programs`          |      | List programs              |
| GET    | `/api/programs/:slug`    |      | Single program             |
| POST/PUT/DELETE | `/api/programs/:id` | âœ… | Manage programs          |
| GET    | `/api/articles`          |      | List articles              |
| GET    | `/api/articles/:slug`    |      | Single article             |
| POST/PUT/DELETE | `/api/articles/:id` | âœ… | Manage articles          |
| GET    | `/api/gallery`           |      | List gallery images        |
| POST/PUT/DELETE | `/api/gallery/:id`  | âœ… | Manage gallery           |
| POST   | `/api/contacts`          |      | Submit contact form        |
| GET / PATCH / DELETE | `/api/contacts` | âœ… | Manage submissions      |
| GET    | `/api/content`           |      | Site content map           |
| PUT    | `/api/content`           | âœ…   | Update site content        |
| GET    | `/api/testimonials`      |      | List testimonials          |

---

##   Deployment Notes

- **Frontend:** run `npm run build` in `frontend/` â†’ deploy the static `dist/` folder (Netlify, Vercel, etc.). Point the API base / proxy to your backend URL.
- **Backend:** deploy the `backend/` as a Node service. Set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL` env vars. For persistence beyond SQLite, swap the Prisma `datasource` to PostgreSQL.
- **Images:** local uploads are stored in `backend/uploads/`. For production, integrate Cloudinary by swapping `src/middleware/upload.js`.
```

