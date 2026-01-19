/**
 * Plan Validation Service
 * Validates training plans and suggests improvements
 */

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}

interface PlanData {
    sessionCount: number;
    totalDurationMinutes: number;
    sessions: Array<{
        sessionNumber: number;
        durationMinutes: number;
        moduleId: string;
        objectives: string[];
    }>;
    cohort: {
        primaryIssues: string[];
        infrastructureLevel: string;
    };
}

export class PlanValidationService {
    /**
     * Validate a training plan
     */
    static validatePlan(plan: PlanData): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        const suggestions: string[] = [];

        // 1. Check session count
        if (plan.sessionCount < 3) {
            errors.push("Plan must contain at least 3 sessions");
        } else if (plan.sessionCount > 5) {
            warnings.push("Plan has more than 5 sessions - consider splitting into multiple training events");
        }

        // 2. Check total duration
        if (plan.totalDurationMinutes < 120) {
            warnings.push("Total duration is less than 2 hours - consider adding more content");
        } else if (plan.totalDurationMinutes > 360) {
            warnings.push("Total duration exceeds 6 hours - consider splitting across multiple days");
        }

        // 3. Check individual session durations
        plan.sessions.forEach((session) => {
            if (session.durationMinutes < 20) {
                warnings.push(
                    `Session ${session.sessionNumber} is very short (${session.durationMinutes} min) - consider combining with another session`
                );
            } else if (session.durationMinutes > 90) {
                warnings.push(
                    `Session ${session.sessionNumber} is very long (${session.durationMinutes} min) - consider breaking into smaller sessions`
                );
            }
        });

        // 4. Check for duplicate modules
        const moduleIds = plan.sessions.map((s) => s.moduleId);
        const duplicates = moduleIds.filter((id, index) => moduleIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            warnings.push("Plan contains duplicate modules - consider using different modules for variety");
        }

        // 5. Check objectives
        plan.sessions.forEach((session) => {
            if (!session.objectives || session.objectives.length === 0) {
                errors.push(`Session ${session.sessionNumber} has no learning objectives`);
            } else if (session.objectives.length < 2) {
                warnings.push(
                    `Session ${session.sessionNumber} has only ${session.objectives.length} objective - consider adding more specific learning outcomes`
                );
            } else if (session.objectives.length > 5) {
                warnings.push(
                    `Session ${session.sessionNumber} has ${session.objectives.length} objectives - consider focusing on 3-4 key outcomes`
                );
            }
        });

        // 6. Generate suggestions
        this.generateSuggestions(plan, suggestions);

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            suggestions,
        };
    }

    /**
     * Generate improvement suggestions
     */
    private static generateSuggestions(plan: PlanData, suggestions: string[]): void {
        // Suggest based on duration
        const avgDuration = plan.totalDurationMinutes / plan.sessionCount;
        if (avgDuration < 40) {
            suggestions.push(
                "Consider adding more activities or discussion time to each session (aim for 40-50 minutes per session)"
            );
        }

        // Suggest based on infrastructure
        if (plan.cohort.infrastructureLevel === "LOW") {
            suggestions.push(
                "Ensure all activities are offline-feasible and don't require electricity or internet"
            );
            suggestions.push("Consider adding more hands-on activities using local materials");
        }

        // Suggest based on issues
        if (plan.cohort.primaryIssues.includes("FLN_gaps")) {
            suggestions.push(
                "Include practical assessment techniques that teachers can use immediately in their classrooms"
            );
        }

        if (plan.cohort.primaryIssues.includes("language_mismatch")) {
            suggestions.push(
                "Emphasize code-switching strategies and bilingual teaching methods"
            );
        }

        if (plan.cohort.primaryIssues.includes("behavior_management")) {
            suggestions.push(
                "Include role-play activities where teachers can practice positive behavior management techniques"
            );
        }

        // General suggestions
        if (plan.sessionCount === 4) {
            suggestions.push(
                "Good session count! Consider structuring as: Foundation → Practice → Application → Reflection"
            );
        }

        // Duration-based suggestions
        if (plan.totalDurationMinutes >= 180 && plan.totalDurationMinutes <= 240) {
            suggestions.push(
                "Total duration (3-4 hours) is ideal for a half-day workshop format"
            );
        }
    }

    /**
     * Quick validation check (for API responses)
     */
    static quickValidate(sessionCount: number, totalDuration: number): boolean {
        return sessionCount >= 3 && sessionCount <= 5 && totalDuration >= 120 && totalDuration <= 360;
    }

    /**
     * Get validation summary
     */
    static getValidationSummary(result: ValidationResult): string {
        if (result.isValid && result.warnings.length === 0) {
            return "✅ Plan looks excellent!";
        } else if (result.isValid && result.warnings.length > 0) {
            return `⚠️ Plan is valid but has ${result.warnings.length} warning(s)`;
        } else {
            return `❌ Plan has ${result.errors.length} error(s) that must be fixed`;
        }
    }
}
