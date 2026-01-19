/**
 * Plan Generation API Route
 * POST /api/cohorts/[id]/generate-plan - Generate AI training plan
 */

import { NextRequest, NextResponse } from "next/server";
import { PlanGenerationService } from "@/services/plan.service";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { numSessions = 4, useAI = true } = body;

        console.log(`[API] Generating plan for cohort ${id}...`);

        // Ensure demo user exists
        const user = await prisma.user.upsert({
            where: { email: "demo@diet-training.gov.in" },
            update: {},
            create: {
                clerkId: "demo_clerk_id",
                email: "demo@diet-training.gov.in",
                name: "Demo User",
                role: "PLANNER",
            },
        });

        // Generate plan
        const plan = await PlanGenerationService.generatePlan(id, {
            numSessions,
            useAI,
        });

        console.log(`[API] Plan generated successfully`);

        // Save plan to database
        const savedPlan = await PlanGenerationService.savePlan(id, plan, user.id);

        console.log(`[API] Plan saved with ID: ${savedPlan.id}`);

        return NextResponse.json(
            {
                success: true,
                data: savedPlan,
                message: "Training plan generated successfully",
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[API] Error generating plan:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to generate plan",
            },
            { status: 500 }
        );
    }
}
