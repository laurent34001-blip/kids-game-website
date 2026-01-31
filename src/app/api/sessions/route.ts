import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const fromDate = fromParam && isValidDate(fromParam) ? new Date(fromParam) : null;
  const toDate = toParam && isValidDate(toParam) ? new Date(toParam) : null;

  const from = fromDate ?? new Date();
  const to = toDate ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

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

  if (!isValidDate(startAt) || !isValidDate(endAt)) {
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
