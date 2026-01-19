/**
 * Comprehensive Report Export Service
 * Generates detailed reports with plan, feedback, and analytics
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ComprehensiveReportData {
    plan: {
        id: string;
        name: string;
        description: string;
        sessionCount: number;
        totalDurationMinutes: number;
        status: string;
        createdAt: string;
        publishedAt?: string;
    };
    cohort: {
        name: string;
        primaryIssues: string[];
        language: string;
        teacherCountEstimate: number;
        infrastructureLevel: string;
        gradeBand?: string;
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
        feedbacks: Array<{
            relevanceScore: number;
            confidenceScore: number;
            comments: string | null;
            unresolvedIssues: string[];
            createdAt: string;
        }>;
    }>;
    analytics: {
        avgRelevance: number;
        avgConfidence: number;
        totalFeedback: number;
        unresolvedIssues: string[];
    };
    createdBy: {
        name: string;
    };
}

export class ComprehensiveReportService {
    /**
     * Generate comprehensive PDF report
     */
    static generateComprehensiveReport(data: ComprehensiveReportData): jsPDF {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPosition = 20;

        // Cover Page
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Training Plan Report", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 15;

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        const planNameLines = doc.splitTextToSize(data.plan.name, pageWidth - 40);
        doc.text(planNameLines, pageWidth / 2, yPosition, { align: "center" });
        yPosition += planNameLines.length * 7 + 20;

        // Cohort Information
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Cohort Profile", 20, yPosition);
        yPosition += 10;

        autoTable(doc, {
            startY: yPosition,
            head: [["Attribute", "Value"]],
            body: [
                ["Cohort Name", data.cohort.name],
                ["Primary Issues", data.cohort.primaryIssues.join(", ")],
                ["Language", data.cohort.language],
                ["Teachers", data.cohort.teacherCountEstimate.toString()],
                ["Infrastructure", data.cohort.infrastructureLevel],
                ["Grade Band", data.cohort.gradeBand || "N/A"],
            ],
            theme: "grid",
            headStyles: { fillColor: [41, 128, 185] },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;

        // Plan Summary
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Plan Summary", 20, yPosition);
        yPosition += 10;

        autoTable(doc, {
            startY: yPosition,
            head: [["Metric", "Value"]],
            body: [
                ["Sessions", data.plan.sessionCount.toString()],
                ["Total Duration", `${data.plan.totalDurationMinutes} minutes`],
                ["Status", data.plan.status],
                ["Created", new Date(data.plan.createdAt).toLocaleDateString()],
                [
                    "Published",
                    data.plan.publishedAt
                        ? new Date(data.plan.publishedAt).toLocaleDateString()
                        : "Not published",
                ],
            ],
            theme: "grid",
            headStyles: { fillColor: [41, 128, 185] },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;

        // Analytics Summary
        if (data.analytics.totalFeedback > 0) {
            if (yPosition > pageHeight - 60) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Performance Analytics", 20, yPosition);
            yPosition += 10;

            autoTable(doc, {
                startY: yPosition,
                head: [["Metric", "Score"]],
                body: [
                    ["Average Relevance", `${data.analytics.avgRelevance.toFixed(2)}/5.00`],
                    ["Average Confidence", `${data.analytics.avgConfidence.toFixed(2)}/5.00`],
                    ["Total Feedback", data.analytics.totalFeedback.toString()],
                    [
                        "Unresolved Issues",
                        data.analytics.unresolvedIssues.length > 0
                            ? data.analytics.unresolvedIssues.join(", ")
                            : "None",
                    ],
                ],
                theme: "grid",
                headStyles: { fillColor: [46, 204, 113] },
            });

            yPosition = (doc as any).lastAutoTable.finalY + 15;
        }

        // Sessions Detail
        doc.addPage();
        yPosition = 20;

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Training Sessions", 20, yPosition);
        yPosition += 15;

        data.sessions.forEach((session) => {
            if (yPosition > pageHeight - 100) {
                doc.addPage();
                yPosition = 20;
            }

            // Session Header
            doc.setFillColor(41, 128, 185);
            doc.rect(20, yPosition - 5, pageWidth - 40, 10, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Session ${session.sessionNumber}: ${session.title}`, 25, yPosition + 2);
            doc.setTextColor(0, 0, 0);
            yPosition += 12;

            // Session Details
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`Duration: ${session.durationMinutes} minutes`, 25, yPosition);
            yPosition += 5;
            doc.text(`Theme: ${session.module.theme}`, 25, yPosition);
            yPosition += 8;

            // Objectives
            doc.setFont("helvetica", "bold");
            doc.text("Learning Objectives:", 25, yPosition);
            yPosition += 5;
            doc.setFont("helvetica", "normal");

            session.objectives.forEach((obj) => {
                const objLines = doc.splitTextToSize(`• ${obj}`, pageWidth - 50);
                doc.text(objLines, 30, yPosition);
                yPosition += objLines.length * 4 + 1;
            });

            yPosition += 3;

            // Feedback Summary
            if (session.feedbacks.length > 0) {
                const avgRel =
                    session.feedbacks.reduce((sum, f) => sum + f.relevanceScore, 0) /
                    session.feedbacks.length;
                const avgConf =
                    session.feedbacks.reduce((sum, f) => sum + f.confidenceScore, 0) /
                    session.feedbacks.length;

                doc.setFont("helvetica", "bold");
                doc.text("Feedback Summary:", 25, yPosition);
                yPosition += 5;
                doc.setFont("helvetica", "normal");
                doc.text(
                    `Avg Relevance: ${avgRel.toFixed(1)}/5 | Avg Confidence: ${avgConf.toFixed(1)}/5 | Responses: ${session.feedbacks.length}`,
                    30,
                    yPosition
                );
                yPosition += 8;
            }
        });

        // Footer on all pages
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(128, 128, 128);

            const footerText = `Generated on ${new Date().toLocaleDateString("en-IN")} | DIET Training OS`;
            doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, {
                align: "right",
            });
        }

        return doc;
    }

    /**
     * Download comprehensive report
     */
    static downloadComprehensiveReport(data: ComprehensiveReportData, filename?: string): void {
        const doc = this.generateComprehensiveReport(data);
        const fileName =
            filename ||
            `comprehensive-report-${data.plan.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
        doc.save(fileName);
    }

    /**
     * Get estimated file size
     */
    static getEstimatedSize(data: ComprehensiveReportData): string {
        const baseSize = 80; // KB
        const sessionSize = data.plan.sessionCount * 15; // KB per session
        const feedbackSize = data.analytics.totalFeedback * 5; // KB per feedback
        const totalKB = baseSize + sessionSize + feedbackSize;

        if (totalKB < 1024) {
            return `${totalKB} KB`;
        } else {
            return `${(totalKB / 1024).toFixed(1)} MB`;
        }
    }
}
