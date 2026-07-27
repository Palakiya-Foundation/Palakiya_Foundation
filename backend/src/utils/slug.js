// Convert a string into a URL-friendly slug
export const slugify = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Ensure a slug is unique within a Prisma model
export const uniqueSlug = async (model, base, ignoreId = null) => {
  let slug = slugify(base);
  let candidate = slug;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await model.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${slug}-${i++}`;
  }
};
