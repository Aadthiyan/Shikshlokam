/**
 * Learning Network API Route
 * GET /api/learning-network - Get shared training plans
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter") || "all";

        // Fetch published plans with cohort and creator info
        const plans = await prisma.plan.findMany({
            where: {
                status: "PUBLISHED",
            },
            include: {
                cohort: {
                    include: {
                        needSignals: {
                            include: {
                                needSignal: {
                                    include: {
                                        cluster: true,
                                    },
                                },
                            },
                        },
                    },
                },
                createdBy: true,
                sessions: {
                    include: {
                        module: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Transform plans into shared plan format
        const sharedPlans = plans.map((plan) => {
            // Calculate success rate (mock for now - in real app, track this)
            const successRate = Math.floor(Math.random() * 15) + 85; // 85-100%

            // Get cluster info from first need signal
            const firstCluster = plan.cohort?.needSignals?.[0]?.needSignal?.cluster;

            return {
                id: plan.id,
                name: plan.name,
                dietName: `${firstCluster?.district || "Unknown"} DIET`,
                district: firstCluster?.district || "Unknown",
                state: firstCluster?.state || "Jharkhand",
                successRate,
                teachersImpacted: plan.cohort?.teacherCountEstimate || 0,
                primaryIssues: plan.cohort?.primaryIssues || [],
                gradeBand: plan.cohort?.gradeBand || "ALL",
                language: plan.cohort?.language || "Hindi",
                adaptedBy: Math.floor(Math.random() * 20), // Mock adaptation count
                createdAt: plan.createdAt.toISOString(),
            };
        });

        // Apply filters
        let filteredPlans = sharedPlans;

        if (filter === "high-success") {
            filteredPlans = sharedPlans.filter((p) => p.successRate >= 90);
        } else if (filter === "trending") {
            filteredPlans = sharedPlans.filter((p) => p.adaptedBy >= 10);
        } else if (filter === "recent") {
            filteredPlans = sharedPlans.slice(0, 10);
        }

        return NextResponse.json({
            success: true,
            data: filteredPlans,
        });
    } catch (error: any) {
        console.error("[API] Error fetching learning network data:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch learning network data",
            },
            { status: 500 }
        );
    }
}
