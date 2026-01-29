import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  ensureAdminUser,
  getAdminUserByEmail,
  setAdminSessionCookie,
  verifyPassword,
} from "@/lib/auth";

const DEFAULT_EMAIL = "admin@example.com";
const DEFAULT_PASSWORD = "admin123";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();
    const password = body.password;

    let adminUser = null;

    if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      adminUser = await ensureAdminUser(email, DEFAULT_PASSWORD);
    } else {
      adminUser = await getAdminUserByEmail(email);
    }

    if (!adminUser || !verifyPassword(password, adminUser.passwordHash)) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
    }

    const { token, expiresAt } = await createAdminSession(adminUser.id);
    await setAdminSessionCookie(token, expiresAt);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur login admin", error);
    return NextResponse.json(
      {
        error: "Impossible de se connecter.",
        detail: process.env.NODE_ENV === "production" ? undefined : message,
      },
      { status: 500 },
    );
  }
}
