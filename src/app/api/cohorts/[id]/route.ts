/**
 * Cohort Detail API Route
 * GET /api/cohorts/[id] - Get cohort details
 * PUT /api/cohorts/[id] - Update cohort
 * DELETE /api/cohorts/[id] - Delete cohort
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";

// ============================================
// GET - Get Cohort Detail
// ============================================

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.cohort.findUnique({
                    where: { id },
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
                        plans: {
                            select: {
                                id: true,
                                name: true,
                                status: true,
                                sessionCount: true,
                                totalDurationMinutes: true,
                                createdAt: true,
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
            "Failed to fetch cohort"
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
                    error: "Cohort not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        });
    } catch (error: any) {
        console.error("[API] Error fetching cohort:", error);
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
// PUT - Update Cohort
// ============================================

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, tags } = body;

        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.cohort.update({
                    where: { id },
                    data: {
                        ...(name && { name }),
                        ...(description && { description }),
                        ...(tags && { tags }),
                    },
                });
            },
            "Failed to update cohort"
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
            message: "Cohort updated successfully",
        });
    } catch (error: any) {
        console.error("[API] Error updating cohort:", error);
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
// DELETE - Delete Cohort
// ============================================

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await DatabaseService.executeQuery(
            async () => {
                // Delete cohort (cascade will handle related records)
                return await prisma.cohort.delete({
                    where: { id },
                });
            },
            "Failed to delete cohort"
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
            message: "Cohort deleted successfully",
        });
    } catch (error: any) {
        console.error("[API] Error deleting cohort:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
