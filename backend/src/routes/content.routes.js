import { Router } from 'express';
import { getContent, updateContent } from '../controllers/content.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getContent);
router.put('/', protect, updateContent);

export default router;
