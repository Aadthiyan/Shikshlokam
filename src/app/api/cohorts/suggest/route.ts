/**
 * Cohort Suggestions API Route
 * POST /api/cohorts/suggest - Get cohort suggestions from needs
 */

import { NextRequest, NextResponse } from "next/server";
import { CohortService } from "@/services/cohort.service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { needSignalIds } = body;

        // Get suggestions
        const suggestions = await CohortService.suggestCohorts(needSignalIds);

        return NextResponse.json({
            success: true,
            data: suggestions,
            message: `Found ${suggestions.length} cohort suggestion(s)`,
        });
    } catch (error: any) {
        console.error("[API] Error generating cohort suggestions:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
