import { Router } from 'express';
import { body } from 'express-validator';
import {
  createContact,
  getContacts,
  markRead,
  deleteContact,
} from '../controllers/contact.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  createContact
);

router.get('/', protect, getContacts);
router.patch('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteContact);

export default router;
