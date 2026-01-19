/**
 * Plan Publishing API
 * PUT /api/plans/[id]/publish - Publish a draft plan
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";
import { PlanValidationService } from "@/services/validation.service";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Get plan with full details
        const plan = await prisma.plan.findUnique({
            where: { id },
            include: {
                sessions: true,
                cohort: {
                    select: {
                        primaryIssues: true,
                        infrastructureLevel: true,
                    },
                },
            },
        });

        if (!plan) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Plan not found",
                },
                { status: 404 }
            );
        }

        // Check if already published
        if (plan.status === "PUBLISHED") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Plan is already published",
                },
                { status: 400 }
            );
        }

        // Validate plan before publishing
        const validation = PlanValidationService.validatePlan({
            sessionCount: plan.sessionCount,
            totalDurationMinutes: plan.totalDurationMinutes,
            sessions: plan.sessions,
            cohort: plan.cohort,
        });

        if (!validation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Plan has validation errors",
                    validation,
                },
                { status: 400 }
            );
        }

        // Publish plan
        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.plan.update({
                    where: { id },
                    data: {
                        status: "PUBLISHED",
                        publishedAt: new Date(),
                    },
                    include: {
                        sessions: {
                            include: {
                                module: true,
                            },
                            orderBy: {
                                sessionNumber: "asc",
                            },
                        },
                        cohort: true,
                    },
                });
            },
            "Failed to publish plan"
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
            data: result.data,
            message: "Plan published successfully",
            validation,
        });
    } catch (error: any) {
        console.error("[API] Error publishing plan:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
