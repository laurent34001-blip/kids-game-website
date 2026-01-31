import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateUnits } from "@/lib/rules";

type Participant = { type: "CHILD" | "ADULT" };
type ReservationWithParticipants = { participants: Participant[] };
type SessionWithDetails = {
  id: string;
  startAt: Date;
  endAt: Date;
  room: { id: string; name: string };
  maxUnits: number;
  isPrivate: boolean;
  status: string;
  reservations: ReservationWithParticipants[];
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await context.params;

  const atelier = await prisma.workshop.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!atelier) {
    return NextResponse.json({ error: "Atelier introuvable." }, { status: 404 });
  }

  const sessions = await prisma.session.findMany({
    where: { workshopId: atelier.id },
    include: {
      room: true,
      reservations: {
        include: {
          participants: true,
        },
      },
    },
    orderBy: { startAt: "asc" },
  });

  const data = (sessions as SessionWithDetails[]).map((session) => {
    const children = session.reservations.flatMap((reservation) =>
      reservation.participants.filter((p) => p.type === "CHILD"),
    ).length;
    const adults = session.reservations.flatMap((reservation) =>
      reservation.participants.filter((p) => p.type === "ADULT"),
    ).length;
    const units = calculateUnits(children, adults);

    return {
      id: session.id,
      startAt: session.startAt,
      endAt: session.endAt,
      room: session.room,
      maxUnits: session.maxUnits,
      unitsUsed: units,
      unitsRemaining: Number((session.maxUnits - units).toFixed(2)),
      isPrivate: session.isPrivate,
      status: session.status,
    };
  });

  return NextResponse.json({ data });
}
