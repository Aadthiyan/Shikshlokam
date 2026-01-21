import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        console.log("[API] Fetching all sessions...");

        const { userId: clerkId } = await auth();

        if (!clerkId) {
            console.log("[API] Unauthorized - no clerkId");
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("[API] User authenticated:", clerkId);

        // Fetch all sessions with their plans and feedback stats
        const sessions = await prisma.planSession.findMany({
            where: {
                plan: {
                    status: "PUBLISHED",
                },
            },
            include: {
                plan: {
                    select: {
                        id: true,
                        name: true,
                        cohort: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                feedbacks: {
                    select: {
                        relevanceScore: true,
                        confidenceScore: true,
                    },
                },
            },
            orderBy: {
                sessionNumber: "asc",
            },
        });

        console.log("[API] Found sessions:", sessions.length);

        // Transform data to include feedback stats
        const sessionsWithStats = sessions.map((session) => {
            const feedbackCount = session.feedbacks.length;
            const avgRelevance =
                feedbackCount > 0
                    ? session.feedbacks.reduce((sum: number, f: any) => sum + f.relevanceScore, 0) / feedbackCount
                    : null;
            const avgConfidence =
                feedbackCount > 0
                    ? session.feedbacks.reduce((sum: number, f: any) => sum + f.confidenceScore, 0) / feedbackCount
                    : null;

            return {
                id: session.id,
                sessionNumber: session.sessionNumber,
                title: session.title,
                durationMinutes: session.durationMinutes,
                planId: session.planId,
                plan: {
                    id: session.plan.id,
                    name: session.plan.name,
                    cohort: {
                        name: session.plan.cohort.name,
                    },
                },
                feedbackCount,
                avgRelevance,
                avgConfidence,
            };
        });

        console.log("[API] Returning sessions with stats");

        return NextResponse.json({
            success: true,
            data: sessionsWithStats,
        });
    } catch (error: any) {
        console.error("[API] Error fetching sessions:", error);
        console.error("[API] Error stack:", error.stack);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch sessions",
                details: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}
