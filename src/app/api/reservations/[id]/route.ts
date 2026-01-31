import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recalculateSession } from "@/lib/session";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;
  const body = await request.json();

  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      customerFirstName: body.customerFirstName ?? reservation.customerFirstName,
      customerLastName: body.customerLastName ?? reservation.customerLastName,
      customerEmail: body.customerEmail ?? reservation.customerEmail,
      customerPhone: body.customerPhone ?? reservation.customerPhone,
      status: body.status ?? reservation.status,
    },
  });

  if (body.participants) {
    await prisma.participant.deleteMany({ where: { reservationId: id } });
    await prisma.participant.createMany({
      data: body.participants.map(
        (participant: {
          type: "CHILD" | "ADULT";
          firstName: string;
          lastName?: string;
          birthDate?: string;
          phone?: string;
          ageRange?: string;
        }) => ({
          reservationId: id,
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
    });
  }

  await recalculateSession(reservation.sessionId);

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  await prisma.reservation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  await recalculateSession(reservation.sessionId);

  return NextResponse.json({ success: true });
}
