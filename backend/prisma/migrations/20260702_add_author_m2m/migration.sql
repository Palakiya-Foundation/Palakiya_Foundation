-- This migration adds Author management and connects authors to articles.

CREATE TABLE "Author" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "photo" TEXT,
  "designation" TEXT,
  "bio" TEXT
);

-- Create implicit join table for many-to-many between Article and Author
CREATE TABLE "ArticleAuthors" (
  "articleId" INTEGER NOT NULL,
  "authorId" INTEGER NOT NULL,
  PRIMARY KEY ("articleId", "authorId"),
  CONSTRAINT "ArticleAuthors_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ArticleAuthors_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add new column for legacy compatibility if needed (no longer used after app changes)
-- No column changes for Article in this migration.

