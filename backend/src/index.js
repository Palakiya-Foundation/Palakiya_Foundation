import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import programRoutes from './routes/program.routes.js';
import articleRoutes from './routes/article.routes.js';
import authorRoutes from './routes/author.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import contactRoutes from './routes/contact.routes.js';
import contentRoutes from './routes/content.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import teamRoutes from './routes/team.routes.js';
import reportRoutes from './routes/report.routes.js';
import volunteerRoutes from './routes/volunteer.routes.js';

import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// --- Static uploads ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Health check ---
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'ngo-backend', time: new Date().toISOString() })
);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/gallery', galleryRoutes);

app.use('/api/contacts', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/volunteers', volunteerRoutes);

// --- Errors ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nNGO API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
