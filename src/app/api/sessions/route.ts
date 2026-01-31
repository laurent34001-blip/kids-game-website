import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const parseLocalDate = (value: string, endOfDay = false) => {
  if (!isDateOnly(value)) {
    return null;
  }
  const [year, month, day] = value.split("-").map((part) => Number(part));
  const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  }
  return date;
};

const parseDateTime = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const fromDate = fromParam
    ? parseLocalDate(fromParam) ?? parseDateTime(fromParam)
    : null;
  const toDate = toParam
    ? parseLocalDate(toParam, true) ?? parseDateTime(toParam)
    : null;

  const from = fromDate ?? (() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  })();
  const to = toDate ?? (() => {
    const end = addDays(from, 6);
    end.setHours(23, 59, 59, 999);
    return end;
  })();

  const sessions = await prisma.session.findMany({
    where: {
      startAt: {
        gte: from,
        lte: to,
      },
    },
    include: {
      workshop: true,
      room: true,
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json({ data: sessions });
}

export async function POST(request: NextRequest) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Corps manquant." }, { status: 400 });
  }

  const { workshopId, roomId, startAt, endAt, maxUnits } = body as {
    workshopId?: string;
    roomId?: string;
    startAt?: string;
    endAt?: string;
    maxUnits?: number;
  };

  if (!workshopId || !roomId || !startAt || !endAt) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  if (!parseDateTime(startAt) || !parseDateTime(endAt)) {
    return NextResponse.json({ error: "Dates invalides." }, { status: 400 });
  }

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
  });
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!workshop || !room) {
    return NextResponse.json({ error: "Atelier ou salle introuvable." }, { status: 404 });
  }

  const finalMaxUnits =
    typeof maxUnits === "number" && Number.isFinite(maxUnits)
      ? maxUnits
      : room.maxUnits;

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  const existing = await prisma.session.findFirst({
    where: {
      workshopId,
      roomId,
      startAt: startDate,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Une session identique existe déjà." },
      { status: 409 },
    );
  }

  const created = await prisma.session.create({
    data: {
      workshopId,
      roomId,
      startAt: startDate,
      endAt: endDate,
      maxUnits: finalMaxUnits,
      status: "OPEN",
      isPrivate: false,
    },
    include: {
      workshop: true,
      room: true,
    },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
