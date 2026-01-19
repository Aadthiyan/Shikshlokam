/**
 * Plan Detail API Route
 * GET /api/plans/[id] - Get plan details
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.plan.findUnique({
                    where: { id },
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
                        sessions: {
                            include: {
                                module: true,
                            },
                            orderBy: {
                                orderIndex: "asc",
                            },
                        },
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
            },
            "Failed to fetch plan"
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

        if (!result.data) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Plan not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        });
    } catch (error: any) {
        console.error("[API] Error fetching plan:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
