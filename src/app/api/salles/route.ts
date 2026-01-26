import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const salles = await prisma.room.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: salles });
}
