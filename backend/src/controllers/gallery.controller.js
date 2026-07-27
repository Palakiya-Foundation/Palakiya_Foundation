import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/gallery
export const getGallery = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const where = {};
  if (category && category !== 'All') where.category = category;

  const images = await prisma.gallery.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(images);
});

// POST /api/gallery  (image upload OR image URL)
export const createGalleryImage = asyncHandler(async (req, res) => {
  const { title, category, image } = req.body;
  const src = req.file ? `/uploads/${req.file.filename}` : image;

  if (!src) {
    return res.status(400).json({ message: 'An image file or image URL is required' });
  }

  const item = await prisma.gallery.create({
    data: {
      title: title || null,
      category: category || 'Events',
      image: src,
    },
  });
  res.status(201).json(item);
});

// PUT /api/gallery/:id
export const updateGalleryImage = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { title, category, image } = req.body;
  const data = { title, category };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (image) data.image = image;

  const item = await prisma.gallery.update({ where: { id }, data });
  res.json(item);
});

// DELETE /api/gallery/:id
export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.gallery.delete({ where: { id } });
  res.json({ message: 'Image deleted' });
});
