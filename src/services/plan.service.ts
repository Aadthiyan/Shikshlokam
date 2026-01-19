/**
 * Plan Generation Service
 * Combines rule-based module selection with AI-assisted plan structuring
 */

import { prisma } from "@/lib/prisma";
import { AIService } from "./ai.service";
import { CohortService } from "./cohort.service";

// ============================================
// TYPES
// ============================================

interface ModuleCandidate {
    id: string;
    title: string;
    theme: string;
    competencyTags: string[];
    durationMinutes: number;
    gradeBand: string;
    language: string;
    infraTags: string[];
    description: string;
    objectives: string[];
    relevanceScore: number;
}

interface PlanSession {
    sessionNumber: number;
    moduleId: string;
    title: string;
    objectives: string[];
    trainerNotes: string;
    durationMinutes: number;
}

interface GeneratedPlan {
    name: string;
    description: string;
    sessions: PlanSession[];
    totalDurationMinutes: number;
    sessionCount: number;
}

// ============================================
// PLAN GENERATION SERVICE
// ============================================

export class PlanGenerationService {
    /**
     * Generate training plan for a cohort
     */
    static async generatePlan(
        cohortId: string,
        options: {
            numSessions?: number;
            useAI?: boolean;
        } = {}
    ): Promise<GeneratedPlan> {
        const { numSessions = 4, useAI = true } = options;

        // 1. Get cohort profile
        const cohortProfile = await CohortService.getCohortProfile(cohortId);

        // 2. Select candidate modules
        const candidates = await this.selectModuleCandidates(cohortProfile, numSessions + 2);

        // 3. Generate plan using AI or fallback
        let plan: GeneratedPlan;

        if (useAI) {
            plan = await this.generatePlanWithAI(cohortProfile, candidates, numSessions);
        } else {
            plan = await this.generatePlanRuleBased(cohortProfile, candidates, numSessions);
        }

        return plan;
    }

    /**
     * Select module candidates based on cohort profile
     */
    private static async selectModuleCandidates(
        cohortProfile: any,
        count: number
    ): Promise<ModuleCandidate[]> {
        // Fetch all modules
        const allModules = await prisma.module.findMany();

        // Score each module for relevance
        const scoredModules = allModules.map((module) => {
            const score = this.calculateRelevanceScore(module, cohortProfile);
            return {
                ...module,
                relevanceScore: score,
            };
        });

        // Sort by relevance and take top N
        const topModules = scoredModules
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, count);

        return topModules;
    }

    /**
     * Calculate relevance score for a module
     */
    private static calculateRelevanceScore(module: any, cohortProfile: any): number {
        let score = 0;

        // Issue match (40 points)
        const issueMatches = cohortProfile.issues.filter((issue: string) =>
            module.theme.toLowerCase().includes(issue.toLowerCase().replace(/_/g, " "))
        );
        score += issueMatches.length * 40;

        // Competency tag match (30 points)
        const competencyMatches = cohortProfile.issues.filter((issue: string) =>
            module.competencyTags.some((tag: string) =>
                tag.toLowerCase().includes(issue.toLowerCase().replace(/_/g, "_"))
            )
        );
        score += competencyMatches.length * 30;

        // Grade band match (15 points)
        if (
            module.gradeBand === cohortProfile.gradeBand ||
            module.gradeBand === "all" ||
            cohortProfile.gradeBand === "all"
        ) {
            score += 15;
        }

        // Language match (10 points)
        if (module.language === cohortProfile.language || module.language === "Any") {
            score += 10;
        }

        // Infrastructure compatibility (5 points)
        const infraLevel = cohortProfile.infrastructureLevel.toLowerCase();
        if (infraLevel === "low" && module.infraTags.includes("offline_feasible")) {
            score += 5;
        } else if (infraLevel === "high" && module.infraTags.includes("internet_required")) {
            score += 5;
        } else if (module.infraTags.includes("offline_feasible")) {
            score += 3;
        }

        return score;
    }

    /**
     * Generate plan using AI (Groq)
     */
    private static async generatePlanWithAI(
        cohortProfile: any,
        candidates: ModuleCandidate[],
        numSessions: number
    ): Promise<GeneratedPlan> {
        // Call AI service
        const aiResponse = await AIService.generateTrainingPlan(cohortProfile, candidates);

        if (!aiResponse.success || !aiResponse.data) {
            console.warn("AI generation failed, falling back to rule-based");
            return this.generatePlanRuleBased(cohortProfile, candidates, numSessions);
        }

        const aiPlan = aiResponse.data;

        // Calculate total duration
        const totalDuration = aiPlan.sessions.reduce((sum, session) => {
            const module = candidates.find((m) => m.id === session.moduleId);
            return sum + (module?.durationMinutes || 0);
        }, 0);

        return {
            name: `Training Plan for ${cohortProfile.issues.join(", ")} - ${cohortProfile.language}`,
            description: aiPlan.overallRationale || `Personalized training plan for cohort addressing ${cohortProfile.issues.join(", ")}`,
            sessions: aiPlan.sessions.map((session: any) => {
                const module = candidates.find((m) => m.id === session.moduleId);
                return {
                    ...session,
                    durationMinutes: module?.durationMinutes || 45,
                };
            }),
            totalDurationMinutes: totalDuration,
            sessionCount: aiPlan.sessions.length,
        };
    }

    /**
     * Generate plan using rule-based logic (fallback)
     */
    private static async generatePlanRuleBased(
        cohortProfile: any,
        candidates: ModuleCandidate[],
        numSessions: number
    ): Promise<GeneratedPlan> {
        // Take top N modules
        const selectedModules = candidates.slice(0, numSessions);

        // Order modules logically
        const orderedModules = this.orderModulesLogically(selectedModules);

        // Create sessions
        const sessions: PlanSession[] = orderedModules.map((module, index) => ({
            sessionNumber: index + 1,
            moduleId: module.id,
            title: module.title,
            objectives: module.objectives,
            trainerNotes: this.generateTrainerNotes(module, cohortProfile),
            durationMinutes: module.durationMinutes,
        }));

        const totalDuration = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

        return {
            name: `Training Plan for ${cohortProfile.issues.join(", ")} - ${cohortProfile.language}`,
            description: `Personalized training plan addressing ${cohortProfile.issues.join(", ")} for ${cohortProfile.teacherCount} teachers`,
            sessions,
            totalDurationMinutes: totalDuration,
            sessionCount: sessions.length,
        };
    }

    /**
     * Order modules in logical pedagogical sequence
     */
    private static orderModulesLogically(modules: ModuleCandidate[]): ModuleCandidate[] {
        // Priority order for themes
        const themePriority: Record<string, number> = {
            FLN: 1, // Foundation first
            Assessment: 2, // Assessment early
            "Classroom Management": 3, // Management skills
            "Language Contextualization": 4, // Language support
            TLMs: 5, // Practical resources
            "Inclusive Pedagogy": 6, // Inclusive practices
            "Digital Learning": 7, // Advanced/optional
        };

        return modules.sort((a, b) => {
            const aPriority = themePriority[a.theme] || 99;
            const bPriority = themePriority[b.theme] || 99;

            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }

            // If same theme, sort by relevance score
            return b.relevanceScore - a.relevanceScore;
        });
    }

    /**
     * Generate contextualized trainer notes
     */
    private static generateTrainerNotes(
        module: ModuleCandidate,
        cohortProfile: any
    ): string {
        const notes: string[] = [];

        // Infrastructure notes
        if (cohortProfile.infrastructureLevel === "LOW") {
            notes.push(
                "Focus on offline activities and zero-cost materials. Avoid assuming access to electricity or internet."
            );
        }

        // Language notes
        if (cohortProfile.language !== "Hindi" && cohortProfile.language !== "English") {
            notes.push(
                `Consider using ${cohortProfile.language} for examples and explanations. Encourage code-switching where appropriate.`
            );
        }

        // Context-specific notes
        if (cohortProfile.context.toLowerCase().includes("tribal")) {
            notes.push(
                "Use culturally relevant examples from tribal contexts. Honor local knowledge and traditions."
            );
        }

        // Default note
        if (notes.length === 0) {
            notes.push(
                `Adapt examples and activities to the local context. Teacher count: ${cohortProfile.teacherCount}.`
            );
        }

        return notes.join(" ");
    }

    /**
     * Save generated plan to database
     */
    static async savePlan(
        cohortId: string,
        plan: GeneratedPlan,
        userId: string
    ): Promise<any> {
        // Create plan
        const createdPlan = await prisma.plan.create({
            data: {
                cohortId,
                createdById: userId,
                name: plan.name,
                sessionCount: plan.sessionCount,
                totalDurationMinutes: plan.totalDurationMinutes,
                status: "DRAFT",
            },
        });

        // Create sessions
        await prisma.planSession.createMany({
            data: plan.sessions.map((session, index) => ({
                planId: createdPlan.id,
                moduleId: session.moduleId,
                sessionNumber: session.sessionNumber,
                orderIndex: index,
                title: session.title,
                objectives: session.objectives,
                trainerNotes: session.trainerNotes,
                durationMinutes: session.durationMinutes,
            })),
        });

        // Return plan with sessions
        return await prisma.plan.findUnique({
            where: { id: createdPlan.id },
            include: {
                sessions: {
                    include: {
                        module: true,
                    },
                    orderBy: {
                        orderIndex: "asc",
                    },
                },
                cohort: true,
            },
        });
    }
}
