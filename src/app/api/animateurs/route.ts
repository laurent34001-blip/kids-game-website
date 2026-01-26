import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const animateurs = await prisma.instructor.findMany({
    include: { skills: true, assignments: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: animateurs });
}
