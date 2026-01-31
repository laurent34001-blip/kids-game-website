import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Workshop = {
  title: string;
  slug?: string | null;
};

export default async function LesAteliersPage() {
  const ateliers = await prisma.workshop.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Les ateliers</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Liste des ateliers disponibles et leurs slugs associés.
      </p>

      {ateliers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
          Aucun atelier n&apos;est encore configuré.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="grid grid-cols-1 gap-0 divide-y divide-zinc-200">
            {(ateliers as Workshop[]).map((atelier) => {
              const slug = atelier.slug?.trim();
              return (
                <div
                  key={slug ?? atelier.title}
                  className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h2 className="text-base font-semibold text-zinc-900">
                      {atelier.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Slug: {slug ? slug : "(manquant)"}
                    </p>
                  </div>
                  {slug ? (
                    <Link
                      href={`/les-ateliers/${slug}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-600"
                    >
                      Voir la page
                    </Link>
                  ) : (
                    <span className="text-xs text-zinc-400">
                      Aucun lien disponible
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}