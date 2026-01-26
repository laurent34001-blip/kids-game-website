import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateUnits } from "@/lib/rules";
import { recalculateSession } from "@/lib/session";

type ParticipantType = "CHILD" | "DUO";
type Participant = { type: ParticipantType };
type ReservationWithParticipants = { participants: Participant[] };
type SessionWithDetails = {
  id: string;
  maxUnits: number;
  isPrivate: boolean;
  status: string;
  reservations: ReservationWithParticipants[];
};

export async function POST(request: Request) {
  const body = await request.json();
  const {
    sessionId,
    customerName,
    customerEmail,
    customerPhone,
    participants = [],
  } = body;

  if (!sessionId || !customerName || !customerEmail) {
    return NextResponse.json(
      { error: "Champs requis manquants." },
      { status: 400 },
    );
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      reservations: {
        include: { participants: true },
      },
      room: true,
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  if (session.isPrivate || session.status === "PRIVATE") {
    return NextResponse.json(
      { error: "Session privatisée." },
      { status: 409 },
    );
  }

  const typedSession = session as SessionWithDetails;
  const existingChildren = typedSession.reservations.flatMap((reservation) =>
    reservation.participants.filter((p) => p.type === "CHILD"),
  ).length;
  const existingDuos = typedSession.reservations.flatMap((reservation) =>
    reservation.participants.filter((p) => p.type === "DUO"),
  ).length;

  const newChildren = participants.filter(
    (p: { type: ParticipantType }) => p.type === "CHILD",
  ).length;
  const newDuos = participants.filter(
    (p: { type: ParticipantType }) => p.type === "DUO",
  ).length;

  const unitsAfter = calculateUnits(
    existingChildren + newChildren,
    existingDuos + newDuos,
  );

  if (unitsAfter > typedSession.maxUnits) {
    return NextResponse.json(
      { error: "Capacité pondérée dépassée." },
      { status: 409 },
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
      status: "PENDING",
      participants: {
        create: participants.map(
          (participant: {
            type: "CHILD" | "DUO";
            name: string;
            age: number;
            heightCm?: number;
            allergies?: string;
          }) => ({
            type: participant.type,
            name: participant.name,
            age: participant.age,
            heightCm: participant.heightCm,
            allergies: participant.allergies,
          }),
        ),
      },
    },
    include: { participants: true },
  });

  await recalculateSession(sessionId);

  return NextResponse.json({ data: reservation }, { status: 201 });
}
