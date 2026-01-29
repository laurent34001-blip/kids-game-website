import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const atelier = await prisma.workshop.findUnique({
    where: { slug: params.slug },
  });

  if (!atelier) {
    return NextResponse.json({ error: "Atelier introuvable." }, { status: 404 });
  }

  return NextResponse.json({ data: atelier });
}
