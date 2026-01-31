import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Corps manquant." }, { status: 400 });
  }

  if (Array.isArray(body.ids)) {
    const ids = body.ids.filter((id: unknown) => typeof id === "string");
    if (ids.length === 0) {
      return NextResponse.json({ error: "IDs invalides." }, { status: 400 });
    }

    const result = await prisma.session.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ deleted: result.count });
  }

  const { from, to, roomId, timeSlots } = body as {
    from?: string;
    to?: string;
    roomId?: string;
    timeSlots?: string[];
  };

  if (!from || !to || !roomId || !Array.isArray(timeSlots)) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const startDate = new Date(from);
  const endDate = new Date(to);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "Dates invalides." }, { status: 400 });
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const slots = timeSlots
    .map((slot) => slot.trim())
    .filter(Boolean);
  if (slots.length === 0) {
    return NextResponse.json({ error: "Aucun créneau fourni." }, { status: 400 });
  }

  const times: Date[] = [];
  const dayCount =
    Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1;

  for (let dayOffset = 0; dayOffset < dayCount; dayOffset += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + dayOffset);
    for (const slot of slots) {
      const [hour, minute] = slot.split(":").map((value) => Number(value));
      const startAt = new Date(day);
      startAt.setHours(hour ?? 0, minute ?? 0, 0, 0);
      times.push(startAt);
    }
  }

  const result = await prisma.session.deleteMany({
    where: {
      roomId,
      startAt: { in: times },
    },
  });

  return NextResponse.json({ deleted: result.count });
}
