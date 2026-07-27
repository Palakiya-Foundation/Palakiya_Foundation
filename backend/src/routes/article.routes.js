import { Router } from 'express';
import { body } from 'express-validator';
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/article.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

router.get('/', getArticles);
router.get('/:slug', getArticle);
router.post('/', protect, upload.single('image'), rules, createArticle);
router.put('/:id', protect, upload.single('image'), rules, updateArticle);
router.delete('/:id', protect, deleteArticle);

export default router;
