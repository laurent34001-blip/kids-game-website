import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;
  const body = await request.json();
  const isPrivate = Boolean(body.isPrivate ?? true);
  const reason = body.reason ?? null;

  const session = await prisma.session.findUnique({
    where: { id },
  });

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  const updated = await prisma.session.update({
    where: { id },
    data: {
      isPrivate,
      privateReason: reason,
      status: isPrivate ? "PRIVATE" : "OPEN",
    },
  });

  return NextResponse.json({ data: updated });
}
