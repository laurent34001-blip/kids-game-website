import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const normalizeSqliteUrl = (url: string) => {
  if (url.startsWith("file:")) {
    return url.slice("file:".length).split("?")[0];
  }
  return url.split("?")[0];
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: normalizeSqliteUrl(process.env.DATABASE_URL ?? "file:./prisma/dev.db"),
    }),
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
