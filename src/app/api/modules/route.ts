/**
 * Modules API Route
 * GET /api/modules - List all training modules
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DatabaseService } from "@/services/database.service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const theme = searchParams.get("theme");
        const gradeBand = searchParams.get("gradeBand");
        const language = searchParams.get("language");

        const where: any = {};
        if (theme) {
            where.theme = theme;
        }
        if (gradeBand) {
            where.gradeBand = gradeBand;
        }
        if (language && language !== "Any") {
            where.OR = [{ language }, { language: "Any" }];
        }

        const result = await DatabaseService.executeQuery(
            async () => {
                return await prisma.module.findMany({
                    where,
                    orderBy: {
                        theme: "asc",
                    },
                });
            },
            "Failed to fetch modules"
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
        console.error("[API] Error fetching modules:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
