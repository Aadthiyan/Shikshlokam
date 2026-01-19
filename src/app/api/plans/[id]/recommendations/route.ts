/**
 * Plan Recommendations API
 * GET /api/plans/[id]/recommendations - Get recommendations for a plan
 */

import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const recommendations = await AnalyticsService.getPlanRecommendations(id);

        return NextResponse.json({
            success: true,
            data: recommendations,
        });
    } catch (error: any) {
        console.error("[API] Error fetching recommendations:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
