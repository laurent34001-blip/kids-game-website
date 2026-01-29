import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const atelier = await prisma.workshop.findUnique({
    where: { id: params.id },
  });

  if (!atelier) {
    return NextResponse.json({ error: "Atelier introuvable." }, { status: 404 });
  }

  return NextResponse.json({ data: atelier });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const prismaAny = prisma as typeof prisma & {
    workshop: any;
  };

  if (!params.id) {
    return NextResponse.json({ error: "Atelier introuvable." }, { status: 404 });
  }

  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body.title !== "string") {
      return NextResponse.json({ error: "Titre manquant." }, { status: 400 });
    }

    const current = await prismaAny.workshop.findUnique({
      where: { id: params.id },
      select: { slug: true },
    });

    const incomingSlug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug)
        : null;

    const slug = current
      ? incomingSlug && incomingSlug !== current.slug
        ? incomingSlug
        : null
      : incomingSlug;

    if (slug) {
      const existing = await prismaAny.workshop.findFirst({ where: { slug } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { error: "Ce slug est déjà utilisé." },
          { status: 409 },
        );
      }
    }

    const data = {
      title: body.title.trim(),
      description:
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : "",
      ...(slug ? { slug } : {}),
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
    };

    const atelier = current
      ? await prismaAny.workshop.update({
          where: { id: params.id },
          data,
        })
      : await prismaAny.workshop.create({
          data: {
            id: params.id,
            ...data,
            category: "ARTISTES",
            basePrice: 29.9,
            durationMinutes: 90,
          },
        });

    return NextResponse.json({ data: atelier });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur update atelier", error);
    return NextResponse.json(
      {
        error: "Impossible de mettre à jour l'atelier.",
        detail: process.env.NODE_ENV === "production" ? undefined : message,
      },
      { status: 500 },
    );
  }
}
