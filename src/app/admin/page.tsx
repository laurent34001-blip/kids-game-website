import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const modules = [
    {
      title: "Ateliers",
      description: "Créer et éditer les ateliers (images, tarifs, avis).",
      href: "/admin/atelier",
    },
    {
      title: "Sessions",
      description: "Planifier les sessions, gérer les jauges et privatisations.",
      href: "/admin/session",
    },
    {
      title: "Animateurs",
      description: "Compétences, disponibilités et affectations par atelier.",
    },
    {
      title: "Salles",
      description: "Capacité pondérée, équipements et conflits de planning.",
    },
    {
      title: "Règles tarifaires",
      description: "Formules automatiques, priorités et privatisations.",
    },
    {
      title: "Réservations",
      description: "Liste, modifications, annulations et exports.",
      href: "/admin/reservation",
    },
    {
      title: "Opérations internes",
      description: "Stocks, propreté, café, tâches et suivi qualité.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Back-office DJOGO</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Centralisez la gestion des ateliers, des règles métier et des équipes.
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Connecté en tant que {session.user.email}.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <div
            key={module.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              {module.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{module.description}</p>
            {module.href ? (
              <a
                className="mt-4 inline-flex rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
                href={module.href}
              >
                Ouvrir le module
              </a>
            ) : (
              <button className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white">
                Ouvrir le module
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
