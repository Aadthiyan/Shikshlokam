import { PrismaClient } from "@prisma/client";

/**
 * Enhanced Prisma Client with Connection Pooling and Auto-Reconnect
 * Prevents multiple instances in development (hot reload)
 * Handles connection errors gracefully with automatic retry
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Connection pool configuration
const connectionPoolConfig = {
    connection_limit: 10, // Maximum number of connections
    pool_timeout: 20, // Timeout for acquiring a connection (seconds)
};

// Build DATABASE_URL with connection pooling parameters
const getDatabaseUrl = () => {
    const baseUrl = process.env.DATABASE_URL || "";

    // Add connection pooling parameters if not already present
    if (!baseUrl.includes("connection_limit")) {
        const separator = baseUrl.includes("?") ? "&" : "?";
        return `${baseUrl}${separator}connection_limit=${connectionPoolConfig.connection_limit}&pool_timeout=${connectionPoolConfig.pool_timeout}&connect_timeout=10`;
    }

    return baseUrl;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["error", "warn"]
            : ["error"],
        datasources: {
            db: {
                url: getDatabaseUrl(),
            },
        },
        // Connection timeout and retry settings
        errorFormat: "pretty",
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Connection health check and auto-reconnect
 */
let isConnecting = false;
let connectionRetries = 0;
const MAX_RETRIES = 3;

async function ensureConnection() {
    if (isConnecting) {
        // Wait for ongoing connection attempt
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
    }

    try {
        isConnecting = true;
        await prisma.$connect();
        connectionRetries = 0;
        console.log("[Prisma] Database connected successfully");
    } catch (error) {
        connectionRetries++;
        console.error(`[Prisma] Connection attempt ${connectionRetries}/${MAX_RETRIES} failed:`, error);

        if (connectionRetries < MAX_RETRIES) {
            const delay = Math.min(1000 * Math.pow(2, connectionRetries), 10000);
            console.log(`[Prisma] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return ensureConnection();
        } else {
            console.error("[Prisma] Max connection retries reached. Database unavailable.");
            throw error;
        }
    } finally {
        isConnecting = false;
    }
}

/**
 * Connect to database on startup with retry
 */
ensureConnection().catch((error) => {
    console.error("[Prisma] Failed to establish initial database connection:", error);
});

/**
 * Middleware to handle connection errors and auto-reconnect
 */
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    } catch (error: any) {
        // Check if it's a connection error
        if (
            error.code === "P1017" || // Server closed connection
            error.code === "P1001" || // Can't reach database
            error.code === "P1002" || // Database timeout
            error.message?.includes("Connection") ||
            error.message?.includes("ECONNREFUSED") ||
            error.message?.includes("ETIMEDOUT")
        ) {
            console.warn("[Prisma] Connection error detected, attempting to reconnect...");

            // Disconnect and reconnect
            try {
                await prisma.$disconnect();
                await ensureConnection();

                // Retry the query
                console.log("[Prisma] Retrying query after reconnection...");
                return await next(params);
            } catch (reconnectError) {
                console.error("[Prisma] Reconnection failed:", reconnectError);
                throw error; // Throw original error
            }
        }

        // Not a connection error, throw as-is
        throw error;
    }
});

/**
 * Periodic connection health check (every 30 seconds)
 */
if (process.env.NODE_ENV !== "test") {
    setInterval(async () => {
        try {
            await prisma.$queryRaw`SELECT 1`;
        } catch (error) {
            console.warn("[Prisma] Health check failed, reconnecting...");
            await ensureConnection();
        }
    }, 30000);
}

/**
 * Graceful shutdown handlers
 */
const gracefulShutdown = async (signal: string) => {
    console.log(`[Prisma] ${signal} received, closing database connection...`);
    try {
        await prisma.$disconnect();
        console.log("[Prisma] Database connection closed successfully");
    } catch (error) {
        console.error("[Prisma] Error during disconnect:", error);
    }
    process.exit(0);
};

process.on("beforeExit", async () => {
    await prisma.$disconnect();
});

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle Windows-specific signals
if (process.platform === "win32") {
    process.on("SIGBREAK", () => gracefulShutdown("SIGBREAK"));
}

/**
 * Export helper function for manual reconnection
 */
export const reconnectDatabase = async () => {
    console.log("[Prisma] Manual reconnection requested...");
    await prisma.$disconnect();
    await ensureConnection();
};

/**
 * Export connection status checker
 */
export const isDatabaseConnected = async (): Promise<boolean> => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch {
        return false;
    }
};
