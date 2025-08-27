// src/lib/db/prisma.ts
import { PrismaClient } from "../../generated/prisma";

// Lazy initialize Prisma and provide safe fallbacks when the DB is unreachable.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let realPrisma: PrismaClient | null = globalForPrisma.prisma ?? null;

async function initPrisma(): Promise<PrismaClient | null> {
  if (realPrisma) return realPrisma;
  try {
    realPrisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

    if (process.env.NODE_ENV !== "production")
      globalForPrisma.prisma = realPrisma;

    // Try a lightweight health check
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (realPrisma as any).$queryRaw`SELECT 1`;
    } catch (e) {
      // If the initial health check fails, log and keep realPrisma assigned
      // so subsequent calls will attempt real queries and can be handled
      console.error("Prisma health check failed:", e);
    }

    return realPrisma;
  } catch (e) {
    console.error("Failed to initialize PrismaClient:", e);
    realPrisma = null;
    return null;
  }
}

function createSafePrismaProxy() {
  // Top-level proxy that returns model proxies (e.g., prisma.product.findMany)
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop) {
      // Allow inspection like util.inspect to not blow up
      if (prop === Symbol.toStringTag) return "PrismaClientProxy";

      // Handle special methods like $connect/$disconnect
      if (typeof prop === "string" && prop.startsWith("$")) {
        return async (...args: unknown[]) => {
          const p = await initPrisma();
          if (!p) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (p as any)[prop](...args);
        };
      }

      // Return a proxy for the model (e.g., product, category)
      return new Proxy(
        {},
        {
          get(_t, method) {
            return async (...args: unknown[]) => {
              const p = await initPrisma();
              if (!p) {
                // Safe fallbacks for common read operations
                if (method === "findMany") return [];
                if (method === "findFirst" || method === "findUnique")
                  return null;
                if (method === "count") return 0;
                // For writes, surface a descriptive error
                throw new Error(
                  "Database unavailable: cannot perform that operation right now."
                );
              }

              try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const model = (p as any)[prop as string];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fn = model[method as string] as any;
                return await fn.apply(model, args);
              } catch (err) {
                console.error("Prisma query error:", err);
                if (method === "findMany") return [];
                if (method === "findFirst" || method === "findUnique")
                  return null;
                if (method === "count") return 0;
                throw err;
              }
            };
          },
        }
      );
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy({}, handler) as any;
}

export const prisma = createSafePrismaProxy();
