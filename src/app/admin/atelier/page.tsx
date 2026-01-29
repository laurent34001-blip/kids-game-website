import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminAtelierDashboard, {
  type Atelier,
  type AtelierReview,
} from "@/app/admin/atelier/AdminAtelierDashboard";

export const runtime = "nodejs";

const defaultWorkshops = [
  {
    slug: "les-28-dominos-en-bois",
    title: "Les 28 dominos en bois",
    headline: "Fabrique un set de 28 dominos en bois personnalisés !",
    description:
      "Découpe, ponce et décore ton set de dominos en bois, puis repars avec un jeu unique prêt à défier toute la famille.",
    mainImage: "/images/cat_domino.webp",
    crestImage: "/images/blason_scoffs.webp",
    heroImages: [
      "/images/photo_art.webp",
      "/images/photo_peinture.webp",
      "/images/image_animateurs.webp",
      "/images/photo_diner.webp",
    ],
    priceSolo: "29,90 €",
    priceDuo: "39,90 €",
    longDescription:
      "**Déroulé de l'atelier**\nAccueil et découverte des outils.\nPonçage et assemblage des pièces.\nDécoration et finitions pour repartir avec un jeu unique.",
    reviews: [
      {
        name: "Léa, maman de Noé",
        text: "Un atelier très ludique, mon fils était fier de repartir avec son jeu personnalisé !",
      },
      {
        name: "Tom, papa d'Elio",
        text: "On a adoré la partie décoration, c'était créatif et bien encadré.",
      },
    ] satisfies AtelierReview[],
  },
  {
    slug: "barres-cereales",
    title: "Barres de céréales créatives",
    headline:
      "Cuisine de délicieuses barres de céréales créatives pour un max d'énergie !",
    description:
      "Choisis tes ingrédients, mélange, moule et repars avec des barres gourmandes pour toute la semaine.",
    mainImage: "/images/cat_cereal.webp",
    crestImage: "/images/blason_monets.webp",
    heroImages: [
      "/images/photo_cuisine.webp",
      "/images/photo_diner.webp",
      "/images/image_animateurs.webp",
      "/images/photo_art.webp",
    ],
    priceSolo: "29,90 €",
    priceDuo: "39,90 €",
    longDescription:
      "**Déroulé de l'atelier**\nChoix des ingrédients et recettes.\nMélange, moulage et cuisson.\nDégustation et emballage pour repartir avec tes barres.",
    reviews: [
      {
        name: "Marie, maman de Léo",
        text: "Des recettes simples et délicieuses, on s'est régalés !",
      },
      {
        name: "Hugo, papa d'Ana",
        text: "Atelier gourmand et très pédagogique, top pour les enfants.",
      },
    ] satisfies AtelierReview[],
  },
  {
    slug: "peinture-couteau",
    title: "Peinture au couteau",
    headline: "Apprends à peindre avec des couteaux et repars avec ta toile !",
    description:
      "Découvre la peinture au couteau, joue avec les textures et repars avec une œuvre colorée et originale.",
    mainImage: "/images/cat_peinture.webp",
    crestImage: "/images/blason_monets.webp",
    heroImages: [
      "/images/photo_peinture.webp",
      "/images/photo_art.webp",
      "/images/image_animateurs.webp",
      "/images/photo_diner.webp",
    ],
    priceSolo: "29,90 €",
    priceDuo: "39,90 €",
    longDescription:
      "**Déroulé de l'atelier**\nDécouverte des couleurs et textures.\nTechniques de peinture au couteau.\nCréation et finitions pour une toile unique.",
    reviews: [
      {
        name: "Sofia, maman de Lina",
        text: "Une super découverte artistique, le rendu est magnifique !",
      },
      {
        name: "Nicolas, papa d'Iris",
        text: "Encadrement bienveillant, ma fille a adoré manipuler les couteaux.",
      },
    ] satisfies AtelierReview[],
  },
  {
    slug: "le-porte-monnaie-des-aventuriers",
    title: "Le porte-monnaie des aventuriers",
    headline: "Fabrique ton propre porte-monnaie en cuir de A à Z !",
    description:
      "Découvre les gestes des maroquiniers, apprends à couper, percer et assembler le cuir, puis repars avec ta création personnalisée.",
    mainImage: "/images/cat_portefeuille.webp",
    crestImage: "/images/blason_ducs.webp",
    heroImages: [
      "/images/atelier_portefeuille.webp",
      "/images/atelier_portefeuille_2.webp",
      "/images/atelier_portefeuille_3.webp",
      "/images/atelier_portefeuille_4.webp",
    ],
    priceSolo: "29,90 €",
    priceDuo: "39,90 €",
    longDescription:
      "**Déroulé de l'atelier**\nAccueil dans l'atelier des aventuriers : découverte des outils et du cuir.\nChoix du cuir et design.\nFabrication, assemblage et finitions personnalisées.",
    reviews: [
      {
        name: "Aurélie, maman de Léonce",
        text: "Super expérience avec ma fille, on a pas vu le temps passer et on aurait pas pensé réussir à réaliser un si bel objet !",
      },
      {
        name: "Sophie, maman de Lucie",
        text: "Supers ateliers aussi bien pour des enfants que pour des pré-ados ! C'est ludique, instructif, bien cadré !",
      },
      {
        name: "Hervé, papa de Tiego",
        text: "Très bien encadré, beaucoup de pédagogie et de patience. Une super expérience !",
      },
    ] satisfies AtelierReview[],
  },
];

export default async function AdminAtelierPage() {
  const prismaAny = prisma as typeof prisma & {
    workshop: any;
  };
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  for (const workshop of defaultWorkshops) {
    const existing = await prismaAny.workshop.findFirst({
      where: { slug: workshop.slug },
    });

    if (!existing) {
      await prismaAny.workshop.create({
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
    }
  }

  const ateliers = await prismaAny.workshop.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatted = (ateliers as Array<any>).map((atelier) => ({
    id: atelier.id,
    slug: atelier.slug ?? null,
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
