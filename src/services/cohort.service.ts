/**
 * Cohort Service - Intelligent grouping of needs into cohorts
 */

import { prisma } from "@/lib/prisma";
import type { NeedSignal, Cluster, InfraLevel } from "@prisma/client";

// ============================================
// TYPES
// ============================================

interface NeedSignalWithCluster extends NeedSignal {
    cluster: Cluster;
}

interface CohortSuggestion {
    name: string;
    description: string;
    tags: string[];
    primaryIssues: string[];
    language: string;
    gradeBand: string;
    infrastructureLevel: InfraLevel;
    needSignalIds: string[];
    teacherCountEstimate: number;
    clusterCount: number;
}

// ============================================
// COHORT GROUPING LOGIC
// ============================================

export class CohortService {
    /**
     * Analyze needs and suggest cohorts
     */
    static async suggestCohorts(needSignalIds?: string[]): Promise<CohortSuggestion[]> {
        // Fetch needs with cluster data
        const needs = await prisma.needSignal.findMany({
            where: needSignalIds ? { id: { in: needSignalIds } } : {},
            include: {
                cluster: true,
            },
        });

        if (needs.length === 0) {
            return [];
        }

        // Group needs by similarity
        const groups = this.groupNeedsBySimilarity(needs as NeedSignalWithCluster[]);

        // Convert groups to cohort suggestions
        const suggestions = groups.map((group) => this.createCohortSuggestion(group));

        return suggestions;
    }

    /**
     * Group needs by similarity using rule-based algorithm
     */
    private static groupNeedsBySimilarity(
        needs: NeedSignalWithCluster[]
    ): NeedSignalWithCluster[][] {
        const groups: NeedSignalWithCluster[][] = [];

        // Sort needs by primary issue for better grouping
        const sortedNeeds = [...needs].sort((a, b) => {
            const aIssue = a.issueTags[0] || "";
            const bIssue = b.issueTags[0] || "";
            return aIssue.localeCompare(bIssue);
        });

        for (const need of sortedNeeds) {
            let addedToGroup = false;

            // Try to find a matching group
            for (const group of groups) {
                if (this.isSimilarToGroup(need, group)) {
                    group.push(need);
                    addedToGroup = true;
                    break;
                }
            }

            // Create new group if no match found
            if (!addedToGroup) {
                groups.push([need]);
            }
        }

        // Filter out single-need groups (require at least 2 needs for a cohort)
        return groups.filter((group) => group.length >= 2);
    }

    /**
     * Check if a need is similar to an existing group
     */
    private static isSimilarToGroup(
        need: NeedSignalWithCluster,
        group: NeedSignalWithCluster[]
    ): boolean {
        if (group.length === 0) return false;

        const representative = group[0];
        let similarityScore = 0;

        // 1. Primary issue match (40% weight)
        const needPrimaryIssue = need.issueTags[0];
        const groupPrimaryIssue = representative.issueTags[0];
        if (needPrimaryIssue === groupPrimaryIssue) {
            similarityScore += 40;
        }

        // 2. Language match (25% weight)
        if (need.cluster.primaryLanguage === representative.cluster.primaryLanguage) {
            similarityScore += 25;
        }

        // 3. Infrastructure level match (20% weight)
        if (need.cluster.infrastructureLevel === representative.cluster.infrastructureLevel) {
            similarityScore += 20;
        }

        // 4. Grade band overlap (15% weight)
        const needGradeBand = this.determineGradeBand(need.grades);
        const groupGradeBand = this.determineGradeBand(representative.grades);
        if (needGradeBand === groupGradeBand) {
            similarityScore += 15;
        }

        // Threshold: 60% similarity required
        return similarityScore >= 60;
    }

    /**
     * Determine grade band from grades array
     */
    private static determineGradeBand(grades: string[]): string {
        const gradeNums = grades.map((g) => parseInt(g)).filter((g) => !isNaN(g));
        if (gradeNums.length === 0) return "all";

        const minGrade = Math.min(...gradeNums);
        const maxGrade = Math.max(...gradeNums);

        if (maxGrade <= 3) return "primary_1_3";
        if (minGrade >= 4 && maxGrade <= 5) return "primary_4_5";
        if (minGrade >= 6) return "secondary_6_8";
        if (minGrade <= 3 && maxGrade <= 5) return "primary_1_5";
        return "all";
    }

    /**
     * Create cohort suggestion from a group of needs
     */
    private static createCohortSuggestion(
        group: NeedSignalWithCluster[]
    ): CohortSuggestion {
        // Extract common characteristics
        const primaryIssues = this.extractPrimaryIssues(group);
        const language = group[0].cluster.primaryLanguage;
        const infrastructureLevel = group[0].cluster.infrastructureLevel;
        const gradeBand = this.determineGradeBand(group[0].grades);

        // Calculate teacher count estimate
        const teacherCountEstimate = group.reduce(
            (sum, need) => sum + need.cluster.teacherCountEstimate,
            0
        );

        // Count unique clusters
        const clusterCount = new Set(group.map((n) => n.clusterId)).size;

        // Generate cohort name
        const name = this.generateCohortName(primaryIssues, language, gradeBand);

        // Generate description
        const description = this.generateCohortDescription(
            group,
            primaryIssues,
            language,
            infrastructureLevel,
            gradeBand
        );

        // Generate tags
        const tags = this.generateCohortTags(
            primaryIssues,
            language,
            infrastructureLevel,
            gradeBand
        );

        return {
            name,
            description,
            tags,
            primaryIssues,
            language,
            gradeBand,
            infrastructureLevel,
            needSignalIds: group.map((n) => n.id),
            teacherCountEstimate,
            clusterCount,
        };
    }

    /**
     * Extract primary issues from a group
     */
    private static extractPrimaryIssues(group: NeedSignalWithCluster[]): string[] {
        const issueCount: Record<string, number> = {};

        group.forEach((need) => {
            need.issueTags.forEach((issue) => {
                issueCount[issue] = (issueCount[issue] || 0) + 1;
            });
        });

        // Sort by frequency and take top 3
        return Object.entries(issueCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([issue]) => issue);
    }

    /**
     * Generate cohort name
     */
    private static generateCohortName(
        primaryIssues: string[],
        language: string,
        gradeBand: string
    ): string {
        const issueLabel = primaryIssues[0]?.replace(/_/g, " ") || "General";
        const gradeBandLabel = this.getGradeBandLabel(gradeBand);

        return `${issueLabel} - ${language} - ${gradeBandLabel}`;
    }

    /**
     * Generate cohort description
     */
    private static generateCohortDescription(
        group: NeedSignalWithCluster[],
        primaryIssues: string[],
        language: string,
        infrastructureLevel: InfraLevel,
        gradeBand: string
    ): string {
        const clusterNames = group.map((n) => n.cluster.name).join(", ");
        const issueLabels = primaryIssues.map((i) => i.replace(/_/g, " ")).join(", ");
        const gradeBandLabel = this.getGradeBandLabel(gradeBand);

        return `Training cohort for ${gradeBandLabel} teachers addressing ${issueLabels}. Primary language: ${language}. Infrastructure: ${infrastructureLevel}. Clusters: ${clusterNames}.`;
    }

    /**
     * Generate cohort tags
     */
    private static generateCohortTags(
        primaryIssues: string[],
        language: string,
        infrastructureLevel: InfraLevel,
        gradeBand: string
    ): string[] {
        return [
            ...primaryIssues,
            language.toLowerCase(),
            infrastructureLevel.toLowerCase(),
            gradeBand,
        ];
    }

    /**
     * Get human-readable grade band label
     */
    private static getGradeBandLabel(gradeBand: string): string {
        const labels: Record<string, string> = {
            primary_1_3: "Primary 1-3",
            primary_4_5: "Primary 4-5",
            primary_1_5: "Primary 1-5",
            secondary_6_8: "Secondary 6-8",
            all: "All Grades",
        };
        return labels[gradeBand] || "Mixed Grades";
    }

    /**
     * Create cohort from suggestion
     */
    static async createCohort(
        suggestion: CohortSuggestion,
        userId: string
    ): Promise<any> {
        // Ensure user exists
        const user = await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                clerkId: userId,
                email: `${userId}@diet-training.gov.in`,
                name: "Demo User",
                role: "PLANNER",
            },
        });

        // Create cohort
        const cohort = await prisma.cohort.create({
            data: {
                name: suggestion.name,
                description: suggestion.description,
                tags: suggestion.tags,
                primaryIssues: suggestion.primaryIssues,
                language: suggestion.language,
                gradeBand: suggestion.gradeBand,
                infrastructureLevel: suggestion.infrastructureLevel,
                teacherCountEstimate: suggestion.teacherCountEstimate,
                clusterCount: suggestion.clusterCount,
                createdById: user.id,
            },
        });

        // Link need signals to cohort
        await prisma.cohortNeedSignal.createMany({
            data: suggestion.needSignalIds.map((needSignalId) => ({
                cohortId: cohort.id,
                needSignalId,
            })),
        });

        // Return cohort with need signals
        return await prisma.cohort.findUnique({
            where: { id: cohort.id },
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
            },
        });
    }

    /**
     * Get cohort profile for AI plan generation
     */
    static async getCohortProfile(cohortId: string) {
        const cohort = await prisma.cohort.findUnique({
            where: { id: cohortId },
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
            },
        });

        if (!cohort) {
            throw new Error("Cohort not found");
        }

        // Build context string
        const clusters = cohort.needSignals.map((ns) => ns.needSignal.cluster);
        const uniqueClusters = Array.from(
            new Map(clusters.map((c) => [c.id, c])).values()
        );

        const context = `
Cohort: ${cohort.name}
Teachers: ${cohort.teacherCountEstimate}
Clusters: ${uniqueClusters.map((c) => c.name).join(", ")}
Districts: ${[...new Set(uniqueClusters.map((c) => c.district))].join(", ")}
Infrastructure: ${cohort.infrastructureLevel}
    `.trim();

        return {
            issues: cohort.primaryIssues,
            language: cohort.language || "Hindi",
            gradeBand: cohort.gradeBand || "primary_1_3",
            infrastructureLevel: cohort.infrastructureLevel || "MEDIUM",
            context,
            teacherCount: cohort.teacherCountEstimate,
        };
    }
}
