import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit due to hot-reloading in Next.js.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // This will print MySQL queries to the console for easy debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
