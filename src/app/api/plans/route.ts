/**
 * Plans API Route
 * GET /api/plans - List all plans
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cohortId = searchParams.get("cohortId");
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const where: any = {};
        if (cohortId) {
            where.cohortId = cohortId;
        }

        const result = await DatabaseService.executeQuery(
            async () => {
                const [plans, total] = await Promise.all([
                    prisma.plan.findMany({
                        where,
                        include: {
                            cohort: {
                                select: {
                                    id: true,
                                    name: true,
                                    primaryIssues: true,
                                    language: true,
                                    teacherCountEstimate: true,
                                },
                            },
                            sessions: {
                                include: {
                                    module: true,
                                },
                                orderBy: {
                                    sessionNumber: "asc",
                                },
                            },
                            createdBy: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: limit,
                        skip: offset,
                    }),
                    prisma.plan.count({ where }),
                ]);

                return { plans, total };
            },
            "Failed to fetch plans"
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
            data: result.data?.plans || [],
            pagination: {
                total: result.data?.total || 0,
                limit,
                offset,
                hasMore: (result.data?.total || 0) > offset + limit,
            },
        });
    } catch (error: any) {
        console.error("[API] Error fetching plans:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
