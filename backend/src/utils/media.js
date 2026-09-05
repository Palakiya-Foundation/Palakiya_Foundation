import { fetchImage, saveCompressedImage } from './imageProcessor.js';

const isUploadPath = (value) => value.startsWith('/uploads/');

const isGoogleDriveUrl = (value) => {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return ['drive.google.com', 'drive.usercontent.google.com'].includes(host);
  } catch {
    return false;
  }
};

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

export const resolveImageAsset = async (req, field = 'image', file = req.file, originalName = field) => {
  const value = resolveImageValue(req, field, file);
  if (!value || !isGoogleDriveUrl(value)) return value;

  const input = await fetchImage(value);
  const filename = await saveCompressedImage(input, originalName);
  return `/uploads/${filename}`;
};