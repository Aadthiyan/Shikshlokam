/**
 * Learning API
 * GET /api/learning - Get learning insights and recommendations
 */

import { NextRequest, NextResponse } from "next/server";
import { LearningService } from "@/services/learning.service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "modules";
        const cohortId = searchParams.get("cohortId");
        const months = parseInt(searchParams.get("months") || "3");
        const limit = parseInt(searchParams.get("limit") || "10");

        let data;

        switch (type) {
            case "modules":
                // Module effectiveness rankings
                data = await LearningService.calculateModuleEffectiveness();
                break;

            case "cohort-patterns":
                // Cohort patterns and successful plans
                data = await LearningService.identifyCohortPatterns();
                break;

            case "unresolved-patterns":
                // Unresolved issue patterns
                data = await LearningService.identifyUnresolvedPatterns();
                break;

            case "improvement":
                // Improvement metrics over time
                data = await LearningService.calculateImprovementMetrics(months);
                break;

            case "similar-cohorts":
                // Find similar cohorts
                if (!cohortId) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: "cohortId is required for similar-cohorts type",
                        },
                        { status: 400 }
                    );
                }
                data = await LearningService.findSimilarCohorts(cohortId, limit);
                break;

            case "recommended-modules":
                // Get recommended modules for a cohort
                if (!cohortId) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: "cohortId is required for recommended-modules type",
                        },
                        { status: 400 }
                    );
                }
                data = await LearningService.getRecommendedModules(cohortId, limit);
                break;

            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid learning type",
                    },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
        console.error("[API] Error fetching learning data:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
