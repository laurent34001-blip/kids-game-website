import { cookies } from "next/headers";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "djogo_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
};

export const verifyPassword = (password: string, storedHash: string) => {
  const [algo, salt, hash] = storedHash.split("$");
  if (algo !== "scrypt" || !salt || !hash) {
    return false;
  }
  const candidate = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
};

type AdminUserRow = { id: string; email: string; passwordHash: string };
type AdminSessionRow = {
  token: string;
  expiresAt: Date | string;
  userId: string;
  email: string;
};

const prismaAny = prisma as unknown as {
  adminUser?: {
    findUnique: (args: { where: { email: string } }) => Promise<AdminUserRow | null>;
    upsert: (args: {
      where: { email: string };
      update: { passwordHash: string };
      create: { email: string; passwordHash: string };
    }) => Promise<AdminUserRow>;
  };
  adminSession?: {
    create: (args: {
      data: { token: string; userId: string; expiresAt: Date };
    }) => Promise<void>;
    findUnique: (args: {
      where: { token: string };
      include: { user: true };
    }) => Promise<{ token: string; expiresAt: Date; user: AdminUserRow } | null>;
    delete: (args: { where: { token: string } }) => Promise<void>;
  };
  $queryRaw: <T = unknown>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>;
  $executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
};

export const getAdminUserByEmail = async (email: string) => {
  if (prismaAny.adminUser?.findUnique) {
    return prismaAny.adminUser.findUnique({ where: { email } });
  }

  const rows = await prisma.$queryRaw<AdminUserRow[]>`
    SELECT id, email, passwordHash
    FROM AdminUser
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] ?? null;
};

export const ensureAdminUser = async (email: string, password: string) => {
  const passwordHash = hashPassword(password);

  if (prismaAny.adminUser?.upsert) {
    return prismaAny.adminUser.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });
  }

  const existing = await getAdminUserByEmail(email);
  if (existing) {
    await prisma.$executeRaw`
      UPDATE AdminUser
      SET passwordHash = ${passwordHash}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${existing.id}
    `;
    return { ...existing, passwordHash };
  }

  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO AdminUser (id, email, passwordHash, createdAt, updatedAt)
    VALUES (${id}, ${email}, ${passwordHash}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  return { id, email, passwordHash };
};

export const createAdminSession = async (userId: string) => {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  if (prismaAny.adminSession?.create) {
    await prismaAny.adminSession.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  } else {
    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO AdminSession (id, token, userId, expiresAt, createdAt)
      VALUES (${id}, ${token}, ${userId}, ${expiresAt.toISOString()}, CURRENT_TIMESTAMP)
    `;
  }

  return { token, expiresAt };
};

export const getAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = prismaAny.adminSession?.findUnique
    ? await prismaAny.adminSession.findUnique({
        where: { token },
        include: { user: true },
      })
    : await (async () => {
        const rows = await prisma.$queryRaw<AdminSessionRow[]>`
          SELECT s.token as token, s.expiresAt as expiresAt, u.id as userId, u.email as email
          FROM AdminSession s
          JOIN AdminUser u ON u.id = s.userId
          WHERE s.token = ${token}
          LIMIT 1
        `;
        const row = rows[0];
        if (!row) {
          return null;
        }
        return {
          token: row.token,
          expiresAt: row.expiresAt,
          user: { id: row.userId, email: row.email, passwordHash: "" },
        } as { token: string; expiresAt: Date | string; user: AdminUserRow };
      })();

  if (!session) {
    return null;
  }

  const expiresAt =
    session.expiresAt instanceof Date
      ? session.expiresAt
      : new Date(session.expiresAt);

  if (expiresAt.getTime() < Date.now()) {
    if (prismaAny.adminSession?.delete) {
      await prismaAny.adminSession.delete({
        where: { token },
      });
    } else {
      await prisma.$executeRaw`
        DELETE FROM AdminSession WHERE token = ${token}
      `;
    }
    return null;
  }

  return { ...session, expiresAt } as typeof session & { expiresAt: Date };
};

export const setAdminSessionCookie = async (token: string, expiresAt: Date) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
  });
};
