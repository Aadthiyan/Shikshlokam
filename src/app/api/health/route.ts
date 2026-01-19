/**
 * Health Check API Route
 * GET /api/health
 */

import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { DatabaseService } from "@/services/database.service";
import { hasAIService, hasAuth } from "@/lib/env";

export async function GET() {
    try {
        const startTime = Date.now();

        // Run health checks in parallel
        const [aiHealth, dbHealth] = await Promise.all([
            AIService.healthCheck(),
            DatabaseService.healthCheck(),
        ]);

        const totalLatency = Date.now() - startTime;

        // Determine overall status
        const isHealthy = dbHealth.available && (aiHealth.groq.available || aiHealth.openai.available);

        const response = {
            status: isHealthy ? "healthy" : "degraded",
            timestamp: new Date().toISOString(),
            latency: totalLatency,
            services: {
                database: {
                    status: dbHealth.available ? "up" : "down",
                    latency: dbHealth.latency,
                    error: dbHealth.error,
                },
                ai: {
                    groq: {
                        status: aiHealth.groq.available ? "up" : "down",
                        latency: aiHealth.groq.latency,
                        error: aiHealth.groq.error,
                        configured: !!process.env.GROQ_API_KEY,
                    },
                    openai: {
                        status: aiHealth.openai.available ? "up" : "down",
                        latency: aiHealth.openai.latency,
                        error: aiHealth.openai.error,
                        configured: !!process.env.OPENAI_API_KEY,
                    },
                },
                authentication: {
                    configured: hasAuth(),
                    provider: "clerk",
                },
            },
            configuration: {
                aiServiceAvailable: hasAIService(),
                authenticationEnabled: hasAuth(),
                environment: process.env.NODE_ENV,
            },
        };

        return NextResponse.json(response, {
            status: isHealthy ? 200 : 503,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "error",
                timestamp: new Date().toISOString(),
                error: error.message || "Health check failed",
            },
            { status: 500 }
        );
    }
}
