import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/program.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

router.get('/', getPrograms);
router.get('/:slug', getProgram);
router.post('/', protect, upload.single('image'), rules, createProgram);
router.put('/:id', protect, upload.single('image'), rules, updateProgram);
router.delete('/:id', protect, deleteProgram);

export default router;
