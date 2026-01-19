/**
 * Needs API Route
 * POST /api/needs - Create new need signal
 * GET /api/needs - List all need signals
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { needsCaptureSchema } from "@/lib/schemas";
import { DatabaseService } from "@/services/database.service";

// ============================================
// POST - Create Need Signal
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = needsCaptureSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: validation.error.issues,
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Create need signal
        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.needSignal.create({
                    data: {
                        clusterId: data.clusterId,
                        grades: data.grades,
                        subjects: data.subjects,
                        issueTags: data.issueTags,
                        notes: data.notes,
                        reportedBy: data.reportedBy,
                        metrics: data.metrics || {},
                    },
                    include: {
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                                district: true,
                                block: true,
                                state: true,
                                primaryLanguage: true,
                                infrastructureLevel: true,
                            },
                        },
                    },
                });
            },
            "Failed to create need signal"
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
                message: "Need signal created successfully",
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[API] Error creating need signal:", error);
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
// GET - List Need Signals
// ============================================

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clusterId = searchParams.get("clusterId");
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Build query
        const where: any = {};
        if (clusterId) {
            where.clusterId = clusterId;
        }

        const result = await DatabaseService.executeQuery(
            async () => {
                const [needs, total] = await Promise.all([
                    prisma.needSignal.findMany({
                        where,
                        include: {
                            cluster: {
                                select: {
                                    id: true,
                                    name: true,
                                    district: true,
                                    block: true,
                                    state: true,
                                    primaryLanguage: true,
                                    infrastructureLevel: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: limit,
                        skip: offset,
                    }),
                    prisma.needSignal.count({ where }),
                ]);

                return { needs, total };
            },
            "Failed to fetch need signals"
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
            data: result.data?.needs || [],
            pagination: {
                total: result.data?.total || 0,
                limit,
                offset,
                hasMore: (result.data?.total || 0) > offset + limit,
            },
        });
    } catch (error: any) {
        console.error("[API] Error fetching need signals:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
