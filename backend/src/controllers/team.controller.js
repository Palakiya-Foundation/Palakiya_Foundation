import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { resolveImageAsset } from '../utils/media.js';

// GET /api/team
export const getTeam = asyncHandler(async (req, res) => {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  res.json(members);
});

// POST /api/team (admin)
export const createTeamMember = asyncHandler(async (req, res) => {
  const { name, role, bio, image, order } = req.body;
  const imageValue = await resolveImageAsset(req, 'image', req.file, name);

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const member = await prisma.teamMember.create({
    data: {
      name: name.trim(),
      role: role || null,
      bio: bio || null,
      order: Number(order) || 0,
      image: imageValue ?? image ?? null,
    },
  });

  res.status(201).json(member);
});

// PUT /api/team/:id (admin)
export const updateTeamMember = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.teamMember.findUnique({ where: { id } });

  if (!existing) return res.status(404).json({ message: 'Team member not found' });

  const { name, role, bio, image, order } = req.body;

  const data = {
    name: (name && name.trim()) || existing.name,
    role: role !== undefined ? (role || null) : existing.role,
    bio: bio !== undefined ? (bio || null) : existing.bio,
    order: order !== undefined ? Number(order) : existing.order,
  };

  const imageValue = await resolveImageAsset(req, 'image', req.file, name || existing.name);
  if (imageValue !== undefined) data.image = imageValue;

  const member = await prisma.teamMember.update({ where: { id }, data });
  res.json(member);
});

// DELETE /api/team/:id (admin)
export const deleteTeamMember = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.teamMember.delete({ where: { id } });
  res.json({ message: 'Team member deleted' });
});
