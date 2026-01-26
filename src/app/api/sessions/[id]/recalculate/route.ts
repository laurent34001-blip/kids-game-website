import { NextResponse } from "next/server";
import { recalculateSession } from "@/lib/session";

export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const session = await recalculateSession(id);

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  return NextResponse.json({ data: session });
}
