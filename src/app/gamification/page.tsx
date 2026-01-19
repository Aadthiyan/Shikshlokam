"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    progress?: number;
    requirement?: number;
    earnedDate?: string;
}

interface LeaderboardEntry {
    rank: number;
    name: string;
    needsReported: number;
    points: number;
    badges: number;
    district: string;
    streak?: number;
}

interface Streak {
    current: number;
    longest: number;
    lastActive: string;
}

interface Milestone {
    id: string;
    title: string;
    description: string;
    achieved: boolean;
    date?: string;
}

export default function GamificationPage() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userStats, setUserStats] = useState({
        rank: 0,
        points: 0,
        needsReported: 0,
        badgesEarned: 0,
    });
    const [streak, setStreak] = useState<Streak>({
        current: 7,
        longest: 12,
        lastActive: new Date().toISOString(),
    });
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGamificationData();
        initializeMilestones();
    }, []);

    const fetchGamificationData = async () => {
        try {
            const response = await fetch("/api/gamification");
            const data = await response.json();
            if (data.success) {
                setBadges(data.badges);
                setLeaderboard(data.leaderboard);
                setUserStats(data.userStats);

                // Check for new achievements
                checkForNewAchievements(data.badges);
            }
        } catch (error) {
            console.error("Failed to fetch gamification data:", error);
        } finally {
            setLoading(false);
        }
    };

    const initializeMilestones = () => {
        setMilestones([
            { id: "1", title: "First Need Reported", description: "Report your first training need", achieved: true, date: "2025-12-15" },
            { id: "2", title: "10 Needs Milestone", description: "Report 10 training needs", achieved: true, date: "2026-01-05" },
            { id: "3", title: "Week Streak", description: "Maintain a 7-day login streak", achieved: true, date: "2026-01-10" },
            { id: "4", title: "50 Needs Milestone", description: "Report 50 training needs", achieved: false },
            { id: "5", title: "Month Streak", description: "Maintain a 30-day login streak", achieved: false },
        ]);
    };

    const checkForNewAchievements = (newBadges: Badge[]) => {
        const justEarned = newBadges.find(b => b.earned && !badges.find(ob => ob.id === b.id && ob.earned));
        if (justEarned) {
            celebrateAchievement();
        }
    };

    const celebrateAchievement = () => {
        setShowCelebration(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => setShowCelebration(false), 3000);
    };

    const generateCertificate = () => {
        setShowCertificate(true);
    };

    const downloadCertificate = () => {
        // In a real implementation, this would generate a PDF
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 800, 600);

            // Border
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 10;
            ctx.strokeRect(20, 20, 760, 560);

            // Title
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Certificate of Achievement', 400, 100);

            // Content
            ctx.font = '24px Arial';
            ctx.fillText('This certifies that', 400, 200);

            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = '#0066cc';
            ctx.fillText('Outstanding BRP', 400, 260);

            ctx.font = '24px Arial';
            ctx.fillStyle = '#000000';
            ctx.fillText(`has earned ${userStats.badgesEarned} badges`, 400, 320);
            ctx.fillText(`and ${userStats.points} points`, 400, 360);

            ctx.font = '18px Arial';
            ctx.fillText(`Rank: ${getRankMedal(userStats.rank)} | Needs Reported: ${userStats.needsReported}`, 400, 420);

            ctx.font = '16px Arial';
            ctx.fillStyle = '#666666';
            ctx.fillText(new Date().toLocaleDateString(), 400, 500);

            // Download
            const link = document.createElement('a');
            link.download = 'achievement-certificate.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const shareAchievement = (badge: Badge) => {
        setSelectedBadge(badge);
        setShowShareModal(true);
    };

    const shareToWhatsApp = () => {
        const text = `🎉 I just earned the "${selectedBadge?.name}" badge on DIET Training OS! ${selectedBadge?.description}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToTwitter = () => {
        const text = `🎉 I just earned the "${selectedBadge?.name}" badge on DIET Training OS! #TeacherTraining #Achievement`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    const copyShareLink = () => {
        const link = `${window.location.origin}/achievements/${selectedBadge?.id}`;
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };

    const getBadgeColor = (earned: boolean) => {
        return earned ? "from-yellow-400 to-yellow-600" : "from-gray-300 to-gray-400";
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return "text-yellow-500";
        if (rank === 2) return "text-gray-400";
        if (rank === 3) return "text-orange-600";
        return "text-muted-foreground";
    };

    const getRankMedal = (rank: number) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    const getStreakColor = (current: number) => {
        if (current >= 30) return "text-red-500";
        if (current >= 14) return "text-orange-500";
        if (current >= 7) return "text-yellow-500";
        return "text-blue-500";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-7xl">
                {/* Celebration Modal */}
                {showCelebration && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="rounded-lg bg-white p-8 text-center shadow-2xl dark:bg-gray-800">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold mb-2">New Achievement!</h2>
                            <p className="text-muted-foreground">You've earned a new badge!</p>
                        </div>
                    </div>
                )}

                {/* Certificate Modal */}
                {showCertificate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="rounded-lg bg-white p-8 max-w-2xl w-full shadow-2xl dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Your Certificate</h2>
                                <button onClick={() => setShowCertificate(false)} className="text-2xl">×</button>
                            </div>
                            <div className="border-4 border-yellow-500 p-8 text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                                <h3 className="text-3xl font-bold mb-4">Certificate of Achievement</h3>
                                <p className="text-lg mb-2">This certifies that</p>
                                <p className="text-2xl font-bold text-primary mb-4">Outstanding BRP</p>
                                <p className="mb-2">has earned <strong>{userStats.badgesEarned}</strong> badges</p>
                                <p className="mb-2">and <strong>{userStats.points}</strong> points</p>
                                <p className="text-sm text-muted-foreground mt-6">
                                    Rank: {getRankMedal(userStats.rank)} | Needs Reported: {userStats.needsReported}
                                </p>
                                <p className="text-xs text-muted-foreground mt-4">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={downloadCertificate}
                                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    Download Certificate
                                </button>
                                <button
                                    onClick={() => setShowCertificate(false)}
                                    className="flex-1 rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Share Modal */}
                {showShareModal && selectedBadge && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="rounded-lg bg-white p-8 max-w-md w-full shadow-2xl dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Share Achievement</h2>
                                <button onClick={() => setShowShareModal(false)} className="text-2xl">×</button>
                            </div>
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4">{selectedBadge.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{selectedBadge.name}</h3>
                                <p className="text-muted-foreground">{selectedBadge.description}</p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={shareToWhatsApp}
                                    className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600"
                                >
                                    Share on WhatsApp
                                </button>
                                <button
                                    onClick={shareToTwitter}
                                    className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600"
                                >
                                    Share on Twitter
                                </button>
                                <button
                                    onClick={copyShareLink}
                                    className="w-full rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Home
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">Achievements & Leaderboard</h1>
                            <p className="text-muted-foreground">
                                Track your progress, compete with BRPs, and earn rewards
                            </p>
                        </div>
                        <button
                            onClick={generateCertificate}
                            className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 font-semibold text-white hover:from-yellow-500 hover:to-orange-600"
                        >
                            🏆 Get Certificate
                        </button>
                    </div>
                </div>

                {/* Streak Tracker */}
                <div className="mb-8 rounded-lg border bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold mb-2">🔥 Your Streak</h2>
                            <p className="text-sm text-muted-foreground">Keep logging in daily to maintain your streak!</p>
                        </div>
                        <div className="text-center">
                            <div className={`text-5xl font-bold ${getStreakColor(streak.current)}`}>
                                {streak.current}
                            </div>
                            <div className="text-sm text-muted-foreground">days</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground">{streak.longest}</div>
                            <div className="text-xs text-muted-foreground">longest</div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 h-2 rounded-full ${i < streak.current ? 'bg-orange-500' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-center text-muted-foreground">
                        {7 - (streak.current % 7)} days until next week bonus (+25 pts)
                    </div>
                </div>

                {/* User Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                        <div className="mb-2 text-sm font-medium text-muted-foreground">Your Rank</div>
                        <div className="text-3xl font-bold text-primary">
                            {getRankMedal(userStats.rank)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            Out of 156 BRPs
                        </div>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-br from-secondary/10 to-secondary/5 p-6">
                        <div className="mb-2 text-sm font-medium text-muted-foreground">Total Points</div>
                        <div className="text-3xl font-bold text-secondary">{userStats.points}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            +50 this week
                        </div>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                        <div className="mb-2 text-sm font-medium text-muted-foreground">Needs Reported</div>
                        <div className="text-3xl font-bold text-accent">{userStats.needsReported}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            +3 this week
                        </div>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-br from-success/10 to-success/5 p-6">
                        <div className="mb-2 text-sm font-medium text-muted-foreground">Badges Earned</div>
                        <div className="text-3xl font-bold text-success">{userStats.badgesEarned}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            {badges.length - userStats.badgesEarned} remaining
                        </div>
                    </div>
                </div>

                {/* Milestones */}
                <div className="mb-8 rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-2xl font-bold">🎯 Milestones</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {milestones.map((milestone) => (
                            <div
                                key={milestone.id}
                                className={`rounded-lg border p-4 ${milestone.achieved
                                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                                        : 'bg-background'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">{milestone.achieved ? '✅' : '⏳'}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm">{milestone.title}</h3>
                                        <p className="text-xs text-muted-foreground">{milestone.description}</p>
                                        {milestone.achieved && milestone.date && (
                                            <p className="text-xs text-success mt-1">Achieved: {new Date(milestone.date).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Badges */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-6 text-2xl font-bold">Achievement Badges</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`rounded-lg border p-4 ${badge.earned
                                                ? "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
                                                : "bg-background"
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getBadgeColor(
                                                    badge.earned
                                                )} text-3xl shadow-lg`}
                                            >
                                                {badge.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h3 className="font-bold">{badge.name}</h3>
                                                    {badge.earned && (
                                                        <span className="rounded-full bg-success px-2 py-0.5 text-xs font-bold text-white">
                                                            EARNED
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mb-2 text-sm text-muted-foreground">{badge.description}</p>
                                                {badge.earned && (
                                                    <button
                                                        onClick={() => shareAchievement(badge)}
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        Share Achievement →
                                                    </button>
                                                )}
                                                {!badge.earned && badge.progress !== undefined && badge.requirement && (
                                                    <div>
                                                        <div className="mb-1 flex justify-between text-xs">
                                                            <span>Progress</span>
                                                            <span>
                                                                {badge.progress}/{badge.requirement}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                                            <div
                                                                className="h-full bg-primary transition-all"
                                                                style={{
                                                                    width: `${(badge.progress / badge.requirement) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div>
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-6 text-2xl font-bold">Top BRPs</h2>
                            <div className="space-y-3">
                                {leaderboard.map((entry) => (
                                    <div
                                        key={entry.rank}
                                        className={`rounded-lg border p-4 ${entry.rank <= 3
                                                ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                                                : "bg-background"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                                                {getRankMedal(entry.rank)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold">{entry.name}</div>
                                                <div className="text-xs text-muted-foreground">{entry.district}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-primary">{entry.points}</div>
                                                <div className="text-xs text-muted-foreground">points</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                                            <span>📝 {entry.needsReported} needs</span>
                                            <span>🏆 {entry.badges} badges</span>
                                            {entry.streak && <span>🔥 {entry.streak} days</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How Points Work */}
                        <div className="mt-6 rounded-lg border bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                            <h3 className="mb-4 font-bold">How to Earn Points</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Report a need</span>
                                    <span className="font-bold text-primary">+10 pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Use voice recording</span>
                                    <span className="font-bold text-primary">+5 pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Complete training</span>
                                    <span className="font-bold text-primary">+20 pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Share feedback</span>
                                    <span className="font-bold text-primary">+15 pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Weekly streak</span>
                                    <span className="font-bold text-primary">+25 pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Monthly streak</span>
                                    <span className="font-bold text-primary">+100 pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
