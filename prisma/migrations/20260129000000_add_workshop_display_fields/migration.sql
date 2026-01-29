-- Add display fields to Workshop
ALTER TABLE "Workshop" ADD COLUMN "slug" TEXT;
ALTER TABLE "Workshop" ADD COLUMN "headline" TEXT;
ALTER TABLE "Workshop" ADD COLUMN "mainImage" TEXT;
ALTER TABLE "Workshop" ADD COLUMN "heroImages" JSON;
ALTER TABLE "Workshop" ADD COLUMN "priceSolo" TEXT;
ALTER TABLE "Workshop" ADD COLUMN "priceDuo" TEXT;
ALTER TABLE "Workshop" ADD COLUMN "reviews" JSON;

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_slug_key" ON "Workshop"("slug");
