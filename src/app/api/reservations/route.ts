import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateUnits } from "@/lib/rules";
import { recalculateSession } from "@/lib/session";

type ParticipantType = "CHILD" | "ADULT";
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
    customerFirstName,
    customerLastName,
    customerEmail,
    customerPhone,
    participants = [],
  } = body;

  if (
    !sessionId ||
    !customerFirstName ||
    !customerLastName ||
    !customerEmail ||
    !customerPhone
  ) {
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
  const existingAdults = typedSession.reservations.flatMap((reservation) =>
    reservation.participants.filter((p) => p.type === "ADULT"),
  ).length;

  const newChildren = participants.filter(
    (p: { type: ParticipantType }) => p.type === "CHILD",
  ).length;
  const newAdults = participants.filter(
    (p: { type: ParticipantType }) => p.type === "ADULT",
  ).length;

  const unitsAfter = calculateUnits(
    existingChildren + newChildren,
    existingAdults + newAdults,
  );

  if (unitsAfter > typedSession.maxUnits) {
    return NextResponse.json(
      { error: "Capacité pondérée dépassée." },
      { status: 409 },
    );
  }

  const reservation = await (prisma as any).reservation.create({
    data: {
      sessionId,
      customerFirstName,
      customerLastName,
      customerEmail,
      customerPhone,
      status: "PENDING",
      participants: {
        create: participants.map(
          (participant: {
            type: "CHILD" | "ADULT";
            firstName: string;
            lastName?: string;
            birthDate?: string;
            phone?: string;
            ageRange?: string;
          }) => ({
            type: participant.type,
            firstName: participant.firstName,
            lastName: participant.lastName ?? null,
            birthDate: participant.birthDate
              ? new Date(participant.birthDate)
              : null,
            phone: participant.phone ?? null,
            ageRange: participant.ageRange ?? null,
          }),
        ),
      },
    },
    include: { participants: true },
  });

  await recalculateSession(sessionId);

  return NextResponse.json({ data: reservation }, { status: 201 });
}
