/**
 * Analytics Service
 * Aggregates feedback data and generates insights
 */

import { prisma } from "@/lib/prisma";

// ============================================
// TYPES
// ============================================

interface PlanAnalytics {
    planId: string;
    planName: string;
    cohortName: string;
    sessionCount: number;
    feedbackCount: number;
    avgRelevance: number;
    avgConfidence: number;
    status: "excellent" | "good" | "needs_improvement";
    unresolvedIssues: string[];
    createdAt: string;
}

interface CohortAnalytics {
    cohortId: string;
    cohortName: string;
    primaryIssues: string[];
    planCount: number;
    avgRelevance: number;
    avgConfidence: number;
    teacherCount: number;
}

interface ModuleAnalytics {
    moduleId: string;
    moduleTitle: string;
    theme: string;
    usageCount: number;
    avgRelevance: number;
    avgConfidence: number;
    rating: "high" | "medium" | "low";
}

interface IssueAnalytics {
    issue: string;
    occurrenceCount: number;
    percentageOfFeedback: number;
}

interface TrendData {
    date: string;
    avgRelevance: number;
    avgConfidence: number;
    feedbackCount: number;
}

interface DashboardStats {
    totalPlans: number;
    totalFeedback: number;
    avgRelevance: number;
    avgConfidence: number;
    excellentPlans: number;
    needsImprovementPlans: number;
}

// ============================================
// ANALYTICS SERVICE
// ============================================

export class AnalyticsService {
    /**
     * Get dashboard statistics
     */
    static async getDashboardStats(): Promise<DashboardStats> {
        // Get all plans with feedback
        const plans = await prisma.plan.findMany({
            include: {
                sessions: {
                    include: {
                        feedbacks: true,
                    },
                },
            },
        });

        let totalFeedback = 0;
        let totalRelevance = 0;
        let totalConfidence = 0;
        let excellentPlans = 0;
        let needsImprovementPlans = 0;

        plans.forEach((plan) => {
            const feedbacks = plan.sessions.flatMap((s) => s.feedbacks);
            if (feedbacks.length > 0) {
                const avgRelevance =
                    feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / feedbacks.length;
                const avgConfidence =
                    feedbacks.reduce((sum, f) => sum + f.confidenceScore, 0) / feedbacks.length;

                totalFeedback += feedbacks.length;
                totalRelevance += avgRelevance * feedbacks.length;
                totalConfidence += avgConfidence * feedbacks.length;

                if (avgRelevance >= 4.0) excellentPlans++;
                if (avgRelevance < 3.0) needsImprovementPlans++;
            }
        });

        return {
            totalPlans: plans.length,
            totalFeedback,
            avgRelevance: totalFeedback > 0 ? totalRelevance / totalFeedback : 0,
            avgConfidence: totalFeedback > 0 ? totalConfidence / totalFeedback : 0,
            excellentPlans,
            needsImprovementPlans,
        };
    }

    /**
     * Get plan analytics
     */
    static async getPlanAnalytics(): Promise<PlanAnalytics[]> {
        const plans = await prisma.plan.findMany({
            include: {
                cohort: true,
                sessions: {
                    include: {
                        feedbacks: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return plans.map((plan) => {
            const feedbacks = plan.sessions.flatMap((s) => s.feedbacks);
            const avgRelevance =
                feedbacks.length > 0
                    ? feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / feedbacks.length
                    : 0;
            const avgConfidence =
                feedbacks.length > 0
                    ? feedbacks.reduce((sum, f) => sum + f.confidenceScore, 0) / feedbacks.length
                    : 0;

            // Collect unresolved issues
            const unresolvedIssues = Array.from(
                new Set(feedbacks.flatMap((f) => f.unresolvedIssues))
            );

            // Determine status
            let status: "excellent" | "good" | "needs_improvement";
            if (avgRelevance >= 4.0) status = "excellent";
            else if (avgRelevance >= 3.0) status = "good";
            else status = "needs_improvement";

            return {
                planId: plan.id,
                planName: plan.name,
                cohortName: plan.cohort.name,
                sessionCount: plan.sessionCount,
                feedbackCount: feedbacks.length,
                avgRelevance,
                avgConfidence,
                status,
                unresolvedIssues,
                createdAt: plan.createdAt.toISOString(),
            };
        });
    }

    /**
     * Get cohort analytics
     */
    static async getCohortAnalytics(): Promise<CohortAnalytics[]> {
        const cohorts = await prisma.cohort.findMany({
            include: {
                plans: {
                    include: {
                        sessions: {
                            include: {
                                feedbacks: true,
                            },
                        },
                    },
                },
            },
        });

        return cohorts.map((cohort) => {
            const allFeedbacks = cohort.plans.flatMap((p) =>
                p.sessions.flatMap((s) => s.feedbacks)
            );

            const avgRelevance =
                allFeedbacks.length > 0
                    ? allFeedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / allFeedbacks.length
                    : 0;
            const avgConfidence =
                allFeedbacks.length > 0
                    ? allFeedbacks.reduce((sum, f) => sum + f.confidenceScore, 0) / allFeedbacks.length
                    : 0;

            return {
                cohortId: cohort.id,
                cohortName: cohort.name,
                primaryIssues: cohort.primaryIssues,
                planCount: cohort.plans.length,
                avgRelevance,
                avgConfidence,
                teacherCount: cohort.teacherCountEstimate,
            };
        });
    }

    /**
     * Get module analytics
     */
    static async getModuleAnalytics(): Promise<ModuleAnalytics[]> {
        const modules = await prisma.module.findMany({
            include: {
                planSessions: {
                    include: {
                        feedbacks: true,
                    },
                },
            },
        });

        return modules
            .map((module) => {
                const feedbacks = module.planSessions.flatMap((s) => s.feedbacks);
                const avgRelevance =
                    feedbacks.length > 0
                        ? feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / feedbacks.length
                        : 0;
                const avgConfidence =
                    feedbacks.length > 0
                        ? feedbacks.reduce((sum, f) => sum + f.confidenceScore, 0) / feedbacks.length
                        : 0;

                let rating: "high" | "medium" | "low";
                if (avgRelevance >= 4.0) rating = "high";
                else if (avgRelevance >= 3.0) rating = "medium";
                else rating = "low";

                return {
                    moduleId: module.id,
                    moduleTitle: module.title,
                    theme: module.theme,
                    usageCount: module.planSessions.length,
                    avgRelevance,
                    avgConfidence,
                    rating,
                };
            })
            .sort((a, b) => b.avgRelevance - a.avgRelevance);
    }

    /**
     * Get unresolved issues analytics
     */
    static async getUnresolvedIssues(): Promise<IssueAnalytics[]> {
        const feedbacks = await prisma.sessionFeedback.findMany({
            select: {
                unresolvedIssues: true,
            },
        });

        const totalFeedback = feedbacks.length;
        const issueCount: Record<string, number> = {};

        feedbacks.forEach((feedback) => {
            feedback.unresolvedIssues.forEach((issue) => {
                issueCount[issue] = (issueCount[issue] || 0) + 1;
            });
        });

        return Object.entries(issueCount)
            .map(([issue, count]) => ({
                issue,
                occurrenceCount: count,
                percentageOfFeedback: totalFeedback > 0 ? (count / totalFeedback) * 100 : 0,
            }))
            .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    }

    /**
     * Get trend data over time
     */
    static async getTrendData(days: number = 30): Promise<TrendData[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const feedbacks = await prisma.sessionFeedback.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Group by date
        const dataByDate: Record<string, { relevance: number[]; confidence: number[] }> = {};

        feedbacks.forEach((feedback) => {
            const date = feedback.createdAt.toISOString().split("T")[0];
            if (!dataByDate[date]) {
                dataByDate[date] = { relevance: [], confidence: [] };
            }
            dataByDate[date].relevance.push(feedback.relevanceScore);
            dataByDate[date].confidence.push(feedback.confidenceScore);
        });

        return Object.entries(dataByDate).map(([date, data]) => ({
            date,
            avgRelevance: data.relevance.reduce((a, b) => a + b, 0) / data.relevance.length,
            avgConfidence: data.confidence.reduce((a, b) => a + b, 0) / data.confidence.length,
            feedbackCount: data.relevance.length,
        }));
    }

    /**
     * Get recommendations for a plan
     */
    static async getPlanRecommendations(planId: string): Promise<{
        lowPerformingSessions: Array<{ sessionId: string; title: string; avgRelevance: number }>;
        suggestedModules: Array<{ moduleId: string; title: string; theme: string }>;
        insights: string[];
    }> {
        const plan = await prisma.plan.findUnique({
            where: { id: planId },
            include: {
                sessions: {
                    include: {
                        module: true,
                        feedbacks: true,
                    },
                },
                cohort: true,
            },
        });

        if (!plan) {
            return { lowPerformingSessions: [], suggestedModules: [], insights: [] };
        }

        // Find low-performing sessions
        const lowPerformingSessions = plan.sessions
            .map((session) => {
                const avgRelevance =
                    session.feedbacks.length > 0
                        ? session.feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) /
                        session.feedbacks.length
                        : 0;
                return {
                    sessionId: session.id,
                    title: session.title,
                    avgRelevance,
                };
            })
            .filter((s) => s.avgRelevance < 3.5)
            .sort((a, b) => a.avgRelevance - b.avgRelevance);

        // Get high-performing modules from similar cohorts
        const suggestedModules = await this.getSuggestedModules(plan.cohort.primaryIssues);

        // Generate insights
        const insights: string[] = [];
        const allFeedbacks = plan.sessions.flatMap((s) => s.feedbacks);
        const avgRelevance =
            allFeedbacks.length > 0
                ? allFeedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / allFeedbacks.length
                : 0;

        if (avgRelevance >= 4.0) {
            insights.push("✅ This plan is performing excellently! Consider reusing for similar cohorts.");
        } else if (avgRelevance < 3.0) {
            insights.push("⚠️ This plan needs improvement. Review low-scoring sessions.");
        }

        if (lowPerformingSessions.length > 0) {
            insights.push(
                `📉 ${lowPerformingSessions.length} session(s) have low relevance scores. Consider replacing with alternative modules.`
            );
        }

        const unresolvedIssues = Array.from(
            new Set(allFeedbacks.flatMap((f) => f.unresolvedIssues))
        );
        if (unresolvedIssues.length > 0) {
            insights.push(
                `🔍 Common unresolved issues: ${unresolvedIssues.slice(0, 3).join(", ")}. Consider adding sessions addressing these.`
            );
        }

        return {
            lowPerformingSessions,
            suggestedModules,
            insights,
        };
    }

    /**
     * Get suggested modules based on issues
     */
    private static async getSuggestedModules(
        issues: string[]
    ): Promise<Array<{ moduleId: string; title: string; theme: string }>> {
        // Get modules with high ratings that address these issues
        const modules = await prisma.module.findMany({
            include: {
                planSessions: {
                    include: {
                        feedbacks: true,
                    },
                },
            },
        });

        return modules
            .filter((module) => {
                // Check if module theme matches any issue
                return issues.some((issue) =>
                    module.theme.toLowerCase().includes(issue.toLowerCase().replace(/_/g, " "))
                );
            })
            .map((module) => {
                const feedbacks = module.planSessions.flatMap((s) => s.feedbacks);
                const avgRelevance =
                    feedbacks.length > 0
                        ? feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / feedbacks.length
                        : 0;
                return {
                    moduleId: module.id,
                    title: module.title,
                    theme: module.theme,
                    avgRelevance,
                };
            })
            .filter((m) => m.avgRelevance >= 3.5)
            .sort((a, b) => b.avgRelevance - a.avgRelevance)
            .slice(0, 5)
            .map(({ moduleId, title, theme }) => ({ moduleId, title, theme }));
    }
}
