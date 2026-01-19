/**
 * Cohorts API Route
 * POST /api/cohorts - Create cohort
 * GET /api/cohorts - List cohorts
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";
import { CohortService } from "@/services/cohort.service";

// ============================================
// POST - Create Cohort
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { needSignalIds, userId = "demo_user" } = body;

        if (!needSignalIds || needSignalIds.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Need signal IDs are required",
                },
                { status: 400 }
            );
        }

        // Get cohort suggestions
        const suggestions = await CohortService.suggestCohorts(needSignalIds);

        if (suggestions.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Could not create cohort from provided needs",
                },
                { status: 400 }
            );
        }

        // Create cohort from first suggestion
        const cohort = await CohortService.createCohort(suggestions[0], userId);

        return NextResponse.json(
            {
                success: true,
                data: cohort,
                message: "Cohort created successfully",
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[API] Error creating cohort:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}

// ============================================
// GET - List Cohorts
// ============================================

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const result = await DatabaseService.executeQuery(
            async () => {
                const [cohorts, total] = await Promise.all([
                    prisma.cohort.findMany({
                        include: {
                            needSignals: {
                                include: {
                                    needSignal: {
                                        include: {
                                            cluster: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    district: true,
                                                    block: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            _count: {
                                select: {
                                    plans: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: limit,
                        skip: offset,
                    }),
                    prisma.cohort.count(),
                ]);

                return { cohorts, total };
            },
            "Failed to fetch cohorts"
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data?.cohorts || [],
            pagination: {
                total: result.data?.total || 0,
                limit,
                offset,
                hasMore: (result.data?.total || 0) > offset + limit,
            },
        });
    } catch (error: any) {
        console.error("[API] Error fetching cohorts:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
