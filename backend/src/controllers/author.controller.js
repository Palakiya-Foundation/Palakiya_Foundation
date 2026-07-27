import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/authors
export const getAuthors = asyncHandler(async (req, res) => {
  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      photo: true,
      designation: true,
    },
  });

  res.json(authors);
});

// GET /api/authors/:id
export const getAuthor = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const author = await prisma.author.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      photo: true,
      designation: true,
      bio: true,
      articles: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          category: true,
          createdAt: true,
        },
      },
    },
  });

  if (!author) return res.status(404).json({ message: 'Author not found' });
  res.json(author);
});

// GET /api/authors/:id/published?excludeSlug=:slug
// Used by the author modal on article detail page.
export const getAuthorPublished = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const excludeSlug = req.query.excludeSlug;

  const author = await prisma.author.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      photo: true,
      designation: true,
      bio: true,
      // total published count
      articles: {
  where: {
    article: {
      published: true,
    },
  },
},
    },
  });

  if (!author) return res.status(404).json({ message: 'Author not found' });

  // Second query: fetch published articles (excluding current). No N+1 because it's a single relation query.
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      authors: {
        some: {
          authorId: id,
        },
      },
      ...(excludeSlug ? { slug: { not: excludeSlug } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      createdAt: true,
    },
  });

  res.json({
    id: author.id,
    name: author.name,
    photo: author.photo,
    designation: author.designation,
    bio: author.bio,
    totalPublishedCount: author.articles.length,
    articles,
  });
});


