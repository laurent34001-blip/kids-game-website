import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Workshop = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export default async function AteliersPage() {
  const ateliers = await prisma.workshop.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Ateliers disponibles</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Consultez les sessions, capacités restantes et formules appliquées.
      </p>

      {ateliers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
          Aucun atelier n&apos;est encore configuré. Ajoutez-les via Prisma ou le
          back-office.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {(ateliers as Workshop[]).map((atelier) => (
            <a
              key={atelier.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-zinc-400"
              href={`/ateliers/${atelier.id}`}
            >
              <h2 className="text-lg font-semibold text-zinc-900">
                {atelier.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                {atelier.description}
              </p>
              <span className="mt-4 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                Catégorie: {atelier.category}
              </span>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
