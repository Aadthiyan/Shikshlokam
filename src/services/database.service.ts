/**
 * Database Service - Wrapper for Prisma with error handling
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class DatabaseService {
    /**
     * Health check for database connection
     */
    static async healthCheck(): Promise<{
        available: boolean;
        latency?: number;
        error?: string;
    }> {
        try {
            const startTime = Date.now();
            await prisma.$queryRaw`SELECT 1`;
            const latency = Date.now() - startTime;

            return {
                available: true,
                latency,
            };
        } catch (error: any) {
            return {
                available: false,
                error: error.message || "Database connection failed",
            };
        }
    }

    /**
     * Execute query with error handling
     */
    static async executeQuery<T>(
        queryFn: () => Promise<T>,
        errorMessage = "Database query failed"
    ): Promise<{ success: boolean; data?: T; error?: string }> {
        try {
            const data = await queryFn();
            return { success: true, data };
        } catch (error: any) {
            console.error(`[Database] ${errorMessage}:`, error);

            // Handle specific Prisma errors
            if (error.code) {
                // Unique constraint violation
                if (error.code === "P2002") {
                    return {
                        success: false,
                        error: `A record with this ${error.meta?.target} already exists`,
                    };
                }
                // Foreign key constraint violation
                if (error.code === "P2003") {
                    return {
                        success: false,
                        error: "Referenced record does not exist",
                    };
                }
                // Record not found
                if (error.code === "P2025") {
                    return {
                        success: false,
                        error: "Record not found",
                    };
                }
            }

            return {
                success: false,
                error: error.message || errorMessage,
            };
        }
    }

    /**
     * Transaction wrapper with error handling
     */
    static async executeTransaction<T>(
        transactionFn: (tx: Prisma.TransactionClient) => Promise<T>,
        errorMessage = "Transaction failed"
    ): Promise<{ success: boolean; data?: T; error?: string }> {
        try {
            const data = await prisma.$transaction(transactionFn);
            return { success: true, data };
        } catch (error: any) {
            console.error(`[Database] ${errorMessage}:`, error);
            return {
                success: false,
                error: error.message || errorMessage,
            };
        }
    }

    /**
     * Get database statistics
     */
    static async getStats(): Promise<{
        needsReported: number;
        cohortsCreated: number;
        plansGenerated: number;
        teachersImpacted: number;
        clustersActive: number;
    }> {
        const [needSignals, cohorts, plans, clusters] = await Promise.all([
            prisma.needSignal.count(),
            prisma.cohort.count(),
            prisma.plan.count(),
            prisma.cluster.count(),
        ]);

        // Calculate teachers impacted (sum of teacherCountEstimate from all cohorts)
        const cohortsWithTeachers = await prisma.cohort.findMany({
            select: { teacherCountEstimate: true }
        });
        const teachersImpacted = cohortsWithTeachers.reduce(
            (sum, cohort) => sum + (cohort.teacherCountEstimate || 0),
            0
        );

        return {
            needsReported: needSignals,
            cohortsCreated: cohorts,
            plansGenerated: plans,
            teachersImpacted,
            clustersActive: clusters,
        };
    }
}
