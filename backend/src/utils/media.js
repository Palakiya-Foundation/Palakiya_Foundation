const isUploadPath = (value) => value.startsWith('/uploads/');

export const resolveImageValue = (req, field = 'image', file = req.file) => {
  if (file) return `/uploads/${file.filename}`;

  const value = req.body?.[field];
  if (value === undefined) return undefined;

  const trimmed = String(value).trim();
  if (!trimmed || isUploadPath(trimmed)) return trimmed || null;

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    const error = new Error(`${field} must be a valid http or https URL`);
    error.statusCode = 400;
    throw error;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    const error = new Error(`${field} must be a valid http or https URL`);
    error.statusCode = 400;
    throw error;
  }

  return trimmed;
};