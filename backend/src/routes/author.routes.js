import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';

import { getAuthors, getAuthor, getAuthorPublished } from '../controllers/author.controller.js';
import {
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '../controllers/authorManagement.controller.js';


import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getAuthors);
router.get('/:id', getAuthor);
router.get('/:id/published', getAuthorPublished);


// Admin CRUD (authors)
const rules = [
  body('name').trim().notEmpty().withMessage('Author name is required'),
];

router.post('/', protect, upload.single('photo'), rules, createAuthor);
router.put('/:id', protect, upload.single('photo'), rules, updateAuthor);
router.delete('/:id', protect, deleteAuthor);

export default router;


