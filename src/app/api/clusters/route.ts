/**
 * Clusters API Route
 * GET /api/clusters - List all clusters
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const district = searchParams.get("district");
        const block = searchParams.get("block");
        const state = searchParams.get("state");

        // Build query
        const where: any = {};
        if (district) where.district = district;
        if (block) where.block = block;
        if (state) where.state = state;

        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.cluster.findMany({
                    where,
                    orderBy: [{ state: "asc" }, { district: "asc" }, { block: "asc" }, { name: "asc" }],
                    select: {
                        id: true,
                        udiseCode: true,
                        name: true,
                        district: true,
                        block: true,
                        state: true,
                        languages: true,
                        primaryLanguage: true,
                        infrastructureLevel: true,
                        type: true,
                        schoolsCount: true,
                        teacherCountEstimate: true,
                    },
                });
            },
            "Failed to fetch clusters"
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
            data: result.data || [],
        });
    } catch (error: any) {
        console.error("[API] Error fetching clusters:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
