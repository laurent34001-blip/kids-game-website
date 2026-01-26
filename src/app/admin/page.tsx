export default function AdminPage() {
  const modules = [
    {
      title: "Ateliers & sessions",
      description: "Créer des ateliers, planifier les sessions et gérer les jauges.",
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
            <button className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white">
              Ouvrir le module
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
