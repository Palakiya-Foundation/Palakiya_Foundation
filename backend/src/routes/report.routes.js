import { Router } from 'express';
import { body } from 'express-validator';
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

router.get('/', getReports);
router.get('/:slug', getReport);
router.post('/', protect, upload.single('image'), rules, createReport);
router.put('/:id', protect, upload.single('image'), rules, updateReport);
router.delete('/:id', protect, deleteReport);

export default router;

