/**
 * PDF Export Service
 * Generates professional PDF documents from training plans
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PlanData {
    name: string;
    description: string;
    sessionCount: number;
    totalDurationMinutes: number;
    status: string;
    createdAt: string;
    publishedAt?: string;
    cohort: {
        name: string;
        primaryIssues: string[];
        language: string;
        teacherCountEstimate: number;
        infrastructureLevel: string;
    };
    sessions: Array<{
        sessionNumber: number;
        title: string;
        objectives: string[];
        trainerNotes: string;
        durationMinutes: number;
        module: {
            title: string;
            theme: string;
            competencyTags: string[];
        };
    }>;
    createdBy: {
        name: string;
    };
}

export class PDFExportService {
    /**
     * Generate PDF from plan data
     */
    static generatePDF(plan: PlanData): jsPDF {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPosition = 20;

        // Header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Training Plan", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 10;

        // Plan Name
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        const planNameLines = doc.splitTextToSize(plan.name, pageWidth - 40);
        doc.text(planNameLines, pageWidth / 2, yPosition, { align: "center" });
        yPosition += planNameLines.length * 7 + 5;

        // Description
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(plan.description, pageWidth - 40);
        doc.text(descLines, pageWidth / 2, yPosition, { align: "center" });
        yPosition += descLines.length * 5 + 10;

        // Plan Summary Table
        autoTable(doc, {
            startY: yPosition,
            head: [["Plan Summary", ""]],
            body: [
                ["Sessions", plan.sessionCount.toString()],
                ["Total Duration", `${plan.totalDurationMinutes} minutes`],
                ["Status", plan.status],
                ["Language", plan.cohort.language],
                ["Teachers", plan.cohort.teacherCountEstimate.toString()],
                ["Infrastructure", plan.cohort.infrastructureLevel],
            ],
            theme: "grid",
            headStyles: { fillColor: [41, 128, 185], fontStyle: "bold" },
            styles: { fontSize: 10 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;

        // Cohort Context
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Cohort Context", 20, yPosition);
        yPosition += 7;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Cohort: ${plan.cohort.name}`, 20, yPosition);
        yPosition += 5;

        doc.text(
            `Primary Issues: ${plan.cohort.primaryIssues.map((i) => i.replace(/_/g, " ")).join(", ")}`,
            20,
            yPosition
        );
        yPosition += 10;

        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
        }

        // Sessions
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Training Sessions", 20, yPosition);
        yPosition += 10;

        plan.sessions.forEach((session, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 80) {
                doc.addPage();
                yPosition = 20;
            }

            // Session Header
            doc.setFillColor(41, 128, 185);
            doc.rect(20, yPosition - 5, pageWidth - 40, 10, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(
                `Session ${session.sessionNumber}: ${session.title}`,
                25,
                yPosition + 2
            );
            doc.setTextColor(0, 0, 0);
            yPosition += 12;

            // Session Details
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`Duration: ${session.durationMinutes} minutes`, 25, yPosition);
            yPosition += 5;
            doc.text(`Theme: ${session.module.theme}`, 25, yPosition);
            yPosition += 5;
            doc.text(
                `Competencies: ${session.module.competencyTags.map((t) => t.replace(/_/g, " ")).join(", ")}`,
                25,
                yPosition
            );
            yPosition += 8;

            // Learning Objectives
            doc.setFont("helvetica", "bold");
            doc.text("Learning Objectives:", 25, yPosition);
            yPosition += 5;
            doc.setFont("helvetica", "normal");

            session.objectives.forEach((obj, idx) => {
                const objLines = doc.splitTextToSize(`• ${obj}`, pageWidth - 50);
                doc.text(objLines, 30, yPosition);
                yPosition += objLines.length * 4 + 1;
            });

            yPosition += 3;

            // Trainer Notes
            doc.setFont("helvetica", "bold");
            doc.text("Trainer Notes:", 25, yPosition);
            yPosition += 5;
            doc.setFont("helvetica", "normal");

            const notesLines = doc.splitTextToSize(session.trainerNotes, pageWidth - 50);
            doc.text(notesLines, 30, yPosition);
            yPosition += notesLines.length * 4 + 8;
        });

        // Footer on last page
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(128, 128, 128);

            // Footer text
            const footerText = `Generated on ${new Date().toLocaleDateString("en-IN")} | Created by ${plan.createdBy.name}`;
            doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });

            // Page number
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, {
                align: "right",
            });
        }

        return doc;
    }

    /**
     * Download PDF
     */
    static downloadPDF(plan: PlanData, filename?: string): void {
        const doc = this.generatePDF(plan);
        const fileName = filename || `training-plan-${plan.cohort.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
        doc.save(fileName);
    }

    /**
     * Get PDF as blob (for preview or upload)
     */
    static getPDFBlob(plan: PlanData): Blob {
        const doc = this.generatePDF(plan);
        return doc.output("blob");
    }

    /**
     * Get estimated file size
     */
    static getEstimatedSize(plan: PlanData): string {
        // Rough estimate: ~50KB base + ~10KB per session
        const estimatedKB = 50 + plan.sessionCount * 10;
        if (estimatedKB < 1024) {
            return `${estimatedKB} KB`;
        } else {
            return `${(estimatedKB / 1024).toFixed(1)} MB`;
        }
    }
}
