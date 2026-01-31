import { redirect } from "next/navigation";
import type { Workshop } from "@prisma/client";

import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { defaultWorkshops } from "@/lib/workshops";
import AdminAtelierDashboard, {
  type Atelier,
  type AtelierReview,
} from "@/app/admin/atelier/AdminAtelierDashboard";

export const runtime = "nodejs";

export default async function AdminAtelierPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  for (const workshop of defaultWorkshops) {
    const existing = await prisma.workshop.findFirst({
      where: { slug: workshop.slug },
    });

    if (!existing) {
      await prisma.workshop.create({
        data: {
          title: workshop.title,
          description: workshop.description,
          slug: workshop.slug,
          headline: workshop.headline,
          mainImage: workshop.mainImage,
          crestImage: workshop.crestImage,
          heroImages: workshop.heroImages,
          priceSolo: workshop.priceSolo,
          priceDuo: workshop.priceDuo,
          longDescription: workshop.longDescription,
          reviews: workshop.reviews,
          category: "ARTISTES",
          basePrice: 29.9,
          durationMinutes: 90,
        },
      });
    } else {
      const updates: Record<string, unknown> = {};

      if (!existing.headline) {
        updates.headline = workshop.headline;
      }
      if (!existing.mainImage) {
        updates.mainImage = workshop.mainImage;
      }
      if (!existing.crestImage) {
        updates.crestImage = workshop.crestImage;
      }
      if (!existing.priceSolo) {
        updates.priceSolo = workshop.priceSolo;
      }
      if (!existing.priceDuo) {
        updates.priceDuo = workshop.priceDuo;
      }
      if (!existing.longDescription) {
        updates.longDescription = workshop.longDescription;
      }
      const existingHero = Array.isArray(existing.heroImages)
        ? (existing.heroImages as string[])
        : [];
      if (existingHero.length === 0) {
        updates.heroImages = workshop.heroImages;
      }
      const existingReviews = Array.isArray(existing.reviews)
        ? (existing.reviews as AtelierReview[])
        : [];
      if (existingReviews.length === 0) {
        updates.reviews = workshop.reviews;
      }

      if (Object.keys(updates).length > 0 && existing.slug) {
        await prisma.workshop.update({
          where: { slug: existing.slug },
          data: updates,
        });
      }
    }
  }

  const ateliers = await prisma.workshop.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatted = ateliers.map((atelier: Workshop) => ({
    slug: atelier.slug ?? "",
    title: atelier.title,
    headline: atelier.headline ?? null,
    description: atelier.description,
    mainImage: atelier.mainImage ?? null,
    crestImage: atelier.crestImage ?? null,
    heroImages: Array.isArray(atelier.heroImages)
      ? (atelier.heroImages as string[])
      : [],
    priceSolo: atelier.priceSolo ?? null,
    priceDuo: atelier.priceDuo ?? null,
    longDescription: atelier.longDescription ?? null,
    reviews: Array.isArray(atelier.reviews)
      ? (atelier.reviews as AtelierReview[])
      : [],
  })) satisfies Atelier[];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Gestion des ateliers</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Créez et mettez à jour les contenus visibles sur le site public.
          </p>
        </div>
        <a
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600"
          href="/admin"
        >
          Retour au back-office
        </a>
      </div>

      <AdminAtelierDashboard initialAteliers={formatted} />
    </main>
  );
}
