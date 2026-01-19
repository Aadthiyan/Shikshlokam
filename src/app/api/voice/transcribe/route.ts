/**
 * Voice Transcription API Route
 * POST /api/voice/transcribe - Transcribe audio to text using local Whisper
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
    let tempAudioPath: string | null = null;

    try {
        // Get audio file from form data
        const formData = await request.formData();
        const audioFile = formData.get("audio") as File;
        const language = (formData.get("language") as string) || "hi"; // Default to Hindi

        if (!audioFile) {
            return NextResponse.json(
                { success: false, error: "No audio file provided" },
                { status: 400 }
            );
        }

        // Save audio file temporarily
        const bytes = await audioFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const tempDir = join(process.cwd(), "temp");
        tempAudioPath = join(tempDir, `audio-${Date.now()}.webm`);

        // Create temp directory if it doesn't exist
        try {
            await writeFile(tempAudioPath, buffer);
        } catch (error) {
            // Try to create temp directory
            const { mkdir } = await import("fs/promises");
            await mkdir(tempDir, { recursive: true });
            await writeFile(tempAudioPath, buffer);
        }

        console.log(`[Voice] Transcribing audio: ${tempAudioPath}`);

        // Call Python Whisper service
        const pythonScript = join(process.cwd(), "scripts", "whisper_service.py");
        const command = `python "${pythonScript}" "${tempAudioPath}" "${language}"`;

        const { stdout, stderr } = await execAsync(command, {
            maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        });

        if (stderr) {
            console.log(`[Voice] Whisper stderr: ${stderr}`);
        }

        console.log(`[Voice] Whisper stdout:`, stdout);

        // Parse result
        const result = JSON.parse(stdout);

        // Clean up temp file
        if (tempAudioPath) {
            await unlink(tempAudioPath).catch(() => { });
        }

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        console.log(`[Voice] Transcription: ${result.text}`);

        // Extract need data from transcription using AI
        const needData = await extractNeedFromText(result.text);

        return NextResponse.json({
            success: true,
            transcription: result.text,
            language: result.language,
            needData: needData,
        });
    } catch (error: any) {
        console.error("[Voice] Transcription error:", error);

        // Clean up temp file
        if (tempAudioPath) {
            await unlink(tempAudioPath).catch(() => { });
        }

        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to transcribe audio",
            },
            { status: 500 }
        );
    }
}

// Extract need data from transcribed text
async function extractNeedFromText(text: string): Promise<any> {
    const groq = require("groq-sdk");
    const groqClient = new groq.Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `Extract training need information from this transcribed voice message and return ONLY valid JSON:

Transcription: "${text}"

Extract and return JSON with these fields:
{
  "clusterName": "cluster name if mentioned, else 'Unknown'",
  "primaryIssue": "one of: FLN_gaps, language_mismatch, special_needs, low_infrastructure, assessment_gaps, classroom_management, digital_literacy",
  "gradeBand": "one of: PRIMARY_1_3, PRIMARY_4_5, UPPER_PRIMARY_6_8, SECONDARY_9_10, HIGHER_SECONDARY_11_12, ALL",
  "subjects": ["array of subjects mentioned: Math, Science, English, Hindi, Social_Studies, etc. If no specific subjects mentioned, use ['ALL']"],
  "language": "language mentioned (Hindi, English, Santhali, etc.) or 'Hindi'",
  "infrastructureLevel": "one of: LOW, MEDIUM, HIGH",
  "studentCount": number or 0,
  "description": "brief description of the need"
}

Important: If the user doesn't mention specific subjects, set subjects to ["ALL"].

Return ONLY the JSON object, no other text.`;

    try {
        const response = await groqClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
        });

        const content = response.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("No JSON found in response");
    } catch (error) {
        console.error("AI extraction error:", error);
        return {
            clusterName: "Voice Report",
            primaryIssue: "FLN_gaps",
            gradeBand: "PRIMARY_1_3",
            subjects: ["ALL"],
            language: "Hindi",
            infrastructureLevel: "LOW",
            studentCount: 0,
            description: text,
        };
    }
}
