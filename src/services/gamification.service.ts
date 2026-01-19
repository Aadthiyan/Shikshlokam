/**
 * Gamification Service
 * Handles badge awarding, streak tracking, points calculation, and achievements
 */

import { prisma } from "@/lib/prisma";

// Badge definitions
export const BADGES = {
    "first-need": {
        name: "First Steps",
        description: "Report your first classroom need",
        icon: "🎯",
        requirement: 1,
        checkProgress: async (userId: string) => {
            const count = await prisma.needSignal.count({
                where: { createdById: userId }
            });
            return { progress: count, earned: count >= 1 };
        }
    },
    "need-reporter-5": {
        name: "Active Reporter",
        description: "Report 5 classroom needs",
        icon: "📝",
        requirement: 5,
        checkProgress: async (userId: string) => {
            const count = await prisma.needSignal.count({
                where: { createdById: userId }
            });
            return { progress: count, earned: count >= 5 };
        }
    },
    "need-reporter-10": {
        name: "Super Reporter",
        description: "Report 10 classroom needs",
        icon: "⭐",
        requirement: 10,
        checkProgress: async (userId: string) => {
            const count = await prisma.needSignal.count({
                where: { createdById: userId }
            });
            return { progress: count, earned: count >= 10 };
        }
    },
    "need-reporter-25": {
        name: "Champion Reporter",
        description: "Report 25 classroom needs",
        icon: "🏆",
        requirement: 25,
        checkProgress: async (userId: string) => {
            const count = await prisma.needSignal.count({
                where: { createdById: userId }
            });
            return { progress: count, earned: count >= 25 };
        }
    },
    "cohort-creator": {
        name: "Cohort Creator",
        description: "Create your first cohort",
        icon: "👥",
        requirement: 1,
        checkProgress: async (userId: string) => {
            const count = await prisma.cohort.count({
                where: { createdById: userId }
            });
            return { progress: count, earned: count >= 1 };
        }
    },
    "plan-generator": {
        name: "Plan Generator",
        description: "Generate your first training plan",
        icon: "📋",
        requirement: 1,
        checkProgress: async (userId: string) => {
            const count = await prisma.plan.count({
                where: { createdById: userId }
            });
            return { progress: count, earned: count >= 1 };
        }
    },
    "weekly-streak": {
        name: "Weekly Warrior",
        description: "Maintain a 7-day login streak",
        icon: "🔥",
        requirement: 7,
        checkProgress: async (userId: string) => {
            const streak = await getStreak(userId);
            return { progress: streak.currentStreak, earned: streak.currentStreak >= 7 };
        }
    },
    "monthly-streak": {
        name: "Monthly Master",
        description: "Maintain a 30-day login streak",
        icon: "💎",
        requirement: 30,
        checkProgress: async (userId: string) => {
            const streak = await getStreak(userId);
            return { progress: streak.currentStreak, earned: streak.currentStreak >= 30 };
        }
    },
};

// Points for different actions
export const POINTS = {
    NEED_REPORTED: 10,
    COHORT_CREATED: 25,
    PLAN_GENERATED: 50,
    FEEDBACK_PROVIDED: 5,
    BADGE_EARNED: 20,
    STREAK_DAY: 2,
};

/**
 * Award points to a user for an action
 */
export async function awardPoints(userId: string, action: string, points: number, description?: string) {
    try {
        // Create point record
        await prisma.userPoints.create({
            data: {
                userId,
                action,
                points,
                description,
            }
        });

        // Update user stats
        await updateUserStats(userId);

        return true;
    } catch (error) {
        console.error("Error awarding points:", error);
        return false;
    }
}

/**
 * Check and award badges for a user
 */
export async function checkAndAwardBadges(userId: string) {
    const newBadges = [];

    for (const [badgeId, badge] of Object.entries(BADGES)) {
        // Check if already earned
        const existing = await prisma.userBadge.findUnique({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId
                }
            }
        });

        if (existing) continue;

        // Check progress
        const { earned } = await badge.checkProgress(userId);

        if (earned) {
            // Award badge
            await prisma.userBadge.create({
                data: {
                    userId,
                    badgeId,
                    badgeName: badge.name,
                    badgeIcon: badge.icon,
                }
            });

            // Award points for earning badge
            await awardPoints(userId, "BADGE_EARNED", POINTS.BADGE_EARNED, `Earned badge: ${badge.name}`);

            newBadges.push(badge);
        }
    }

    return newBadges;
}

/**
 * Update user's daily streak
 */
export async function updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await prisma.userStreak.findUnique({
        where: { userId }
    });

    if (!streak) {
        // Create new streak
        streak = await prisma.userStreak.create({
            data: {
                userId,
                currentStreak: 1,
                longestStreak: 1,
                lastActiveDate: today,
            }
        });
    } else {
        const lastActive = new Date(streak.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            // Same day, no update needed
            return streak;
        } else if (daysDiff === 1) {
            // Consecutive day, increment streak
            const newStreak = streak.currentStreak + 1;
            streak = await prisma.userStreak.update({
                where: { userId },
                data: {
                    currentStreak: newStreak,
                    longestStreak: Math.max(newStreak, streak.longestStreak),
                    lastActiveDate: today,
                }
            });

            // Award points for streak
            await awardPoints(userId, "STREAK_DAY", POINTS.STREAK_DAY, `Day ${newStreak} streak`);
        } else {
            // Streak broken, reset
            streak = await prisma.userStreak.update({
                where: { userId },
                data: {
                    currentStreak: 1,
                    lastActiveDate: today,
                }
            });
        }
    }

    // Check for streak badges
    await checkAndAwardBadges(userId);

    return streak;
}

/**
 * Get user's streak
 */
export async function getStreak(userId: string) {
    let streak = await prisma.userStreak.findUnique({
        where: { userId }
    });

    if (!streak) {
        streak = {
            id: "",
            userId,
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    return streak;
}

/**
 * Update user stats summary
 */
export async function updateUserStats(userId: string) {
    // Get counts
    const [needsCount, cohortsCount, plansCount, badgesCount, pointsSum] = await Promise.all([
        prisma.needSignal.count({ where: { createdById: userId } }),
        prisma.cohort.count({ where: { createdById: userId } }),
        prisma.plan.count({ where: { createdById: userId } }),
        prisma.userBadge.count({ where: { userId } }),
        prisma.userPoints.aggregate({
            where: { userId },
            _sum: { points: true }
        })
    ]);

    const totalPoints = pointsSum._sum.points || 0;

    // Upsert stats
    await prisma.userStats.upsert({
        where: { userId },
        create: {
            userId,
            totalPoints,
            needsReported: needsCount,
            cohortsCreated: cohortsCount,
            plansGenerated: plansCount,
            badgesEarned: badgesCount,
            achievementsCount: 0,
        },
        update: {
            totalPoints,
            needsReported: needsCount,
            cohortsCreated: cohortsCount,
            plansGenerated: plansCount,
            badgesEarned: badgesCount,
        }
    });
}

/**
 * Get user's gamification data
 */
export async function getUserGamificationData(userId: string) {
    // Update streak first
    await updateStreak(userId);

    // Get all data
    const [badges, stats, streak, points] = await Promise.all([
        getUserBadges(userId),
        getUserStats(userId),
        getStreak(userId),
        getUserPoints(userId)
    ]);

    return {
        badges,
        stats,
        streak,
        points
    };
}

/**
 * Get user's badges with progress
 */
export async function getUserBadges(userId: string) {
    const earnedBadges = await prisma.userBadge.findMany({
        where: { userId },
        orderBy: { earnedAt: "desc" }
    });

    const badgesWithProgress = await Promise.all(
        Object.entries(BADGES).map(async ([badgeId, badge]) => {
            const earned = earnedBadges.find(b => b.badgeId === badgeId);
            const { progress } = await badge.checkProgress(userId);

            return {
                id: badgeId,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                earned: !!earned,
                progress,
                requirement: badge.requirement,
                earnedDate: earned?.earnedAt.toISOString(),
            };
        })
    );

    return badgesWithProgress;
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string) {
    let stats = await prisma.userStats.findUnique({
        where: { userId }
    });

    if (!stats) {
        await updateUserStats(userId);
        stats = await prisma.userStats.findUnique({
            where: { userId }
        });
    }

    return stats;
}

/**
 * Get user's point history
 */
export async function getUserPoints(userId: string) {
    return await prisma.userPoints.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50
    });
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(limit: number = 10) {
    const topUsers = await prisma.userStats.findMany({
        orderBy: { totalPoints: "desc" },
        take: limit,
    });

    // Get user names
    const leaderboard = await Promise.all(
        topUsers.map(async (stats, index) => {
            const user = await prisma.user.findUnique({
                where: { id: stats.userId },
                select: { name: true, dietName: true }
            });

            return {
                rank: index + 1,
                name: user?.name || "Anonymous",
                district: user?.dietName || "Unknown",
                needsReported: stats.needsReported,
                points: stats.totalPoints,
                badges: stats.badgesEarned,
            };
        })
    );

    return leaderboard;
}
