/**
 * Database Statistics API Route
 * GET /api/stats
 */

import { NextResponse } from "next/server";
import { DatabaseService } from "@/services/database.service";

export async function GET() {
    try {
        const stats = await DatabaseService.getStats();

        return NextResponse.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch statistics",
            },
            { status: 500 }
        );
    }
}
