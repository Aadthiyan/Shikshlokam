/**
 * Gamification API Route (Fallback Version)
 * GET /api/gamification - Get badges, leaderboard, and user stats
 * 
 * This version works without the new gamification tables
 * Uses existing database tables only
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const { userId: clerkId } = await auth();

        // Get user if authenticated
        let user = null;
        if (clerkId) {
            user = await prisma.user.findUnique({
                where: { clerkId }
            });
        }

        // Fetch needs count per user (for leaderboard)
        const needsCounts = await prisma.needSignal.groupBy({
            by: ["reportedBy"],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: 10,
        });

        // Create leaderboard
        const leaderboard = needsCounts.map((entry, index) => ({
            rank: index + 1,
            name: entry.reportedBy || "Anonymous",
            needsReported: entry._count.id,
            points: entry._count.id * 10, // 10 points per need
            badges: Math.min(Math.floor(entry._count.id / 5), 8), // 1 badge per 5 needs
            district: "Various",
        }));

        // Get user's actual stats if logged in
        let userNeedsCount = 0;
        let userCohortsCount = 0;
        let userPlansCount = 0;

        if (user) {
            [userNeedsCount, userCohortsCount, userPlansCount] = await Promise.all([
                prisma.needSignal.count({ where: { userId: user.id } }),
                prisma.cohort.count({ where: { createdById: user.id } }),
                prisma.plan.count({ where: { createdById: user.id } }),
            ]);
        }

        const userPoints = (userNeedsCount * 10) + (userCohortsCount * 25) + (userPlansCount * 50);

        // Define badges with real progress
        const badges = [
            {
                id: "first-need",
                name: "First Steps",
                description: "Report your first classroom need",
                icon: "🎯",
                earned: userNeedsCount >= 1,
                progress: userNeedsCount,
                requirement: 1,
            },
            {
                id: "need-reporter-5",
                name: "Active Reporter",
                description: "Report 5 classroom needs",
                icon: "📝",
                earned: userNeedsCount >= 5,
                progress: userNeedsCount,
                requirement: 5,
            },
            {
                id: "need-reporter-10",
                name: "Super Reporter",
                description: "Report 10 classroom needs",
                icon: "⭐",
                earned: userNeedsCount >= 10,
                progress: userNeedsCount,
                requirement: 10,
            },
            {
                id: "need-reporter-25",
                name: "Champion Reporter",
                description: "Report 25 classroom needs",
                icon: "🏆",
                earned: userNeedsCount >= 25,
                progress: userNeedsCount,
                requirement: 25,
            },
            {
                id: "cohort-creator",
                name: "Cohort Creator",
                description: "Create your first cohort",
                icon: "👥",
                earned: userCohortsCount >= 1,
                progress: userCohortsCount,
                requirement: 1,
            },
            {
                id: "plan-generator",
                name: "Plan Generator",
                description: "Generate your first training plan",
                icon: "📋",
                earned: userPlansCount >= 1,
                progress: userPlansCount,
                requirement: 1,
            },
            {
                id: "weekly-streak",
                name: "Weekly Warrior",
                description: "Maintain a 7-day login streak",
                icon: "🔥",
                earned: false,
                progress: 0,
                requirement: 7,
            },
            {
                id: "monthly-streak",
                name: "Monthly Master",
                description: "Maintain a 30-day login streak",
                icon: "💎",
                earned: false,
                progress: 0,
                requirement: 30,
            },
        ];

        // Find user's rank
        const userRank = user
            ? leaderboard.findIndex(entry => entry.name === user.name) + 1
            : 0;

        // User stats
        const userStats = {
            rank: userRank || leaderboard.length + 1,
            points: userPoints,
            needsReported: userNeedsCount,
            badgesEarned: badges.filter(b => b.earned).length,
        };

        return NextResponse.json({
            success: true,
            badges,
            leaderboard,
            userStats,
            streak: {
                current: 0,
                longest: 0,
                lastActive: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        console.error("[API] Error fetching gamification data:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch gamification data",
            },
            { status: 500 }
        );
    }
}
