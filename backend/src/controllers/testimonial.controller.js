import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  const items = await prisma.testimonial.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  res.json(items);
});

// POST /api/testimonials (admin)
export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, quote, order, image } = req.body;
  if (!name || !quote) {
    return res.status(400).json({ message: 'Name and quote are required' });
  }
  const item = await prisma.testimonial.create({
    data: {
      name,
      role: role || null,
      quote,
      order: Number(order) || 0,
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
    },
  });
  res.status(201).json(item);
});

// PUT /api/testimonials/:id (admin)
export const updateTestimonial = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name, role, quote, order, image } = req.body;
  const data = { name, role, quote };
  if (order !== undefined) data.order = Number(order);
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (image !== undefined) data.image = image;

  const item = await prisma.testimonial.update({ where: { id }, data });
  res.json(item);
});

// DELETE /api/testimonials/:id (admin)
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.testimonial.delete({ where: { id } });
  res.json({ message: 'Testimonial deleted' });
});
