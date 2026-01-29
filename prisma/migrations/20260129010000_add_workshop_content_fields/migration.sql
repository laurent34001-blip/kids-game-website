-- Add content fields to Workshop
ALTER TABLE "Workshop" ADD COLUMN "crestImage" TEXT;
ALTER TABLE "Workshop" ADD COLUMN "highlights" JSON;
ALTER TABLE "Workshop" ADD COLUMN "longDescription" TEXT;
