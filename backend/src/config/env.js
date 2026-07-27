// Loads environment variables needed by the backend.
// NOTE: Tools may block reading `.env` directly, so always use dotenv at runtime.
import dotenv from 'dotenv';

dotenv.config();

// Export parsed values with safe defaults.
export const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_super_secret_key_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL,
};

