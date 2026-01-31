/*
  Warnings:

  - You are about to alter the column `heroImages` on the `Workshop` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("json")` to `Json`.
  - You are about to alter the column `highlights` on the `Workshop` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("json")` to `Json`.
  - You are about to alter the column `reviews` on the `Workshop` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("json")` to `Json`.

*/
-- DropIndex
DROP INDEX "AdminSession_userId_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workshop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT,
    "headline" TEXT,
    "mainImage" TEXT,
    "crestImage" TEXT,
    "heroImages" JSONB,
    "priceSolo" TEXT,
    "priceDuo" TEXT,
    "highlights" JSONB,
    "longDescription" TEXT,
    "reviews" JSONB,
    "category" TEXT NOT NULL,
    "basePrice" REAL NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Workshop" ("basePrice", "category", "createdAt", "crestImage", "description", "durationMinutes", "headline", "heroImages", "highlights", "id", "longDescription", "mainImage", "priceDuo", "priceSolo", "reviews", "slug", "title", "updatedAt") SELECT "basePrice", "category", "createdAt", "crestImage", "description", "durationMinutes", "headline", "heroImages", "highlights", "id", "longDescription", "mainImage", "priceDuo", "priceSolo", "reviews", "slug", "title", "updatedAt" FROM "Workshop";
DROP TABLE "Workshop";
ALTER TABLE "new_Workshop" RENAME TO "Workshop";
CREATE UNIQUE INDEX "Workshop_slug_key" ON "Workshop"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
