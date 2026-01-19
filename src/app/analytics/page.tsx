"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
    totalPlans: number;
    totalFeedback: number;
    avgRelevance: number;
    avgConfidence: number;
    excellentPlans: number;
    needsImprovementPlans: number;
}

interface PlanAnalytics {
    planId: string;
    planName: string;
    cohortName: string;
    sessionCount: number;
    feedbackCount: number;
    avgRelevance: number;
    avgConfidence: number;
    status: "excellent" | "good" | "needs_improvement";
    unresolvedIssues: string[];
    createdAt: string;
}

interface IssueAnalytics {
    issue: string;
    occurrenceCount: number;
    percentageOfFeedback: number;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [plans, setPlans] = useState<PlanAnalytics[]>([]);
    const [issues, setIssues] = useState<IssueAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            const [statsRes, plansRes, issuesRes] = await Promise.all([
                fetch("/api/analytics?type=dashboard"),
                fetch("/api/analytics?type=plans"),
                fetch("/api/analytics?type=issues"),
            ]);

            const [statsData, plansData, issuesData] = await Promise.all([
                statsRes.json(),
                plansRes.json(),
                issuesRes.json(),
            ]);

            if (statsData.success) setStats(statsData.data);
            if (plansData.success) setPlans(plansData.data);
            if (issuesData.success) setIssues(issuesData.data);
        } catch (err: any) {
            setError(err.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "excellent":
                return "bg-success/20 text-success border-success";
            case "good":
                return "bg-warning/20 text-warning border-warning";
            case "needs_improvement":
                return "bg-error/20 text-error border-error";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "excellent":
                return "🟢";
            case "good":
                return "🟡";
            case "needs_improvement":
                return "🔴";
            default:
                return "⚪";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Analytics & Insights</h1>
                    <p className="text-muted-foreground">
                        Track plan effectiveness and identify improvement opportunities
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Dashboard Stats */}
                {stats && (
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-card p-6">
                            <div className="text-3xl font-bold text-primary">{stats.totalPlans}</div>
                            <div className="text-sm text-muted-foreground">Total Plans</div>
                        </div>
                        <div className="rounded-lg border bg-card p-6">
                            <div className="text-3xl font-bold text-primary">{stats.totalFeedback}</div>
                            <div className="text-sm text-muted-foreground">Total Feedback</div>
                        </div>
                        <div className="rounded-lg border bg-card p-6">
                            <div className="text-3xl font-bold text-primary">
                                {stats.avgRelevance.toFixed(1)}/5
                            </div>
                            <div className="text-sm text-muted-foreground">Avg Relevance</div>
                        </div>
                        <div className="rounded-lg border bg-card p-6">
                            <div className="text-3xl font-bold text-success">
                                {stats.avgConfidence.toFixed(1)}/5
                            </div>
                            <div className="text-sm text-muted-foreground">Avg Confidence</div>
                        </div>
                    </div>
                )}

                {/* Performance Overview */}
                {stats && (
                    <div className="mb-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-card p-6">
                            <div className="mb-2 text-sm font-semibold">Excellent Plans</div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-bold text-success">{stats.excellentPlans}</div>
                                <div className="text-sm text-muted-foreground">
                                    ({stats.totalPlans > 0 ? ((stats.excellentPlans / stats.totalPlans) * 100).toFixed(0) : 0}%)
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">Relevance ≥ 4.0</div>
                        </div>
                        <div className="rounded-lg border bg-card p-6">
                            <div className="mb-2 text-sm font-semibold">Needs Improvement</div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-bold text-error">
                                    {stats.needsImprovementPlans}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    ({stats.totalPlans > 0 ? ((stats.needsImprovementPlans / stats.totalPlans) * 100).toFixed(0) : 0}%)
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">Relevance &lt; 3.0</div>
                        </div>
                    </div>
                )}

                {/* Plans List */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold">Plan Performance</h2>
                    {plans.length === 0 ? (
                        <div className="rounded-lg border bg-card p-12 text-center">
                            <div className="mb-4 text-4xl">📊</div>
                            <h3 className="mb-2 text-lg font-semibold">No Analytics Data Yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Analytics will appear once feedback is submitted for training plans.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {plans.map((plan) => (
                                <Link
                                    key={plan.planId}
                                    href={`/plans/${plan.planId}`}
                                    className="block rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-3">
                                                <span className="text-2xl">{getStatusIcon(plan.status)}</span>
                                                <div>
                                                    <h3 className="text-lg font-semibold">{plan.planName}</h3>
                                                    <p className="text-sm text-muted-foreground">{plan.cohortName}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <span>📚 {plan.sessionCount} sessions</span>
                                                <span>💬 {plan.feedbackCount} feedback</span>
                                                <span>
                                                    📅{" "}
                                                    {new Date(plan.createdAt).toLocaleDateString("en-IN", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                            {plan.unresolvedIssues.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {plan.unresolvedIssues.slice(0, 3).map((issue) => (
                                                        <span
                                                            key={issue}
                                                            className="rounded-full bg-error/10 px-2 py-1 text-xs font-medium text-error"
                                                        >
                                                            {issue.replace(/_/g, " ")}
                                                        </span>
                                                    ))}
                                                    {plan.unresolvedIssues.length > 3 && (
                                                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                                            +{plan.unresolvedIssues.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4 text-right">
                                            <div
                                                className={`mb-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(plan.status)}`}
                                            >
                                                {plan.status.replace(/_/g, " ").toUpperCase()}
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-semibold text-primary">
                                                    {plan.avgRelevance.toFixed(1)}/5
                                                </div>
                                                <div className="text-xs text-muted-foreground">Relevance</div>
                                            </div>
                                            <div className="mt-2 text-sm">
                                                <div className="font-semibold text-success">
                                                    {plan.avgConfidence.toFixed(1)}/5
                                                </div>
                                                <div className="text-xs text-muted-foreground">Confidence</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Unresolved Issues */}
                {issues.length > 0 && (
                    <div>
                        <h2 className="mb-4 text-2xl font-bold">Common Unresolved Issues</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {issues.slice(0, 6).map((issue) => (
                                <div key={issue.issue} className="rounded-lg border bg-card p-6">
                                    <div className="mb-2 font-semibold">{issue.issue.replace(/_/g, " ")}</div>
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-2xl font-bold text-error">{issue.occurrenceCount}</div>
                                        <div className="text-sm text-muted-foreground">occurrences</div>
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {issue.percentageOfFeedback.toFixed(1)}% of feedback
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
