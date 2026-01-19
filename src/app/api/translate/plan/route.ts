/**
 * Translation API Route
 * POST /api/translate/plan - Translate training plan to regional language
 */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { writeFile, unlink, mkdir } from "fs/promises";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
    let tempFilePath: string | null = null;

    try {
        const body = await request.json();
        const { planData, language = "hi" } = body;

        if (!planData) {
            return NextResponse.json(
                { success: false, error: "No plan data provided" },
                { status: 400 }
            );
        }

        console.log(`[Translation] Translating plan to ${language}...`);

        // Create temp directory if it doesn't exist
        const tempDir = join(process.cwd(), "temp");
        try {
            await mkdir(tempDir, { recursive: true });
        } catch (error) {
            // Directory might already exist, ignore
        }

        // Write plan data to temporary file
        tempFilePath = join(tempDir, `plan-${Date.now()}.json`);
        await writeFile(tempFilePath, JSON.stringify(planData), "utf-8");

        // Call Python translation service with file path
        const pythonScript = join(process.cwd(), "scripts", "translation_service.py");
        const command = `python "${pythonScript}" "${tempFilePath}" "${language}"`;

        const { stdout, stderr } = await execAsync(command, {
            maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        });

        // Clean up temp file
        if (tempFilePath) {
            await unlink(tempFilePath).catch(() => { });
        }

        if (stderr) {
            console.log(`[Translation] stderr: ${stderr}`);
        }

        // Parse result
        const result = JSON.parse(stdout);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        console.log(`[Translation] Successfully translated to ${language}`);

        return NextResponse.json({
            success: true,
            data: result.data,
            language: result.language,
        });
    } catch (error: any) {
        console.error("[Translation] Error:", error);

        // Clean up temp file
        if (tempFilePath) {
            await unlink(tempFilePath).catch(() => { });
        }

        return NextResponse.json(
            {
                success: false,
                error: error.message || "Translation failed",
            },
            { status: 500 }
        );
    }
}
