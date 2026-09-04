import { Router } from 'express';
import { getContent, updateContent } from '../controllers/content.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const imageKeys = [
	'hero_img_1', 'hero_img_2', 'hero_img_3', 'hero_img_4',
	'hero_avatar_1', 'hero_avatar_2', 'hero_avatar_3', 'hero_avatar_4',
	'home_intro_image', 'join_us_img_1', 'join_us_img_2', 'about_page_image',
];

router.get('/', getContent);
router.put('/', protect, upload.fields(imageKeys.map((name) => ({ name, maxCount: 1 }))), updateContent);

export default router;
