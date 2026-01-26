import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const ateliers = await prisma.workshop.findMany({
    orderBy: { title: "asc" },
  });

  return NextResponse.json({ data: ateliers });
}
