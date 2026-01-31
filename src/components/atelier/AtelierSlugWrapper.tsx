import { notFound } from "next/navigation";

import AtelierLanding from "@/components/atelier/AtelierLandingClean";
import { prisma } from "@/lib/prisma";
import { findFallbackWorkshopBySlug } from "@/lib/workshops";

type Review = { name: string; text: string };

type AtelierSlugWrapperProps = {
  slug: string;
};

const parseStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const parseReviews = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Review =>
          typeof item === "object" &&
          item !== null &&
          "name" in item &&
          "text" in item &&
          typeof (item as Review).name === "string" &&
          typeof (item as Review).text === "string",
      )
    : [];

export default async function AtelierSlugWrapper({
  slug,
}: AtelierSlugWrapperProps) {
  if (!slug) {
    notFound();
  }

  const atelier = await prisma.workshop.findUnique({
    where: { slug },
  });

  const fallback = atelier ? null : findFallbackWorkshopBySlug(slug);

  if (!atelier && !fallback) {
    notFound();
  }

  const heroImages = atelier?.heroImages
    ? parseStringArray(atelier.heroImages)
    : fallback?.heroImages ?? [];
  const reviews = atelier?.reviews
    ? parseReviews(atelier.reviews)
    : fallback?.reviews ?? [];

  return (
    <AtelierLanding
      atelier={{
        slug: atelier?.slug ?? fallback?.slug ?? slug,
        title: atelier?.title ?? fallback?.title ?? "",
        headline: atelier?.headline ?? fallback?.headline ?? null,
        description: atelier?.description ?? fallback?.description ?? "",
        mainImage: atelier?.mainImage ?? fallback?.mainImage ?? null,
        crestImage: atelier?.crestImage ?? fallback?.crestImage ?? null,
        heroImages,
        priceSolo: atelier?.priceSolo ?? fallback?.priceSolo ?? null,
        priceDuo: atelier?.priceDuo ?? fallback?.priceDuo ?? null,
        longDescription: atelier?.longDescription ?? fallback?.longDescription ?? null,
        reviews,
      }}
    />
  );
}
