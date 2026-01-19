/**
 * Analytics API
 * GET /api/analytics - Get analytics data
 */

import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "dashboard";

        let data;

        switch (type) {
            case "dashboard":
                data = await AnalyticsService.getDashboardStats();
                break;

            case "plans":
                data = await AnalyticsService.getPlanAnalytics();
                break;

            case "cohorts":
                data = await AnalyticsService.getCohortAnalytics();
                break;

            case "modules":
                data = await AnalyticsService.getModuleAnalytics();
                break;

            case "issues":
                data = await AnalyticsService.getUnresolvedIssues();
                break;

            case "trends":
                const days = parseInt(searchParams.get("days") || "30");
                data = await AnalyticsService.getTrendData(days);
                break;

            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid analytics type",
                    },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
        console.error("[API] Error fetching analytics:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
