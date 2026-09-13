import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Declare global prisma instance for Next.js hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

  // If using SQLite via Prisma 7 adapter
  try {
    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    return new PrismaClient({ adapter });
  } catch (error) {
    console.warn("Falling back to standard PrismaClient instantiation:", error);
    return new PrismaClient();
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
