import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/team.controller.js';

const router = Router();

const rules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
];

router.get('/', getTeam);

router.post('/', protect, upload.single('image'), rules, createTeamMember);
router.put('/:id', protect, upload.single('image'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

export default router;
