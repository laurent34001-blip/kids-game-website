import { prisma } from "@/lib/prisma";
import { calculateUnits, chooseFormula } from "@/lib/rules";

type Participant = { type: "CHILD" | "DUO" };
type ReservationWithParticipants = { participants: Participant[] };
type SessionWithDetails = {
  id: string;
  workshopId: string;
  maxUnits: number;
  isPrivate: boolean;
  reservations: ReservationWithParticipants[];
};

export async function recalculateSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      reservations: {
        include: { participants: true },
      },
      workshop: true,
      room: true,
    },
  });

  if (!session) {
    return null;
  }

  const typedSession = session as SessionWithDetails;
  const children = typedSession.reservations.flatMap((reservation) =>
    reservation.participants.filter((p) => p.type === "CHILD"),
  ).length;
  const duos = typedSession.reservations.flatMap((reservation) =>
    reservation.participants.filter((p) => p.type === "DUO"),
  ).length;

  const unitsUsed = calculateUnits(children, duos);
  const totalParticipants = children + duos * 2;

  const rules = await prisma.pricingRule.findMany({
    include: { formula: true },
  });
  const formulas = await prisma.pricingFormula.findMany();
  const formula = chooseFormula(rules, formulas, {
    children,
    duos,
    units: unitsUsed,
    workshopId: typedSession.workshopId,
  });

  const isPrivate =
    unitsUsed >= typedSession.maxUnits || typedSession.isPrivate || false;

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: {
      unitsUsed,
      childrenCount: children,
      duoCount: duos,
      totalParticipants,
      pricingFormulaId: formula?.id ?? null,
      isPrivate,
      status: isPrivate ? "PRIVATE" : "OPEN",
    },
  });

  return updated;
}
