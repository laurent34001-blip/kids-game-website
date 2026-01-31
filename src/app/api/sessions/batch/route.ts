import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const isValidDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value);

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map((part) => Number(part));
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
};

const withTime = (date: Date, time: string) => {
  const [hour, minute] = time.split(":").map((part) => Number(part));
  const next = new Date(date);
  next.setHours(hour ?? 0, minute ?? 0, 0, 0);
  return next;
};

export async function POST(request: NextRequest) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Corps manquant." }, { status: 400 });
  }

  const { from, to, roomId, maxUnits, timeSlots } = body as {
    from?: string;
    to?: string;
    roomId?: string;
    maxUnits?: number;
    timeSlots?: string[];
  };

  if (!from || !to || !roomId || !Array.isArray(timeSlots)) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  if (!isValidDate(from) || !isValidDate(to)) {
    return NextResponse.json({ error: "Dates invalides." }, { status: 400 });
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Salle introuvable." }, { status: 404 });
  }

  const workshops = await prisma.workshop.findMany({
    orderBy: { createdAt: "asc" },
  });
  const workshopSelection = workshops.slice(0, 4);

  if (workshopSelection.length === 0) {
    return NextResponse.json(
      { error: "Aucun atelier disponible." },
      { status: 409 },
    );
  }

  const startDate = parseLocalDate(from);
  const endDate = parseLocalDate(to);
  endDate.setHours(23, 59, 59, 999);

  if (startDate > endDate) {
    return NextResponse.json(
      { error: "La date de début est après la date de fin." },
      { status: 400 },
    );
  }

  const sanitizedSlots = timeSlots
    .map((slot) => slot.trim())
    .filter(Boolean);

  if (sanitizedSlots.length === 0) {
    return NextResponse.json(
      { error: "Aucun créneau horaire sélectionné." },
      { status: 400 },
    );
  }

  const created: Array<{
    id: string;
    startAt: Date;
    endAt: Date;
    maxUnits: number;
    status: "DRAFT" | "OPEN" | "PRIVATE" | "CANCELLED";
    isPrivate: boolean;
    workshopId: string;
    workshop: { title: string; durationMinutes: number };
    roomId: string;
    room: { name: string };
    unitsUsed: number;
    totalParticipants: number;
  }> = [];

  const dayCount =
    Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1;

  for (let dayOffset = 0; dayOffset < dayCount; dayOffset += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + dayOffset);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    for (const [index, workshop] of workshopSelection.entries()) {
      const slot = sanitizedSlots[index % sanitizedSlots.length];
      const startAt = withTime(day, slot);
      const endAt = new Date(
        startAt.getTime() + workshop.durationMinutes * 60 * 1000,
      );

      const existing = await prisma.session.findFirst({
        where: {
          workshopId: workshop.id,
          roomId: room.id,
          startAt,
        },
      });

      if (existing) {
        continue;
      }

      const session = await prisma.session.create({
        data: {
          workshopId: workshop.id,
          roomId: room.id,
          startAt,
          endAt,
          maxUnits: typeof maxUnits === "number" ? maxUnits : room.maxUnits,
          status: "OPEN",
          isPrivate: false,
        },
        include: {
          workshop: true,
          room: true,
        },
      });

      created.push(session);
    }
  }

  return NextResponse.json({ data: created }, { status: 201 });
}
