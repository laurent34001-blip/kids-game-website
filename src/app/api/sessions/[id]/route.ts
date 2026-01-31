import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  const session = await prisma.session.findUnique({
    where: { id },
  });

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Corps manquant." }, { status: 400 });
  }

  const updates: {
    startAt?: Date;
    endAt?: Date;
    roomId?: string;
    maxUnits?: number;
    status?: "DRAFT" | "OPEN" | "PRIVATE" | "CANCELLED";
    isPrivate?: boolean;
    workshopId?: string;
  } = {};

  if (typeof body.startAt === "string" && isValidDate(body.startAt)) {
    updates.startAt = new Date(body.startAt);
  }
  if (typeof body.endAt === "string" && isValidDate(body.endAt)) {
    updates.endAt = new Date(body.endAt);
  }
  if (typeof body.roomId === "string") {
    const room = await prisma.room.findUnique({ where: { id: body.roomId } });
    if (!room) {
      return NextResponse.json({ error: "Salle introuvable." }, { status: 404 });
    }
    updates.roomId = room.id;
  }
  if (typeof body.workshopId === "string") {
    const workshop = await prisma.workshop.findUnique({
      where: { id: body.workshopId },
    });
    if (!workshop) {
      return NextResponse.json({ error: "Atelier introuvable." }, { status: 404 });
    }
    updates.workshopId = workshop.id;
  }
  if (typeof body.maxUnits === "number" && Number.isFinite(body.maxUnits)) {
    updates.maxUnits = body.maxUnits;
  }
  if (typeof body.status === "string") {
    updates.status = body.status as
      | "DRAFT"
      | "OPEN"
      | "PRIVATE"
      | "CANCELLED";
  }
  if (typeof body.isPrivate === "boolean") {
    updates.isPrivate = body.isPrivate;
  }

  const targetWorkshopId = updates.workshopId ?? session.workshopId;
  const targetRoomId = updates.roomId ?? session.roomId;
  const targetStartAt = updates.startAt ?? session.startAt;

  const duplicate = await prisma.session.findFirst({
    where: {
      workshopId: targetWorkshopId,
      roomId: targetRoomId,
      startAt: targetStartAt,
      NOT: { id },
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { error: "Une session identique existe déjà." },
      { status: 409 },
    );
  }

  const updated = await prisma.session.update({
    where: { id },
    data: updates,
    include: {
      workshop: true,
      room: true,
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await prisma.session.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  await prisma.session.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
