/**
 * Session Feedback API
 * POST /api/plans/[id]/sessions/[sessionId]/feedback - Submit feedback for a session
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
    try {
        const { sessionId } = await params;
        const body = await request.json();

        const {
            relevanceScore,
            confidenceScore,
            comments,
            unresolvedIssues = [],
            trainerNotes,
            teacherReactions,
            submittedBy,
        } = body;

        // Validation
        if (!relevanceScore || relevanceScore < 1 || relevanceScore > 5) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Relevance score must be between 1 and 5",
                },
                { status: 400 }
            );
        }

        if (!confidenceScore || confidenceScore < 1 || confidenceScore > 5) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Confidence score must be between 1 and 5",
                },
                { status: 400 }
            );
        }

        // Check if session exists
        const session = await prisma.planSession.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Session not found",
                },
                { status: 404 }
            );
        }

        // Create feedback
        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.sessionFeedback.create({
                    data: {
                        planSessionId: sessionId,
                        relevanceScore,
                        confidenceScore,
                        comments: comments || null,
                        unresolvedIssues,
                        trainerNotes: trainerNotes || null,
                        teacherReactions: teacherReactions || null,
                        submittedBy: submittedBy || null,
                    },
                    include: {
                        planSession: {
                            include: {
                                module: true,
                                plan: {
                                    include: {
                                        cohort: true,
                                    },
                                },
                            },
                        },
                    },
                });
            },
            "Failed to submit feedback"
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

        return NextResponse.json(
            {
                success: true,
                data: result.data,
                message: "Feedback submitted successfully",
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[API] Error submitting feedback:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/plans/[id]/sessions/[sessionId]/feedback - Get all feedback for a session
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.sessionFeedback.findMany({
                    where: {
                        planSessionId: sessionId,
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
            },
            "Failed to fetch feedback"
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

        // Calculate statistics
        const feedbacks = result.data || [];
        const stats = {
            count: feedbacks.length,
            avgRelevance: feedbacks.length > 0
                ? feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / feedbacks.length
                : 0,
            avgConfidence: feedbacks.length > 0
                ? feedbacks.reduce((sum, f) => sum + f.confidenceScore, 0) / feedbacks.length
                : 0,
        };

        return NextResponse.json({
            success: true,
            data: feedbacks,
            stats,
        });
    } catch (error: any) {
        console.error("[API] Error fetching feedback:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
