import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: "Liste vide." }, { status: 400 });
  }

  const ids = body.ids.filter((id: unknown) => typeof id === "string");
  if (ids.length === 0) {
    return NextResponse.json({ error: "IDs invalides." }, { status: 400 });
  }

  await prisma.session.deleteMany({
    where: { id: { in: ids } },
  });

  return NextResponse.json({ success: true });
}
