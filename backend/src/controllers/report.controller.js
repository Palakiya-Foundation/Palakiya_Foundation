import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uniqueSlug } from '../utils/slug.js';
import { resolveImageAsset } from '../utils/media.js';

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
};

// GET /api/reports
export const getReports = asyncHandler(async (req, res) => {
  const { category, includeUnpublished } = req.query;
  const where = {};
  if (category) where.category = category;
  if (includeUnpublished !== 'true') where.published = true;

  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      authors: { select: { author: true, authorId: true } },
    },
  });
  res.json(reports);
});

// GET /api/reports/:slug
export const getReport = asyncHandler(async (req, res) => {
  const report = await prisma.report.findUnique({
    where: { slug: req.params.slug },
    include: {
      authors: { select: { author: true, authorId: true } },
    },
  });

  if (!report) return res.status(404).json({ message: 'Report not found' });
  res.json(report);
});

// POST /api/reports
export const createReport = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;

  const {
    title,
    excerpt,
    content,
    category,
    authorIds,
    published,
    image,
    driveLink,
    author,
  } = req.body;

  const parsedAuthorIds = (() => {
    if (!authorIds) return [];
    if (Array.isArray(authorIds)) return authorIds.map((x) => Number(x)).filter(Boolean);
    if (typeof authorIds === 'string') {
      const trimmed = authorIds.trim();
      if (!trimmed) return [];
      try {
        const maybe = JSON.parse(trimmed);
        if (Array.isArray(maybe)) return maybe.map((x) => Number(x)).filter(Boolean);
      } catch {}
      return trimmed.split(',').map((x) => Number(x.trim())).filter(Boolean);
    }
    return [];
  })();
  const imageValue = await resolveImageAsset(req, 'image', req.file, title);

  const slug = await uniqueSlug(prisma.report, title);

  const report = await prisma.report.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      category: category || 'Awareness',
      author: author || 'NGO Team',
      published: published !== undefined ? Boolean(published) : true,
      image: imageValue ?? image ?? null,
      driveLink: driveLink || null,
      authors:
        parsedAuthorIds.length > 0
          ? {
              create: parsedAuthorIds.map((authorId) => ({ authorId })),
            }
          : undefined,
    },
    include: {
      authors: { select: { author: true, authorId: true } },
    },
  });

  res.status(201).json(report);
});

// PUT /api/reports/:id
export const updateReport = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;

  const id = Number(req.params.id);
  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Report not found' });

  const {
    title,
    excerpt,
    content,
    category,
    authorIds,
    published,
    image,
    driveLink,
    author,
  } = req.body;

  const parsedAuthorIds = (() => {
    if (!authorIds) return [];
    if (Array.isArray(authorIds)) return authorIds.map((x) => Number(x)).filter(Boolean);
    if (typeof authorIds === 'string') {
      const trimmed = authorIds.trim();
      if (!trimmed) return [];
      try {
        const maybe = JSON.parse(trimmed);
        if (Array.isArray(maybe)) return maybe.map((x) => Number(x)).filter(Boolean);
      } catch {}
      return trimmed.split(',').map((x) => Number(x.trim())).filter(Boolean);
    }
    return [];
  })();

  const data = {
    excerpt,
    content,
    category,
    author: author ?? existing.author,
    published: published !== undefined ? Boolean(published) : existing.published,
  };

  if (title && title !== existing.title) {
    data.title = title;
    data.slug = await uniqueSlug(prisma.report, title, id);
  }

  const imageValue = await resolveImageAsset(req, 'image', req.file, title || existing.title);
  if (imageValue !== undefined) data.image = imageValue;

  if (driveLink !== undefined) data.driveLink = driveLink || null;

  const report = await prisma.report.update({
    where: { id },
    data: {
      ...data,
      authors:
        parsedAuthorIds.length >= 0
          ? {
              deleteMany: {},
              ...(parsedAuthorIds.length > 0
                ? { create: parsedAuthorIds.map((authorId) => ({ authorId })) }
                : {}),
            }
          : undefined,
    },
    include: { authors: { select: { author: true, authorId: true } } },
  });

  res.json(report);
});

// DELETE /api/reports/:id
export const deleteReport = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.report.delete({ where: { id } });
  res.json({ message: 'Report deleted' });
});

