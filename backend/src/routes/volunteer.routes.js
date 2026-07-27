import { Router } from 'express';
import { body } from 'express-validator';
import {
  applyVolunteer,
  getVolunteers,
  approveVolunteer,
  rejectVolunteer,
  deleteVolunteer,
  exportVolunteers,
} from '../controllers/volunteer.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/apply',
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  applyVolunteer
);

router.get('/', protect, getVolunteers);
router.get('/export', protect, exportVolunteers);
router.put('/:id/approve', protect, approveVolunteer);
router.put('/:id/reject', protect, rejectVolunteer);
router.delete('/:id', protect, deleteVolunteer);

export default router;
