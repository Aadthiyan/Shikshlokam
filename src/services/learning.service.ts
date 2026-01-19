/**
 * Learning Service
 * Implements continuous improvement through feedback analysis
 */

import { prisma } from "@/lib/prisma";

// ============================================
// TYPES
// ============================================

interface ModuleEffectiveness {
    moduleId: string;
    moduleTitle: string;
    theme: string;
    effectivenessScore: number; // Weighted score 0-100
    usageCount: number;
    avgRelevance: number;
    avgConfidence: number;
    recentPerformance: number; // Last 30 days
    trend: "improving" | "stable" | "declining";
    recommendForUse: boolean;
}

interface CohortPattern {
    cohortType: string; // e.g., "FLN_gaps_tribal_low_infra"
    successfulModules: string[];
    avgRelevance: number;
    planCount: number;
    bestPlanId: string;
}

interface UnresolvedPattern {
    issue: string;
    frequency: number;
    affectedCohorts: string[];
    suggestedActions: string[];
}

interface ImprovementMetrics {
    period: string;
    avgRelevance: number;
    avgConfidence: number;
    improvementRate: number; // Percentage change
}

// ============================================
// LEARNING SERVICE
// ============================================

export class LearningService {
    /**
     * Calculate module effectiveness scores
     */
    static async calculateModuleEffectiveness(): Promise<ModuleEffectiveness[]> {
        const modules = await prisma.module.findMany({
            include: {
                planSessions: {
                    include: {
                        feedbacks: {
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                    },
                },
            },
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return modules.map((module) => {
            const allFeedbacks = module.planSessions.flatMap((s) => s.feedbacks);
            const recentFeedbacks = allFeedbacks.filter(
                (f) => new Date(f.createdAt) >= thirtyDaysAgo
            );

            // Calculate metrics
            const avgRelevance =
                allFeedbacks.length > 0
                    ? allFeedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / allFeedbacks.length
                    : 0;

            const avgConfidence =
                allFeedbacks.length > 0
                    ? allFeedbacks.reduce((sum, f) => sum + f.confidenceScore, 0) / allFeedbacks.length
                    : 0;

            const recentPerformance =
                recentFeedbacks.length > 0
                    ? recentFeedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) /
                    recentFeedbacks.length
                    : avgRelevance;

            // Calculate effectiveness score (0-100)
            // Weighted: 40% avg relevance, 30% avg confidence, 20% usage, 10% recency
            const relevanceScore = (avgRelevance / 5) * 40;
            const confidenceScore = (avgConfidence / 5) * 30;
            const usageScore = Math.min((module.planSessions.length / 10) * 20, 20);
            const recencyBonus = recentFeedbacks.length > 0 ? 10 : 0;

            const effectivenessScore = relevanceScore + confidenceScore + usageScore + recencyBonus;

            // Determine trend
            let trend: "improving" | "stable" | "declining";
            if (recentPerformance > avgRelevance + 0.3) trend = "improving";
            else if (recentPerformance < avgRelevance - 0.3) trend = "declining";
            else trend = "stable";

            // Recommend for use if score >= 60 and not declining
            const recommendForUse = effectivenessScore >= 60 && trend !== "declining";

            return {
                moduleId: module.id,
                moduleTitle: module.title,
                theme: module.theme,
                effectivenessScore: Math.round(effectivenessScore),
                usageCount: module.planSessions.length,
                avgRelevance,
                avgConfidence,
                recentPerformance,
                trend,
                recommendForUse,
            };
        }).sort((a, b) => b.effectivenessScore - a.effectivenessScore);
    }

    /**
     * Identify cohort patterns and successful plans
     */
    static async identifyCohortPatterns(): Promise<CohortPattern[]> {
        const cohorts = await prisma.cohort.findMany({
            include: {
                plans: {
                    include: {
                        sessions: {
                            include: {
                                module: true,
                                feedbacks: true,
                            },
                        },
                    },
                },
            },
        });

        const patterns: CohortPattern[] = [];

        cohorts.forEach((cohort) => {
            if (cohort.plans.length === 0) return;

            // Create cohort type signature
            const cohortType = [
                ...cohort.primaryIssues.slice(0, 2),
                cohort.infrastructureLevel,
                cohort.gradeBand,
            ]
                .filter(Boolean)
                .join("_");

            // Find best plan
            const plansWithScores = cohort.plans.map((plan) => {
                const feedbacks = plan.sessions.flatMap((s) => s.feedbacks);
                const avgRelevance =
                    feedbacks.length > 0
                        ? feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / feedbacks.length
                        : 0;
                return { planId: plan.id, avgRelevance, plan };
            });

            const bestPlan = plansWithScores.reduce((best, current) =>
                current.avgRelevance > best.avgRelevance ? current : best
            );

            // Get successful modules from best plan
            const successfulModules = bestPlan.plan.sessions
                .map((s) => s.module.id)
                .filter((id, index, self) => self.indexOf(id) === index);

            // Calculate overall cohort performance
            const allFeedbacks = cohort.plans.flatMap((p) =>
                p.sessions.flatMap((s) => s.feedbacks)
            );
            const avgRelevance =
                allFeedbacks.length > 0
                    ? allFeedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / allFeedbacks.length
                    : 0;

            patterns.push({
                cohortType,
                successfulModules,
                avgRelevance,
                planCount: cohort.plans.length,
                bestPlanId: bestPlan.planId,
            });
        });

        return patterns.sort((a, b) => b.avgRelevance - a.avgRelevance);
    }

    /**
     * Identify unresolved issue patterns
     */
    static async identifyUnresolvedPatterns(): Promise<UnresolvedPattern[]> {
        const feedbacks = await prisma.sessionFeedback.findMany({
            include: {
                planSession: {
                    include: {
                        plan: {
                            include: {
                                cohort: true,
                            },
                        },
                    },
                },
            },
        });

        // Group by issue
        const issueMap: Record<
            string,
            { count: number; cohorts: Set<string>; cohortNames: Set<string> }
        > = {};

        feedbacks.forEach((feedback) => {
            feedback.unresolvedIssues.forEach((issue) => {
                if (!issueMap[issue]) {
                    issueMap[issue] = {
                        count: 0,
                        cohorts: new Set(),
                        cohortNames: new Set(),
                    };
                }
                issueMap[issue].count++;
                issueMap[issue].cohorts.add(feedback.planSession.plan.cohort.id);
                issueMap[issue].cohortNames.add(feedback.planSession.plan.cohort.name);
            });
        });

        // Convert to patterns with suggestions
        return Object.entries(issueMap)
            .map(([issue, data]) => {
                const suggestedActions = this.getSuggestedActions(issue, data.count);

                return {
                    issue,
                    frequency: data.count,
                    affectedCohorts: Array.from(data.cohortNames),
                    suggestedActions,
                };
            })
            .sort((a, b) => b.frequency - a.frequency);
    }

    /**
     * Get suggested actions for unresolved issues
     */
    private static getSuggestedActions(issue: string, frequency: number): string[] {
        const actions: string[] = [];

        if (frequency >= 10) {
            actions.push("High priority: Create dedicated training module");
        } else if (frequency >= 5) {
            actions.push("Medium priority: Enhance existing modules");
        }

        // Issue-specific suggestions
        const issueLower = issue.toLowerCase();
        if (issueLower.includes("fln")) {
            actions.push("Add more FLN assessment techniques");
            actions.push("Include remedial teaching strategies");
        } else if (issueLower.includes("language")) {
            actions.push("Develop bilingual teaching resources");
            actions.push("Add code-switching strategies");
        } else if (issueLower.includes("behavior")) {
            actions.push("Include positive behavior management techniques");
            actions.push("Add classroom management strategies");
        } else if (issueLower.includes("assessment")) {
            actions.push("Provide diverse assessment tools");
            actions.push("Include formative assessment techniques");
        } else if (issueLower.includes("technology")) {
            actions.push("Add offline alternatives");
            actions.push("Include low-tech solutions");
        }

        return actions;
    }

    /**
     * Calculate improvement metrics over time
     */
    static async calculateImprovementMetrics(
        months: number = 3
    ): Promise<ImprovementMetrics[]> {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

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

        // Group by month
        const monthlyData: Record<
            string,
            { relevance: number[]; confidence: number[] }
        > = {};

        feedbacks.forEach((feedback) => {
            const month = new Date(feedback.createdAt).toISOString().slice(0, 7); // YYYY-MM
            if (!monthlyData[month]) {
                monthlyData[month] = { relevance: [], confidence: [] };
            }
            monthlyData[month].relevance.push(feedback.relevanceScore);
            monthlyData[month].confidence.push(feedback.confidenceScore);
        });

        // Calculate metrics
        const metrics = Object.entries(monthlyData).map(([month, data]) => {
            const avgRelevance =
                data.relevance.reduce((a, b) => a + b, 0) / data.relevance.length;
            const avgConfidence =
                data.confidence.reduce((a, b) => a + b, 0) / data.confidence.length;

            return {
                period: month,
                avgRelevance,
                avgConfidence,
                improvementRate: 0, // Will be calculated next
            };
        });

        // Calculate improvement rates
        for (let i = 1; i < metrics.length; i++) {
            const previous = metrics[i - 1].avgRelevance;
            const current = metrics[i].avgRelevance;
            metrics[i].improvementRate =
                previous > 0 ? ((current - previous) / previous) * 100 : 0;
        }

        return metrics;
    }

    /**
     * Find similar cohorts based on characteristics
     */
    static async findSimilarCohorts(
        cohortId: string,
        limit: number = 5
    ): Promise<
        Array<{
            cohortId: string;
            cohortName: string;
            similarityScore: number;
            bestPlanId: string | null;
            avgRelevance: number;
        }>
    > {
        const targetCohort = await prisma.cohort.findUnique({
            where: { id: cohortId },
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

        if (!targetCohort) return [];

        const allCohorts = await prisma.cohort.findMany({
            where: {
                id: {
                    not: cohortId,
                },
            },
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

        // Calculate similarity scores
        const similarities = allCohorts.map((cohort) => {
            let score = 0;

            // Primary issues match (40 points)
            const commonIssues = targetCohort.primaryIssues.filter((issue) =>
                cohort.primaryIssues.includes(issue)
            );
            score += (commonIssues.length / Math.max(targetCohort.primaryIssues.length, 1)) * 40;

            // Infrastructure level match (20 points)
            if (cohort.infrastructureLevel === targetCohort.infrastructureLevel) {
                score += 20;
            }

            // Grade band match (20 points)
            if (cohort.gradeBand === targetCohort.gradeBand) {
                score += 20;
            }

            // Language match (10 points)
            if (cohort.language === targetCohort.language) {
                score += 10;
            }

            // Teacher count similarity (10 points)
            const teacherDiff = Math.abs(
                cohort.teacherCountEstimate - targetCohort.teacherCountEstimate
            );
            score += Math.max(10 - teacherDiff / 10, 0);

            // Find best plan
            const plansWithScores = cohort.plans.map((plan) => {
                const feedbacks = plan.sessions.flatMap((s) => s.feedbacks);
                const avgRelevance =
                    feedbacks.length > 0
                        ? feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) / feedbacks.length
                        : 0;
                return { planId: plan.id, avgRelevance };
            });

            const bestPlan =
                plansWithScores.length > 0
                    ? plansWithScores.reduce((best, current) =>
                        current.avgRelevance > best.avgRelevance ? current : best
                    )
                    : null;

            return {
                cohortId: cohort.id,
                cohortName: cohort.name,
                similarityScore: Math.round(score),
                bestPlanId: bestPlan?.planId || null,
                avgRelevance: bestPlan?.avgRelevance || 0,
            };
        });

        // Sort by similarity and return top matches
        return similarities
            .filter((s) => s.similarityScore >= 30) // At least 30% similar
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }

    /**
     * Get recommended modules for a cohort based on learning
     */
    static async getRecommendedModules(
        cohortId: string,
        limit: number = 10
    ): Promise<ModuleEffectiveness[]> {
        const cohort = await prisma.cohort.findUnique({
            where: { id: cohortId },
        });

        if (!cohort) return [];

        // Get all module effectiveness scores
        const allModules = await this.calculateModuleEffectiveness();

        // Find similar cohorts
        const similarCohorts = await this.findSimilarCohorts(cohortId, 3);

        // Get modules used in similar successful cohorts
        const similarCohortModules = new Set<string>();
        for (const similar of similarCohorts) {
            if (similar.bestPlanId) {
                const plan = await prisma.plan.findUnique({
                    where: { id: similar.bestPlanId },
                    include: {
                        sessions: {
                            include: {
                                module: true,
                            },
                        },
                    },
                });
                plan?.sessions.forEach((s) => similarCohortModules.add(s.moduleId));
            }
        }

        // Boost scores for modules used in similar cohorts
        const boostedModules = allModules.map((module) => {
            if (similarCohortModules.has(module.moduleId)) {
                return {
                    ...module,
                    effectivenessScore: Math.min(module.effectivenessScore + 15, 100),
                };
            }
            return module;
        });

        // Filter and sort
        return boostedModules
            .filter((m) => m.recommendForUse)
            .sort((a, b) => b.effectivenessScore - a.effectivenessScore)
            .slice(0, limit);
    }
}
