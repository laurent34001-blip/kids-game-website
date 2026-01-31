import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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
  const slug = params.id?.trim();

  if (!slug) {
    return NextResponse.json({ error: "Slug manquant." }, { status: 400 });
  }

  const atelier = await prisma.workshop.findUnique({
    where: { slug },
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
  const slugParam = params.id?.trim();
  if (!slugParam || slugParam === "undefined" || slugParam === "null") {
    return NextResponse.json({ error: "Slug manquant." }, { status: 400 });
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

    const current = await prisma.workshop.findUnique({
      where: { slug: slugParam },
      select: { id: true, slug: true },
    });

    if (!current) {
      return NextResponse.json(
        { error: "Atelier introuvable." },
        { status: 404 },
      );
    }

    const incomingSlug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug)
        : null;

    const slug =
      incomingSlug && incomingSlug !== current.slug ? incomingSlug : null;

    if (slug) {
      const existing = await prisma.workshop.findFirst({ where: { slug } });
      if (existing) {
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

    const atelier = await prisma.workshop.update({
      where: { id: current.id },
      data,
    });

    if (current.slug) {
      revalidatePath(`/les-ateliers/${current.slug}`);
    }
    if (atelier.slug && atelier.slug !== current.slug) {
      revalidatePath(`/les-ateliers/${atelier.slug}`);
    }

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
