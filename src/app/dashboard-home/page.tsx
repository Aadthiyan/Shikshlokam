"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

interface PlatformStats {
    needsReported: number;
    cohortsCreated: number;
    plansGenerated: number;
    teachersImpacted: number;
    clustersActive: number;
}

export default function DashboardHome() {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/stats");
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header with User Button */}
            <header className="border-b bg-card">
                <div className="mx-auto max-w-7xl px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-foreground">DIET Training OS</h2>
                        </div>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-10 w-10"
                                }
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="border-b bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mx-auto max-w-7xl px-8 py-16">
                    <div className="text-center">
                        <h1 className="mb-4 text-5xl font-bold text-foreground">
                            DIET Training OS
                        </h1>
                        <p className="mb-8 text-xl text-muted-foreground">
                            Personalized Teacher Training Design Platform
                        </p>
                        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                            AI-powered platform for DIETs and SCERTs to create contextualized, micro-learning-based
                            teacher training plans aligned with NEP 2020
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="/needs/new"
                                className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                Report Classroom Needs
                            </Link>
                            <Link
                                href="/health"
                                className="rounded-lg border border-input px-8 py-3 font-semibold hover:bg-muted"
                            >
                                System Health
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="border-b bg-gradient-to-br from-success/5 to-accent/5">
                <div className="mx-auto max-w-7xl px-8 py-12">
                    <h2 className="mb-8 text-center text-2xl font-bold">Platform Impact</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-lg">
                            <div className="mb-2 text-4xl font-bold text-primary">
                                {loading ? "..." : stats?.needsReported || 0}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">Needs Reported</div>
                            <div className="mt-2 text-xs text-muted-foreground">From BRPs & CRPs</div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-lg">
                            <div className="mb-2 text-4xl font-bold text-secondary">
                                {loading ? "..." : stats?.cohortsCreated || 0}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">Cohorts Created</div>
                            <div className="mt-2 text-xs text-muted-foreground">AI-grouped training cohorts</div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-lg">
                            <div className="mb-2 text-4xl font-bold text-accent">
                                {loading ? "..." : stats?.plansGenerated || 0}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">Training Plans</div>
                            <div className="mt-2 text-xs text-muted-foreground">Generated by AI</div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-lg">
                            <div className="mb-2 text-4xl font-bold text-success">
                                {loading ? "..." : stats?.teachersImpacted || 0}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">Teachers Impacted</div>
                            <div className="mt-2 text-xs text-muted-foreground">Across all districts</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="mx-auto max-w-7xl px-8 py-16">
                <h2 className="mb-12 text-center text-3xl font-bold">Platform Features</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Needs Management */}
                    <Link
                        href="/needs"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Needs Management</h3>
                        <p className="text-sm text-muted-foreground">
                            Report and track classroom needs from BRPs and CRPs across all districts
                        </p>
                    </Link>

                    {/* Cohorts */}
                    <Link
                        href="/cohorts"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Cohort Management</h3>
                        <p className="text-sm text-muted-foreground">
                            AI-powered grouping of teachers with similar training needs
                        </p>
                    </Link>

                    {/* Training Plans */}
                    <Link
                        href="/plans"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Training Plans</h3>
                        <p className="text-sm text-muted-foreground">
                            Generate personalized, NEP 2020-aligned training plans with AI
                        </p>
                    </Link>

                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Analytics Dashboard</h3>
                        <p className="text-sm text-muted-foreground">
                            Real-time insights and predictive analytics with customizable widgets
                        </p>
                    </Link>

                    {/* Impact Reports */}
                    <Link
                        href="/impact-reports"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Impact Reports</h3>
                        <p className="text-sm text-muted-foreground">
                            Comprehensive reports with heatmaps, drill-down, and export capabilities
                        </p>
                    </Link>

                    {/* Learning Network */}
                    <Link
                        href="/learning-network"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Learning Network</h3>
                        <p className="text-sm text-muted-foreground">
                            Share and discover training plans with ratings, reviews, and collaboration
                        </p>
                    </Link>

                    {/* AI Assistant */}
                    <Link
                        href="/ai-assistant"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">AI Assistant</h3>
                        <p className="text-sm text-muted-foreground">
                            Context-aware AI help with personalized suggestions and quick actions
                        </p>
                    </Link>

                    {/* Gamification */}
                    <Link
                        href="/gamification"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Gamification</h3>
                        <p className="text-sm text-muted-foreground">
                            Badges, streaks, milestones, and certificates to boost engagement
                        </p>
                    </Link>

                    {/* WhatsApp Demo */}
                    <Link
                        href="/whatsapp-demo"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">WhatsApp Integration</h3>
                        <p className="text-sm text-muted-foreground">
                            Report needs and get updates via WhatsApp for easy accessibility
                        </p>
                    </Link>

                    {/* Analytics */}
                    <Link
                        href="/analytics"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Advanced Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                            Deep dive into training metrics, trends, and performance indicators
                        </p>
                    </Link>

                    {/* Learning Modules */}
                    <Link
                        href="/modules"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Learning Modules</h3>
                        <p className="text-sm text-muted-foreground">
                            Browse and manage training modules and learning resources
                        </p>
                    </Link>

                    {/* Session Feedback */}
                    <Link
                        href="/plans"
                        className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Session Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                            Collect and analyze feedback from training sessions
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
