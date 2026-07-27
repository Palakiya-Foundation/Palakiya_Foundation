import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievement.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

router.get('/', getAchievements);
router.post('/', protect, upload.single('image'), rules, createAchievement);
router.put('/:id', protect, upload.single('image'), rules, updateAchievement);
router.delete('/:id', protect, deleteAchievement);

export default router;
