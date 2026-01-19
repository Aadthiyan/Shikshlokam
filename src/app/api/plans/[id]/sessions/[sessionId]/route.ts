/**
 * Session Update API
 * PATCH /api/plans/[id]/sessions/[sessionId] - Update session trainer notes
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string; sessionId: string } }
) {
    try {
        const { id: planId, sessionId } = params;
        const body = await request.json();
        const { trainerNotes } = body;

        // Get plan to check status
        const plan = await prisma.plan.findUnique({
            where: { id: planId },
            select: { status: true },
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

        // Check if plan is published
        if (plan.status === "PUBLISHED") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Cannot edit a published plan",
                },
                { status: 400 }
            );
        }

        // Update session
        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.planSession.update({
                    where: { id: sessionId },
                    data: {
                        trainerNotes,
                    },
                });
            },
            "Failed to update session"
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
            message: "Session updated successfully",
        });
    } catch (error: any) {
        console.error("[API] Error updating session:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
