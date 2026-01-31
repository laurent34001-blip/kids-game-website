import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const formatDateTime = (value: Date) =>
  value.toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatTime = (value: Date) =>
  value.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatBirthDate = (value: Date | null) =>
  value
    ? value.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

export default async function AdminReservationPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  type ReservationParticipant = {
    id: string;
    type: "ADULT" | "CHILD";
    firstName: string;
    lastName: string | null;
    birthDate: Date | null;
    phone: string | null;
    ageRange: string | null;
  };

  type ReservationRow = {
    id: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhone: string;
    status: string;
    participants: ReservationParticipant[];
    session: {
      startAt: Date;
      endAt: Date;
      workshop: { title: string };
      room: { name: string };
    };
  };

  const reservations = (await prisma.reservation.findMany({
    include: {
      participants: true,
      session: {
        include: {
          workshop: true,
          room: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as unknown as ReservationRow[];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Réservations clients</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Consultez les réservations et les informations associées.
          </p>
        </div>
        <a
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600"
          href="/admin"
        >
          Retour au back-office
        </a>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="grid grid-cols-[1.2fr_1.1fr_1.4fr_1.2fr_1.3fr_0.8fr] gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-xs font-semibold text-zinc-600">
          <span>Client</span>
          <span>Contact</span>
          <span>Atelier</span>
          <span>Session</span>
          <span>Participants</span>
          <span>Statut</span>
        </div>
        <div className="divide-y divide-zinc-100">
          {reservations.length === 0 ? (
            <div className="px-6 py-10 text-sm text-zinc-500">
              Aucune réservation enregistrée.
            </div>
          ) : (
            reservations.map((reservation) => {
              const adults = reservation.participants.filter(
                (participant) => participant.type === "ADULT",
              );
              const children = reservation.participants.filter(
                (participant) => participant.type === "CHILD",
              );

              return (
              <div
                key={reservation.id}
                className="grid grid-cols-[1.2fr_1.1fr_1.4fr_1.2fr_1.3fr_0.8fr] gap-4 px-6 py-4 text-sm"
              >
                <div>
                  <p className="font-semibold text-zinc-900">
                    {reservation.customerFirstName} {reservation.customerLastName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {adults.length} adulte(s) · {children.length} enfant(s)
                  </p>
                </div>
                <div className="text-xs text-zinc-600">
                  <p>{reservation.customerEmail}</p>
                  <p>{reservation.customerPhone}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">
                    {reservation.session.workshop.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {reservation.session.room.name}
                  </p>
                </div>
                <div className="text-xs text-zinc-600">
                  <p>{formatDateTime(reservation.session.startAt)}</p>
                  <p>{formatTime(reservation.session.endAt)}</p>
                </div>
                <div className="text-xs text-zinc-600">
                  <div>
                    <p className="font-semibold text-zinc-700">Adultes</p>
                    {adults.length === 0 ? (
                      <p className="text-zinc-400">—</p>
                    ) : (
                      <ul className="mt-1 space-y-1">
                        {adults.map((adult) => (
                          <li key={adult.id}>
                            {adult.firstName} {adult.lastName ?? ""} · Né(e) le {formatBirthDate(adult.birthDate)} · {adult.phone ?? "—"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="font-semibold text-zinc-700">Enfants</p>
                    {children.length === 0 ? (
                      <p className="text-zinc-400">—</p>
                    ) : (
                      <ul className="mt-1 space-y-1">
                        {children.map((child) => (
                          <li key={child.id}>
                            {child.firstName} · {child.ageRange ?? "—"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    {reservation.status}
                  </span>
                </div>
              </div>
            );
            })
          )}
        </div>
      </div>
    </main>
  );
}
