"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Plan {
    id: string;
    name: string;
    description: string;
    sessionCount: number;
    totalDurationMinutes: number;
    status: string;
    createdAt: string;
    publishedAt?: string;
    cohort: {
        id: string;
        name: string;
        primaryIssues: string[];
    };
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/plans");
            const data = await response.json();

            if (data.success) {
                setPlans(data.data);
            } else {
                setError(data.error || "Failed to fetch plans");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const filteredPlans = plans.filter((plan) => {
        if (filter === "all") return true;
        if (filter === "draft") return plan.status === "DRAFT";
        if (filter === "published") return plan.status === "PUBLISHED";
        return true;
    });

    const stats = {
        total: plans.length,
        draft: plans.filter((p) => p.status === "DRAFT").length,
        published: plans.filter((p) => p.status === "PUBLISHED").length,
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Training Plans</h1>
                    <p className="text-muted-foreground">
                        View and manage all generated training plans
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="text-3xl font-bold text-primary">{stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total Plans</div>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="text-3xl font-bold text-warning">{stats.draft}</div>
                        <div className="text-sm text-muted-foreground">Draft Plans</div>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="text-3xl font-bold text-success">{stats.published}</div>
                        <div className="text-sm text-muted-foreground">Published Plans</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "all"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        All Plans
                    </button>
                    <button
                        onClick={() => setFilter("draft")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "draft"
                                ? "bg-warning text-white"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        Drafts ({stats.draft})
                    </button>
                    <button
                        onClick={() => setFilter("published")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "published"
                                ? "bg-success text-white"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        Published ({stats.published})
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Plans List */}
                {filteredPlans.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <div className="mb-4 text-4xl">📋</div>
                        <h3 className="mb-2 text-lg font-semibold">No Plans Found</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            {filter === "all"
                                ? "No training plans have been generated yet."
                                : `No ${filter} plans found.`}
                        </p>
                        <Link
                            href="/cohorts"
                            className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            Generate Your First Plan
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPlans.map((plan) => (
                            <Link
                                key={plan.id}
                                href={`/plans/${plan.id}`}
                                className="block rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-3">
                                            <h3 className="text-lg font-semibold">{plan.name}</h3>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${plan.status === "DRAFT"
                                                        ? "bg-warning/20 text-warning"
                                                        : "bg-success/20 text-success"
                                                    }`}
                                            >
                                                {plan.status}
                                            </span>
                                        </div>
                                        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                                            {plan.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {plan.cohort.primaryIssues.slice(0, 3).map((issue) => (
                                                <span
                                                    key={issue}
                                                    className="rounded-full bg-error/10 px-2 py-1 text-xs font-medium text-error"
                                                >
                                                    {issue.replace(/_/g, " ")}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>📚 {plan.sessionCount} sessions</span>
                                            <span>⏱️ {plan.totalDurationMinutes} min</span>
                                            <span>
                                                📅{" "}
                                                {new Date(plan.createdAt).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex items-center text-muted-foreground">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
