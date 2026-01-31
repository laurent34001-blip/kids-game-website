const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
    ],
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
    ],
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
    ],
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
    ],
  },
];

const ensureWorkshops = async () => {
  const existing = await prisma.workshop.findMany({
    select: { slug: true },
  });
  const existingSlugs = new Set(
    existing.map((item) => item.slug).filter(Boolean),
  );

  for (const workshop of defaultWorkshops) {
    if (existingSlugs.has(workshop.slug)) {
      continue;
    }
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
  }
};

const ensureRoom = async () => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: "asc" },
  });
  if (rooms.length > 0) {
    return rooms[0];
  }

  return prisma.room.create({
    data: {
      name: "Salle principale",
      maxUnits: 10.5,
      equipment: "Établis, kits créatifs, évier",
    },
  });
};

const seedSessions = async () => {
  const workshops = await prisma.workshop.findMany({
    orderBy: { createdAt: "asc" },
  });
  const room = await ensureRoom();
  const slots = [
    { hour: 9, minute: 0 },
    { hour: 11, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 16, minute: 0 },
  ];

  const primaryWorkshops = workshops.slice(0, 4);
  if (primaryWorkshops.length === 0) {
    return;
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + dayOffset);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    for (const [index, workshop] of primaryWorkshops.entries()) {
      const existing = await prisma.session.findFirst({
        where: {
          workshopId: workshop.id,
          startAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      if (existing) {
        continue;
      }

      const slot = slots[index % slots.length];
      const startAt = new Date(day);
      startAt.setHours(slot.hour, slot.minute, 0, 0);
      const endAt = new Date(
        startAt.getTime() + workshop.durationMinutes * 60 * 1000,
      );

      await prisma.session.create({
        data: {
          workshopId: workshop.id,
          roomId: room.id,
          startAt,
          endAt,
          maxUnits: room.maxUnits,
          status: "OPEN",
          isPrivate: false,
        },
      });
    }
  }
};

async function main() {
  await ensureWorkshops();
  await ensureRoom();
  await seedSessions();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
