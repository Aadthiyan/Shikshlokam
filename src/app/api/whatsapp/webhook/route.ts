/**
 * WhatsApp Webhook API Route
 * POST /api/whatsapp/webhook - Receive WhatsApp messages from Twilio
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import twilio from "twilio";

// AI service for extracting need data from message
async function extractNeedFromMessage(message: string): Promise<any> {
    // Use Groq AI to extract structured data from WhatsApp message
    const groq = require("groq-sdk");
    const groqClient = new groq.Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `Extract training need information from this WhatsApp message and return ONLY valid JSON:

Message: "${message}"

Extract and return JSON with these fields:
{
  "clusterName": "cluster name if mentioned, else 'Unknown'",
  "primaryIssue": "one of: FLN_gaps, language_mismatch, special_needs, low_infrastructure, assessment_gaps, classroom_management, digital_literacy",
  "gradeBand": "one of: PRIMARY_1_3, PRIMARY_4_5, UPPER_PRIMARY_6_8, SECONDARY_9_10, HIGHER_SECONDARY_11_12, ALL",
  "language": "language mentioned (Hindi, English, Santhali, etc.) or 'Hindi'",
  "infrastructureLevel": "one of: LOW, MEDIUM, HIGH",
  "studentCount": number or 0,
  "description": "brief description of the need"
}

Return ONLY the JSON object, no other text.`;

    try {
        const response = await groqClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
        });

        const content = response.choices[0].message.content;
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("No JSON found in response");
    } catch (error) {
        console.error("AI extraction error:", error);
        // Fallback: basic extraction
        return {
            clusterName: "WhatsApp Report",
            primaryIssue: "FLN_gaps",
            gradeBand: "PRIMARY_1_3",
            language: "Hindi",
            infrastructureLevel: "LOW",
            studentCount: 0,
            description: message,
        };
    }
}

// Send WhatsApp message via Twilio
async function sendWhatsAppMessage(to: string, message: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

    if (!accountSid || !authToken || !fromNumber) {
        console.warn("Twilio credentials not configured");
        return;
    }

    try {
        const client = twilio(accountSid, authToken);
        await client.messages.create({
            from: fromNumber,
            to: to,
            body: message,
        });
    } catch (error) {
        console.error("Failed to send WhatsApp message:", error);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Parse Twilio webhook data
        const formData = await request.formData();
        const from = formData.get("From") as string; // whatsapp:+919876543210
        const body = formData.get("Body") as string; // Message text

        console.log(`[WhatsApp] Received message from ${from}: ${body}`);

        // Extract need data using AI
        const needData = await extractNeedFromMessage(body);

        // Get or create demo user
        const user = await prisma.user.upsert({
            where: { email: "whatsapp@diet-training.gov.in" },
            update: {},
            create: {
                clerkId: "whatsapp_user",
                email: "whatsapp@diet-training.gov.in",
                name: "WhatsApp Reporter",
                role: "BRP",
            },
        });

        // Find or create cluster
        let cluster = await prisma.cluster.findFirst({
            where: { name: { contains: needData.clusterName } },
        });

        if (!cluster) {
            // Create new cluster
            cluster = await prisma.cluster.create({
                data: {
                    name: needData.clusterName,
                    district: "Unknown",
                    block: "Unknown",
                    state: "Unknown",
                    primaryLanguage: needData.language,
                    infrastructureLevel: needData.infrastructureLevel,
                    schoolsCount: 1,
                    teacherCountEstimate: 10,
                    studentCountEstimate: needData.studentCount || 100,
                },
            });
        }

        // Create need
        const need = await prisma.needSignal.create({
            data: {
                clusterId: cluster.id,
                userId: user.id,
                grades: [needData.gradeBand || "PRIMARY_1_3"],
                subjects: ["General"],
                issueTags: [needData.primaryIssue || "FLN_gaps"],
                notes: needData.description || body,
                reportedBy: "WhatsApp Reporter",
            },
        });

        console.log(`[WhatsApp] Created need: ${need.id}`);

        // Send confirmation message
        const confirmationMessage = `✅ Need registered successfully!

ID: ${need.id}
Cluster: ${cluster.name}
Issue: ${needData.primaryIssue.replace(/_/g, " ")}
Grade: ${needData.gradeBand.replace(/_/g, " ")}

Your need has been recorded and will be processed for cohort generation.

Thank you for reporting!`;

        await sendWhatsAppMessage(from, confirmationMessage);

        return NextResponse.json({
            success: true,
            needId: need.id,
            message: "Need created from WhatsApp",
        });
    } catch (error: any) {
        console.error("[WhatsApp] Error processing message:", error);

        // Try to send error message
        try {
            const formData = await request.formData();
            const from = formData.get("From") as string;
            await sendWhatsAppMessage(
                from,
                "❌ Sorry, there was an error processing your request. Please try again or contact support."
            );
        } catch (e) {
            console.error("Failed to send error message:", e);
        }

        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
