import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { uploadDir } from '../middleware/upload.js';

const MAX_OUTPUT_BYTES = 1024 * 1024;
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

const driveIdFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (!['drive.google.com', 'drive.usercontent.google.com'].includes(parsed.hostname)) return null;
    const queryId = parsed.searchParams.get('id');
    if (queryId) return queryId;
    const fileMatch = parsed.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)/i);
    return fileMatch?.[1] || null;
  } catch {
    return null;
  }
};

const safeName = (name = 'gallery-image') =>
  path
    .basename(name, path.extname(name))
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .slice(0, 40) || 'gallery-image';

export const fetchImage = async (url) => {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Please provide a valid image URL');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Image URL must use http or https');
  }

  const driveId = driveIdFromUrl(url);
  const urls = driveId
    ? [
        `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`,
        `https://drive.google.com/uc?export=download&id=${driveId}&confirm=t`,
      ]
    : [parsed.href];

  let response;
  for (const candidate of urls) {
    response = await fetch(candidate, { redirect: 'follow' });
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.toLowerCase().startsWith('image/')) break;
  }

  const contentType = response?.headers.get('content-type') || '';
  if (!response?.ok || !contentType.toLowerCase().startsWith('image/')) {
    if (driveId) {
      throw new Error(
        'Google Drive image is not publicly accessible. Set General access to Anyone with the link (Viewer), then try again.'
      );
    }
    throw new Error('The URL did not return an image. Please provide a direct image URL.');
  }

  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > MAX_SOURCE_BYTES) throw new Error('Source image must be 15MB or smaller');

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_SOURCE_BYTES) throw new Error('Source image must be 15MB or smaller');
  return buffer;
};

export const saveCompressedImage = async (input, originalName) => {
  let width = 2400;
  let output;

  for (let pass = 0; pass < 6; pass += 1) {
    for (const quality of [82, 72, 62, 52, 42, 32]) {
      output = await sharp(input)
        .rotate()
        .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
      if (output.length <= MAX_OUTPUT_BYTES) break;
    }
    if (output.length <= MAX_OUTPUT_BYTES) break;
    width = Math.floor(width * 0.75);
  }

  if (!output || output.length > MAX_OUTPUT_BYTES) {
    throw new Error('Image could not be compressed below 1MB');
  }

  const filename = `${safeName(originalName)}-${Date.now()}.jpg`;
  await fs.writeFile(path.join(uploadDir, filename), output);
  return filename;
};