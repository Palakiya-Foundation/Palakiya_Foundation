import { Router } from 'express';
import {
  getGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/gallery.controller.js';
import { protect } from '../middleware/auth.js';
import { memoryUpload } from '../middleware/upload.js';

const router = Router();

router.get('/', getGallery);
router.post('/', protect, memoryUpload.single('image'), createGalleryImage);
router.put('/:id', protect, memoryUpload.single('image'), updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

export default router;