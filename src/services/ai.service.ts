/**
 * AI Service - Groq Integration with OpenAI Fallback
 * Handles AI-assisted plan generation and contextualization
 */

import Groq from "groq-sdk";
import OpenAI from "openai";
import { CohortProfile, AIGeneratedPlan } from "@/types";

// ============================================
// CONFIGURATION
// ============================================

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENAI_MODEL = "gpt-3.5-turbo";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 30000;

// ============================================
// CLIENT INITIALIZATION
// ============================================

let groqClient: Groq | null = null;
let openaiClient: OpenAI | null = null;

if (GROQ_API_KEY) {
    groqClient = new Groq({
        apiKey: GROQ_API_KEY,
    });
}

if (OPENAI_API_KEY) {
    openaiClient = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });
}

// ============================================
// TYPES
// ============================================

interface ModuleCandidate {
    id: string;
    title: string;
    theme: string;
    competencyTags: string[];
    durationMinutes: number;
    objectives: string[];
    description: string;
}

interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
}

interface AIServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    tokenUsage?: TokenUsage;
    provider?: "groq" | "openai" | "fallback";
    retries?: number;
}

// ============================================
// PROMPT TEMPLATES
// ============================================

function buildPlanGenerationPrompt(
    cohortProfile: CohortProfile,
    modules: ModuleCandidate[]
): string {
    return `You are an expert in teacher professional development for India's DIET/SCERT system.

**Context:**
You are helping design a personalized training plan for a cohort of teachers with the following profile:

**Cohort Profile:**
- Primary Issues: ${cohortProfile.issues.join(", ")}
- Language Context: ${cohortProfile.language}
- Grade Band: ${cohortProfile.gradeBand}
- Infrastructure Level: ${cohortProfile.infrastructureLevel}
- Additional Context: ${cohortProfile.context}
- Number of Teachers: ${cohortProfile.teacherCount}

**Available Training Modules:**
${modules
            .map(
                (m, i) => `
${i + 1}. **${m.title}** (${m.durationMinutes} min)
   - **Module ID:** ${m.id}
   - Theme: ${m.theme}
   - Competencies: ${m.competencyTags.join(", ")}
   - Objectives: ${m.objectives.join("; ")}
`
            )
            .join("\n")}

**Your Task:**
Create a 3-4 session training plan that:
1. Addresses the cohort's primary issues effectively
2. Follows a logical pedagogical sequence (foundation → practice → application → reflection)
3. Is contextualized to their language, infrastructure, and cultural context
4. Uses ONLY the module IDs from the list above

**Output Format (JSON):**
{
  "sessions": [
    {
      "sessionNumber": 1,
      "moduleId": "USE_EXACT_MODULE_ID_FROM_ABOVE",
      "title": "Contextualized session title",
      "objectives": ["Objective 1", "Objective 2", "Objective 3"],
      "trainerNotes": "Specific contextual notes for this cohort (examples, local references, adaptations for infrastructure/language)",
      "rationale": "Why this session is first and how it addresses cohort needs"
    }
  ],
  "overallRationale": "Brief explanation of the training plan sequence and how it addresses the cohort's needs"
}

**CRITICAL: Use ONLY the exact Module IDs listed above. Do NOT create new IDs.**

**Important Guidelines:**
- Use ALL available modules if they're relevant (3-4 sessions)
- Make trainer notes SPECIFIC to the cohort context (e.g., if tribal context, mention local examples; if low infrastructure, suggest offline alternatives)
- Ensure objectives are actionable and measurable
- Consider the cohort's language context in your suggestions
- Keep the plan practical and immediately implementable

Return ONLY valid JSON, no additional text.`;
}

function buildLocalizationPrompt(
    sessionTitle: string,
    objectives: string[],
    targetContext: string
): string {
    return `You are localizing a teacher training session for the Indian education context.

**Original Session:**
Title: ${sessionTitle}
Objectives: ${objectives.join("; ")}

**Target Context:**
${targetContext}

**Your Task:**
Provide 3-5 specific, contextual examples or adaptations that make this session more relevant and practical for teachers in this context.

**Output Format (JSON):**
{
  "contextualExamples": [
    "Example 1: Specific, actionable suggestion",
    "Example 2: Another practical adaptation",
    "Example 3: Local reference or cultural consideration"
  ]
}

Return ONLY valid JSON, no additional text.`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateCost(usage: { prompt_tokens?: number; completion_tokens?: number }): number {
    // Groq is free, but we track for monitoring
    // OpenAI GPT-3.5-turbo: $0.0015/1K prompt tokens, $0.002/1K completion tokens
    const promptCost = ((usage.prompt_tokens || 0) / 1000) * 0.0015;
    const completionCost = ((usage.completion_tokens || 0) / 1000) * 0.002;
    return promptCost + completionCost;
}

function parseAIResponse<T>(response: string): T {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    return JSON.parse(cleaned);
}

// ============================================
// CORE AI SERVICE
// ============================================

export class AIService {
    /**
     * Generate training plan using AI
     */
    static async generateTrainingPlan(
        cohortProfile: CohortProfile,
        modules: ModuleCandidate[]
    ): Promise<AIServiceResponse<AIGeneratedPlan>> {
        const prompt = buildPlanGenerationPrompt(cohortProfile, modules);

        // Try Groq first (free, fast)
        if (groqClient) {
            const groqResult = await this.callGroq(prompt);
            if (groqResult.success && groqResult.data) {
                try {
                    const parsed = parseAIResponse<AIGeneratedPlan>(groqResult.data);
                    return {
                        success: true,
                        data: parsed,
                        tokenUsage: groqResult.tokenUsage,
                        provider: "groq",
                        retries: groqResult.retries,
                    };
                } catch (parseError) {
                    console.error("Failed to parse Groq response:", parseError);
                    // Fall through to OpenAI
                }
            }
        }

        // Fallback to OpenAI
        if (openaiClient) {
            const openaiResult = await this.callOpenAI(prompt);
            if (openaiResult.success && openaiResult.data) {
                try {
                    const parsed = parseAIResponse<AIGeneratedPlan>(openaiResult.data);
                    return {
                        success: true,
                        data: parsed,
                        tokenUsage: openaiResult.tokenUsage,
                        provider: "openai",
                        retries: openaiResult.retries,
                    };
                } catch (parseError) {
                    console.error("Failed to parse OpenAI response:", parseError);
                }
            }
        }

        // Both failed or not configured
        return {
            success: false,
            error: "AI service unavailable. Please configure GROQ_API_KEY or OPENAI_API_KEY.",
            provider: "fallback",
        };
    }

    /**
     * Localize session content for specific context
     */
    static async localizeSession(
        sessionTitle: string,
        objectives: string[],
        targetContext: string
    ): Promise<AIServiceResponse<{ contextualExamples: string[] }>> {
        const prompt = buildLocalizationPrompt(sessionTitle, objectives, targetContext);

        // Try Groq first
        if (groqClient) {
            const groqResult = await this.callGroq(prompt);
            if (groqResult.success && groqResult.data) {
                try {
                    const parsed = parseAIResponse<{ contextualExamples: string[] }>(groqResult.data);
                    return {
                        success: true,
                        data: parsed,
                        tokenUsage: groqResult.tokenUsage,
                        provider: "groq",
                    };
                } catch (parseError) {
                    console.error("Failed to parse Groq localization response:", parseError);
                }
            }
        }

        // Fallback to OpenAI
        if (openaiClient) {
            const openaiResult = await this.callOpenAI(prompt);
            if (openaiResult.success && openaiResult.data) {
                try {
                    const parsed = parseAIResponse<{ contextualExamples: string[] }>(openaiResult.data);
                    return {
                        success: true,
                        data: parsed,
                        tokenUsage: openaiResult.tokenUsage,
                        provider: "openai",
                    };
                } catch (parseError) {
                    console.error("Failed to parse OpenAI localization response:", parseError);
                }
            }
        }

        return {
            success: false,
            error: "AI service unavailable for localization.",
            provider: "fallback",
        };
    }

    /**
     * Call Groq API with retry logic
     */
    private static async callGroq(
        prompt: string,
        retries = 0
    ): Promise<AIServiceResponse<string>> {
        if (!groqClient) {
            return { success: false, error: "Groq client not initialized" };
        }

        try {
            const startTime = Date.now();

            const completion = await groqClient.chat.completions.create({
                model: GROQ_MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 2000,
            });

            const duration = Date.now() - startTime;
            const content = completion.choices[0]?.message?.content || "";

            console.log(`[Groq] Request completed in ${duration}ms`);

            return {
                success: true,
                data: content,
                tokenUsage: {
                    promptTokens: completion.usage?.prompt_tokens || 0,
                    completionTokens: completion.usage?.completion_tokens || 0,
                    totalTokens: completion.usage?.total_tokens || 0,
                    estimatedCost: 0, // Groq is free
                },
                provider: "groq",
                retries,
            };
        } catch (error: any) {
            console.error(`[Groq] Error (attempt ${retries + 1}/${MAX_RETRIES}):`, error.message);

            // Retry logic
            if (retries < MAX_RETRIES) {
                const delay = RETRY_DELAY_MS * Math.pow(2, retries); // Exponential backoff
                console.log(`[Groq] Retrying in ${delay}ms...`);
                await sleep(delay);
                return this.callGroq(prompt, retries + 1);
            }

            return {
                success: false,
                error: error.message || "Groq API call failed",
                retries,
            };
        }
    }

    /**
     * Call OpenAI API with retry logic
     */
    private static async callOpenAI(
        prompt: string,
        retries = 0
    ): Promise<AIServiceResponse<string>> {
        if (!openaiClient) {
            return { success: false, error: "OpenAI client not initialized" };
        }

        try {
            const startTime = Date.now();

            const completion = await openaiClient.chat.completions.create({
                model: OPENAI_MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 2000,
            });

            const duration = Date.now() - startTime;
            const content = completion.choices[0]?.message?.content || "";

            console.log(`[OpenAI] Request completed in ${duration}ms`);

            return {
                success: true,
                data: content,
                tokenUsage: {
                    promptTokens: completion.usage?.prompt_tokens || 0,
                    completionTokens: completion.usage?.completion_tokens || 0,
                    totalTokens: completion.usage?.total_tokens || 0,
                    estimatedCost: calculateCost(completion.usage || {}),
                },
                provider: "openai",
                retries,
            };
        } catch (error: any) {
            console.error(`[OpenAI] Error (attempt ${retries + 1}/${MAX_RETRIES}):`, error.message);

            // Retry logic
            if (retries < MAX_RETRIES) {
                const delay = RETRY_DELAY_MS * Math.pow(2, retries);
                console.log(`[OpenAI] Retrying in ${delay}ms...`);
                await sleep(delay);
                return this.callOpenAI(prompt, retries + 1);
            }

            return {
                success: false,
                error: error.message || "OpenAI API call failed",
                retries,
            };
        }
    }

    /**
     * Health check for AI services
     */
    static async healthCheck(): Promise<{
        groq: { available: boolean; latency?: number; error?: string };
        openai: { available: boolean; latency?: number; error?: string };
    }> {
        const result = {
            groq: { available: false, latency: undefined, error: undefined } as {
                available: boolean;
                latency?: number;
                error?: string;
            },
            openai: { available: false, latency: undefined, error: undefined } as {
                available: boolean;
                latency?: number;
                error?: string;
            },
        };

        // Test Groq
        if (groqClient) {
            try {
                const startTime = Date.now();
                await groqClient.chat.completions.create({
                    model: GROQ_MODEL,
                    messages: [{ role: "user", content: "Hello" }],
                    max_tokens: 5,
                });
                result.groq.available = true;
                result.groq.latency = Date.now() - startTime;
            } catch (error: any) {
                result.groq.error = error.message;
            }
        } else {
            result.groq.error = "Groq API key not configured";
        }

        // Test OpenAI
        if (openaiClient) {
            try {
                const startTime = Date.now();
                await openaiClient.chat.completions.create({
                    model: OPENAI_MODEL,
                    messages: [{ role: "user", content: "Hello" }],
                    max_tokens: 5,
                });
                result.openai.available = true;
                result.openai.latency = Date.now() - startTime;
            } catch (error: any) {
                result.openai.error = error.message;
            }
        } else {
            result.openai.error = "OpenAI API key not configured";
        }

        return result;
    }
}
