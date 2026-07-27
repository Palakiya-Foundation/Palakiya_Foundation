import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
};

// GET /api/achievements
export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await prisma.achievement.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(achievements);
});

// POST /api/achievements  (admin)
export const createAchievement = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const { title, description, image } = req.body;

  const achievement = await prisma.achievement.create({
    data: {
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
    },
  });
  res.status(201).json(achievement);
});

// PUT /api/achievements/:id  (admin)
export const updateAchievement = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const id = Number(req.params.id);
  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Achievement not found' });

  const { title, description, image } = req.body;
  const data = { title, description };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (image !== undefined) data.image = image || null;

  const achievement = await prisma.achievement.update({ where: { id }, data });
  res.json(achievement);
});

// DELETE /api/achievements/:id  (admin)
export const deleteAchievement = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.achievement.delete({ where: { id } });
  res.json({ message: 'Achievement deleted' });
});
