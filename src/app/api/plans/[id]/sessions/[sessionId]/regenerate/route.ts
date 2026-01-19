/**
 * Session Regeneration API
 * POST /api/plans/[id]/sessions/[sessionId]/regenerate - Regenerate a single session
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";
import { PlanGenerationService } from "@/services/plan.service";
import { CohortService } from "@/services/cohort.service";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
    try {
        const { id: planId, sessionId } = await params;

        // Get plan with session and cohort
        const plan = await prisma.plan.findUnique({
            where: { id: planId },
            include: {
                sessions: true,
                cohort: true,
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

        // Check if plan is published (can't edit published plans)
        if (plan.status === "PUBLISHED") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Cannot regenerate sessions in a published plan. Create a new version instead.",
                },
                { status: 400 }
            );
        }

        // Find the session
        const session = plan.sessions.find((s) => s.id === sessionId);
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Session not found",
                },
                { status: 404 }
            );
        }

        // Get cohort profile
        const cohortProfile = await CohortService.getCohortProfile(plan.cohortId);

        // Get candidate modules (excluding current module to get something different)
        const allModules = await prisma.module.findMany();
        const candidates = allModules
            .filter((m) => m.id !== session.moduleId)
            .map((m) => ({
                ...m,
                relevanceScore: 0, // Will be scored by selection service
            }));

        // Select top 3 candidates
        const topCandidates = candidates.slice(0, 3);

        if (topCandidates.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No alternative modules available",
                },
                { status: 400 }
            );
        }

        // Pick the best candidate (first one)
        const newModule = topCandidates[0];

        // Update session with new module
        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.planSession.update({
                    where: { id: sessionId },
                    data: {
                        moduleId: newModule.id,
                        title: newModule.title,
                        objectives: newModule.objectives,
                        durationMinutes: newModule.durationMinutes,
                        trainerNotes: `Regenerated session. ${cohortProfile.infrastructureLevel === "LOW"
                            ? "Focus on offline activities. "
                            : ""
                            }Adapt examples for ${cohortProfile.language} context.`,
                    },
                    include: {
                        module: true,
                    },
                });
            },
            "Failed to regenerate session"
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

        // Update plan's total duration
        const updatedPlan = await prisma.plan.findUnique({
            where: { id: planId },
            include: {
                sessions: true,
            },
        });

        if (updatedPlan) {
            const newTotalDuration = updatedPlan.sessions.reduce(
                (sum, s) => sum + s.durationMinutes,
                0
            );

            await prisma.plan.update({
                where: { id: planId },
                data: {
                    totalDurationMinutes: newTotalDuration,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: "Session regenerated successfully",
        });
    } catch (error: any) {
        console.error("[API] Error regenerating session:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
