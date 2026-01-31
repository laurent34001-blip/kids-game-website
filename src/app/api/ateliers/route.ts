import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function GET() {
  const ateliers = await prisma.workshop.findMany({
    orderBy: { title: "asc" },
  });

  return NextResponse.json({ data: ateliers });
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string") {
    return NextResponse.json({ error: "Titre manquant." }, { status: 400 });
  }

  const title = body.title.trim();
  const slug = body.slug && typeof body.slug === "string"
    ? slugify(body.slug)
    : slugify(title);

  const existingSlug = slug
    ? await prisma.workshop.findUnique({ where: { slug } })
    : null;
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  const atelier = await prisma.workshop.create({
    data: {
      title,
      description:
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : "Description à compléter pour cet atelier.",
      slug: finalSlug || null,
      headline:
        typeof body.headline === "string" && body.headline.trim()
          ? body.headline.trim()
          : null,
      mainImage:
        typeof body.mainImage === "string" && body.mainImage.trim()
          ? body.mainImage.trim()
          : null,
      crestImage:
        typeof body.crestImage === "string" && body.crestImage.trim()
          ? body.crestImage.trim()
          : null,
      heroImages: Array.isArray(body.heroImages) ? body.heroImages : [],
      priceSolo:
        typeof body.priceSolo === "string" && body.priceSolo.trim()
          ? body.priceSolo.trim()
          : null,
      priceDuo:
        typeof body.priceDuo === "string" && body.priceDuo.trim()
          ? body.priceDuo.trim()
          : null,
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      longDescription:
        typeof body.longDescription === "string" && body.longDescription.trim()
          ? body.longDescription.trim()
          : null,
      reviews: Array.isArray(body.reviews) ? body.reviews : [],
      category: "ARTISTES",
      basePrice: 29.9,
      durationMinutes: 90,
    },
  });

  if (atelier.slug) {
    revalidatePath(`/les-ateliers/${atelier.slug}`);
  }

  return NextResponse.json({ data: atelier });
}
