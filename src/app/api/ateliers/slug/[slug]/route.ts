import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const atelier = await prisma.workshop.findUnique({
    where: { slug },
  });

  if (!atelier) {
    return NextResponse.json({ error: "Atelier introuvable." }, { status: 404 });
  }

  return NextResponse.json({ data: atelier });
}
