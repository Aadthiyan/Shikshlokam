/**
 * Plan Export API Route
 * GET /api/plans/[id]/export - Export plan as PDF (original)
 * POST /api/plans/[id]/export - Export plan as PDF (with custom data, e.g. translated)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFExportService } from "@/services/export.service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch plan with all details
        const plan = await prisma.plan.findUnique({
            where: { id },
            include: {
                cohort: {
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
                },
                sessions: {
                    include: {
                        module: true,
                    },
                    orderBy: {
                        orderIndex: "asc",
                    },
                },
                createdBy: true,
            },
        });

        if (!plan) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Plan not found",
                },
                { status: 404 }
            );
        }

        // Generate PDF
        const pdfBlob = PDFExportService.getPDFBlob(plan as any);
        const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

        // Return PDF
        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="training-plan-${plan.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
            },
        });
    } catch (error: any) {
        console.error("[API] Error exporting plan:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to export plan",
            },
            { status: 500 }
        );
    }
}

// POST handler for exporting custom plan data (e.g., translated)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { planData } = body;

        if (!planData) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No plan data provided",
                },
                { status: 400 }
            );
        }

        // Generate PDF from provided plan data
        const pdfBlob = PDFExportService.getPDFBlob(planData);
        const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

        // Create ASCII-safe filename (avoid Unicode characters in HTTP headers)
        const safeFilename = `training-plan-${id}.pdf`;

        // Return PDF
        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${safeFilename}"`,
            },
        });
    } catch (error: any) {
        console.error("[API] Error exporting plan:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to export plan",
            },
            { status: 500 }
        );
    }
}
