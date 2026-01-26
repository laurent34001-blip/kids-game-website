import { prisma } from "@/lib/prisma";
import { calculateUnits } from "@/lib/rules";

type Participant = { type: "CHILD" | "DUO" };
type ReservationWithParticipants = { participants: Participant[] };
type SessionWithDetails = {
  id: string;
  startAt: Date;
  endAt: Date;
  maxUnits: number;
  status: string;
  room: { name: string };
  reservations: ReservationWithParticipants[];
};
type WorkshopWithSessions = {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  basePrice: number;
  sessions: SessionWithDetails[];
};

export default async function AtelierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const atelier = (await prisma.workshop.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          reservations: { include: { participants: true } },
          room: true,
        },
        orderBy: { startAt: "asc" },
      },
    },
  })) as WorkshopWithSessions | null;

  if (!atelier) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Atelier introuvable</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Cet atelier n&apos;existe pas ou a été supprimé.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">{atelier.title}</h1>
        <p className="mt-2 text-sm text-zinc-600">{atelier.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
          <span>Catégorie: {atelier.category}</span>
          <span>Durée: {atelier.durationMinutes} min</span>
          <span>Prix de base: {atelier.basePrice.toFixed(2)} €</span>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Disponibilités</h2>
        {atelier.sessions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
            Aucune session planifiée.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {atelier.sessions.map((session) => {
              const children = session.reservations.flatMap((reservation) =>
                reservation.participants.filter((p) => p.type === "CHILD"),
              ).length;
              const duos = session.reservations.flatMap((reservation) =>
                reservation.participants.filter((p) => p.type === "DUO"),
              ).length;
              const units = calculateUnits(children, duos);
              const remaining = Number((session.maxUnits - units).toFixed(2));

              return (
                <div
                  key={session.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {new Date(session.startAt).toLocaleString("fr-FR")}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Salle: {session.room.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                      Restant: {remaining} unités
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-zinc-500 md:grid-cols-3">
                    <span>Enfants seuls: {children}</span>
                    <span>Duos: {duos}</span>
                    <span>Statut: {session.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
