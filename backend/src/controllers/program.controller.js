import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uniqueSlug } from '../utils/slug.js';

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
};

// GET /api/programs
export const getPrograms = asyncHandler(async (req, res) => {
  const { featured, category } = req.query;
  const where = {};
  if (featured === 'true') where.featured = true;
  if (category) where.category = category;

  const programs = await prisma.program.findMany({
    where,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  res.json(programs);
});

// GET /api/programs/:slug
export const getProgram = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const program = await prisma.program.findUnique({ where: { slug } });
  if (!program) return res.status(404).json({ message: 'Program not found' });
  res.json(program);
});

// POST /api/programs
export const createProgram = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const { title, summary, description, category, icon, featured, order, image } = req.body;

  const slug = await uniqueSlug(prisma.program, title);
  const program = await prisma.program.create({
    data: {
      title,
      slug,
      summary,
      description,
      category: category || 'Community',
      icon: icon || 'HeartHandshake',
      featured: Boolean(featured),
      order: Number(order) || 0,
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
    },
  });
  res.status(201).json(program);
});

// PUT /api/programs/:id
export const updateProgram = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const id = Number(req.params.id);
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Program not found' });

  const { title, summary, description, category, icon, featured, order, image } = req.body;
  const data = {
    summary,
    description,
    category,
    icon,
    featured: featured !== undefined ? Boolean(featured) : existing.featured,
    order: order !== undefined ? Number(order) : existing.order,
  };
  if (title && title !== existing.title) {
    data.title = title;
    data.slug = await uniqueSlug(prisma.program, title, id);
  }
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (image !== undefined) data.image = image;

  const program = await prisma.program.update({ where: { id }, data });
  res.json(program);
});

// DELETE /api/programs/:id
export const deleteProgram = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.program.delete({ where: { id } });
  res.json({ message: 'Program deleted' });
});
