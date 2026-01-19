/**
 * AI Training Assistant API Route
 * POST /api/ai-assistant - Chat with AI assistant
 */

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert AI Training Assistant for DIET (District Institute of Education and Training) in India. You help education planners create effective teacher training programs.

Your expertise includes:
- NEP 2020 (National Education Policy)
- NISHTHA FLN (Foundational Literacy and Numeracy)
- Teacher training pedagogy
- Classroom management
- Low-resource teaching strategies
- Multilingual education
- Inclusive education
- Assessment techniques

Guidelines:
- Be helpful, practical, and specific
- Reference Indian education context
- Suggest actionable strategies
- Consider resource constraints
- Be encouraging and supportive
- Keep responses concise but comprehensive

Answer questions about training plans, pedagogy, best practices, and provide constructive feedback.`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { success: false, error: "Invalid messages format" },
                { status: 400 }
            );
        }

        // Call Groq API
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.filter((m: any) => m.role !== "system"),
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const assistantMessage = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

        return NextResponse.json({
            success: true,
            message: assistantMessage,
        });
    } catch (error: any) {
        console.error("[AI Assistant] Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to get AI response",
            },
            { status: 500 }
        );
    }
}
