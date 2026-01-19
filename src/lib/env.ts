/**
 * Environment Variable Validation
 * Ensures all required environment variables are set
 */

import { z } from "zod";

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // AI Services (at least one required)
    GROQ_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),

    // Authentication (optional for development)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    CLERK_SECRET_KEY: z.string().optional(),

    // App Configuration
    NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 */
export function validateEnv(): Env {
    try {
        const env = envSchema.parse(process.env);

        // Check that at least one AI service is configured
        if (!env.GROQ_API_KEY && !env.OPENAI_API_KEY) {
            console.warn(
                "⚠️  Warning: No AI service configured. Set GROQ_API_KEY or OPENAI_API_KEY for AI features."
            );
        }

        // Check authentication
        if (!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !env.CLERK_SECRET_KEY) {
            console.warn(
                "⚠️  Warning: Clerk authentication not configured. Some features may be limited."
            );
        }

        console.log("✅ Environment variables validated successfully");
        return env;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("❌ Environment variable validation failed:");
            error.issues.forEach((issue) => {
                console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
            });
            throw new Error("Invalid environment variables");
        }
        throw error;
    }
}

/**
 * Get environment variable with fallback
 */
export function getEnv<T extends keyof Env>(key: T, fallback?: Env[T]): Env[T] {
    const value = process.env[key] as Env[T];
    if (value === undefined && fallback !== undefined) {
        return fallback;
    }
    return value;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
}

/**
 * Check if AI services are configured
 */
export function hasAIService(): boolean {
    return !!(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
}

/**
 * Check if authentication is configured
 */
export function hasAuth(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
    );
}
