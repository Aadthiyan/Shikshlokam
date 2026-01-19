/**
 * Dashboard Analytics API Route
 * GET /api/dashboard - Get analytics data for dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range") || "all";

        // Calculate date filter based on range
        let dateFilter = {};
        if (range === "7d") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            dateFilter = { createdAt: { gte: sevenDaysAgo } };
        } else if (range === "30d") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = { createdAt: { gte: thirtyDaysAgo } };
        }

        // Fetch all needs with cluster info
        const needs = await prisma.needSignal.findMany({
            where: dateFilter,
            include: {
                cluster: true,
            },
        });

        // Fetch cohorts and plans for trends
        const cohorts = await prisma.cohort.findMany({
            where: dateFilter,
        });

        const plans = await prisma.plan.findMany({
            where: dateFilter,
        });

        // Process data for charts

        // 1. Needs by District
        const districtCounts: Record<string, number> = {};
        needs.forEach((need) => {
            const district = need.cluster?.district || "Unknown";
            districtCounts[district] = (districtCounts[district] || 0) + 1;
        });
        const needsByDistrict = Object.entries(districtCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // 2. Needs by Issue
        const issueCounts: Record<string, number> = {};
        needs.forEach((need) => {
            need.issueTags.forEach((issue: string) => {
                issueCounts[issue] = (issueCounts[issue] || 0) + 1;
            });
        });
        const needsByIssue = Object.entries(issueCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // 3. Needs by Grade
        const gradeCounts: Record<string, number> = {};
        needs.forEach((need) => {
            need.grades.forEach((grade: string) => {
                const gradeName = grade.replace(/_/g, " ");
                gradeCounts[gradeName] = (gradeCounts[gradeName] || 0) + 1;
            });
        });
        const needsByGrade = Object.entries(gradeCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // 4. Infrastructure Breakdown
        const infraCounts: Record<string, number> = {};
        needs.forEach((need) => {
            const level = need.cluster?.infrastructureLevel || "Unknown";
            infraCounts[level] = (infraCounts[level] || 0) + 1;
        });
        const infrastructureBreakdown = Object.entries(infraCounts)
            .map(([name, value]) => ({ name, value }));

        // 5. Trends Over Time (last 7 days)
        const trendsOverTime = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));

            const needsCount = needs.filter(
                (n) => n.createdAt >= dayStart && n.createdAt <= dayEnd
            ).length;
            const cohortsCount = cohorts.filter(
                (c) => c.createdAt >= dayStart && c.createdAt <= dayEnd
            ).length;
            const plansCount = plans.filter(
                (p) => p.createdAt >= dayStart && p.createdAt <= dayEnd
            ).length;

            trendsOverTime.push({
                date: dateStr,
                needs: needsCount,
                cohorts: cohortsCount,
                plans: plansCount,
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                needsByDistrict,
                needsByIssue,
                needsByGrade,
                infrastructureBreakdown,
                trendsOverTime,
            },
        });
    } catch (error: any) {
        console.error("[API] Error fetching dashboard data:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch dashboard data",
            },
            { status: 500 }
        );
    }
}
