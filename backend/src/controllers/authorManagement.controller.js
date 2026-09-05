import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { resolveImageAsset } from '../utils/media.js';

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
};

// POST /api/authors
export const createAuthor = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;

  const { name, designation, bio } = req.body;
  const photoValue = await resolveImageAsset(req, 'photo', req.file, name);

  const author = await prisma.author.create({
    data: {
      name,
      designation: designation || null,
      bio: bio || null,
      photo: photoValue ?? null,
    },
  });

  res.status(201).json(author);
});

// PUT /api/authors/:id
export const updateAuthor = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.author.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Author not found' });

  if (!validate(req, res)) return;

  const { name, designation, bio } = req.body;

  const data = {
    name: name ?? existing.name,
    designation: designation !== undefined ? designation || null : existing.designation,
    bio: bio !== undefined ? bio || null : existing.bio,
  };

  const photoValue = await resolveImageAsset(req, 'photo', req.file, name || existing.name);
  if (photoValue !== undefined) data.photo = photoValue;

  const author = await prisma.author.update({ where: { id }, data });
  res.json(author);
});

// DELETE /api/authors/:id
export const deleteAuthor = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.author.delete({ where: { id } });
  res.json({ message: 'Author deleted' });
});

