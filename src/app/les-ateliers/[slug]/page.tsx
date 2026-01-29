import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const defaultHighlights = [
  "1h30 d'atelier avec un animateur ou une animatrice diplômé.e",
  "Repars à la maison avec ta création",
  "7-12 ans pour les enfants seuls, 4-12 ans avec un adulte accompagnant",
];

const renderRichText = (text: string) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => (
    <p
      key={`${line}-${index}`}
      className="mt-3 text-sm text-zinc-700"
      dangerouslySetInnerHTML={{
        __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
      }}
    />
  ));
};

export default async function AtelierSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const prismaAny = prisma as typeof prisma & {
    workshop: any;
  };

  if (!params.slug) {
    notFound();
  }

  const atelier = await prismaAny.workshop.findUnique({
    where: { slug: params.slug },
  });

  if (!atelier) {
    notFound();
  }

  const heroImages = Array.isArray(atelier.heroImages)
    ? (atelier.heroImages as string[])
    : [];
  const reviews = Array.isArray(atelier.reviews)
    ? (atelier.reviews as { name: string; text: string }[])
    : [];

  return (
    <main className="min-h-screen bg-[#1f3d2a] text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-10 pt-6 min-h-[calc(100vh-80px)]">
        <nav className="text-xs font-semibold uppercase tracking-wide text-white/70">
          <a className="hover:text-white" href="/">
            Accueil
          </a>
          <span className="mx-2">/</span>
          <a className="hover:text-white" href="/#ateliers">
            Ateliers
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">{atelier.title}</span>
        </nav>

        <div className="mt-5">
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">
            {atelier.headline ?? atelier.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            {atelier.description}
          </p>
        </div>

        <div className="mt-8 grid flex-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
          <figure className="overflow-hidden rounded-[28px] bg-[#2d5a3d] shadow-lg">
            {atelier.mainImage ? (
              <img
                className="h-full max-h-[360px] w-full object-cover"
                src={atelier.mainImage}
                alt={atelier.title}
              />
            ) : null}
          </figure>

          <div className="grid gap-4 sm:grid-cols-2">
            {heroImages.map((image) => (
              <div
                key={image}
                className="overflow-hidden rounded-[22px] bg-[#2d5a3d] shadow-lg"
              >
                <img
                  className="h-40 w-full object-cover sm:h-44"
                  src={image}
                  alt={atelier.title}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe3] text-zinc-900">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <div className="flex items-start gap-4">
              {atelier.crestImage ? (
                <img
                  className="h-16 w-16"
                  src={atelier.crestImage}
                  alt="Blason atelier"
                />
              ) : null}
              <div>
                <h2 className="text-2xl font-extrabold">
                  {atelier.headline ?? atelier.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-700">
                  {atelier.description}
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-zinc-800">
              {defaultHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f3d8dc] text-[#6b1515]">
                    ✓
                  </span>
                  <span className="font-semibold text-zinc-900">{item}</span>
                </li>
              ))}
            </ul>

            {atelier.longDescription ? (
              <div className="mt-6 text-sm text-zinc-700">
                {renderRichText(atelier.longDescription)}
              </div>
            ) : null}
          </div>

          <aside className="sticky top-24 self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
              <div className="mt-2 text-center">
                <p className="text-3xl font-extrabold">
                  {atelier.priceSolo ?? "-"}
                </p>
                <p className="text-sm text-zinc-600">par enfant</p>
                <p className="mt-3 text-3xl font-extrabold">
                  {atelier.priceDuo ?? "-"}
                </p>
                <p className="text-sm text-zinc-600">
                  pour un duo Enfant + Adulte
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <a
                  className="flex w-full items-center justify-center rounded-full bg-[#39c24a] px-4 py-3 text-sm font-extrabold text-white shadow-[0_6px_0_0_#1f8f34] transition-transform hover:-translate-y-0.5"
                  href="/reservation"
                >
                  RÉSERVER
                </a>
                <a
                  className="flex w-full items-center justify-center rounded-full bg-[#f8df5a] px-4 py-3 text-xs font-extrabold text-zinc-900 shadow-[0_6px_0_0_#d4b73d] transition-transform hover:-translate-y-0.5"
                  href="/contact"
                >
                  PRIVATISER POUR UN ANNIVERSAIRE
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {reviews.length > 0 ? (
        <section className="bg-[#f7efe3]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <h2 className="text-2xl font-extrabold text-[var(--brand-colors-brand-red-djogo)] md:text-3xl">
              Vous en parlez mieux que nous 💗
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
              {reviews.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-6"
                >
                  <div className="text-xl font-bold text-zinc-900">””</div>
                  <div className="mt-2 flex items-center gap-1 text-[#f4a261]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={`${testimonial.name}-star-${index}`}
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 3.5l2.69 5.45 6.01.87-4.35 4.24 1.03 6-5.38-2.83-5.38 2.83 1.03-6-4.35-4.24 6.01-.87L12 3.5z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-500">
                    {testimonial.name}
                  </p>
                  <p className="mt-3 text-sm text-zinc-800">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
