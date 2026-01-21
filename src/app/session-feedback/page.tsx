"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Session {
    id: string;
    sessionNumber: number;
    title: string;
    durationMinutes: number;
    planId: string;
    plan: {
        id: string;
        name: string;
        cohort: {
            name: string;
        };
    };
    feedbackCount: number;
    avgRelevance: number | null;
    avgConfidence: number | null;
}

export default function SessionFeedbackPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/sessions/all");
            const data = await response.json();

            if (data.success) {
                setSessions(data.data);
            } else {
                setError(data.error || "Failed to fetch sessions");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions.filter((session) => {
        if (filter === "pending") return session.feedbackCount === 0;
        if (filter === "completed") return session.feedbackCount > 0;
        return true;
    });

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-4">
                        <Link
                            href="/dashboard-home"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                            <svg
                                className="h-8 w-8 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Session Feedback</h1>
                            <p className="text-muted-foreground">
                                Collect and analyze feedback from training sessions
                            </p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 border-b">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${filter === "all"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            All Sessions ({sessions.length})
                        </button>
                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${filter === "pending"
                                    ? "border-warning text-warning"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Pending Feedback ({sessions.filter((s) => s.feedbackCount === 0).length})
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${filter === "completed"
                                    ? "border-success text-success"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Completed ({sessions.filter((s) => s.feedbackCount > 0).length})
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Sessions List */}
                {filteredSessions.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <div className="mb-4 text-4xl">📝</div>
                        <h3 className="mb-2 text-lg font-semibold">No Sessions Found</h3>
                        <p className="text-sm text-muted-foreground">
                            {filter === "pending"
                                ? "All sessions have feedback!"
                                : filter === "completed"
                                    ? "No sessions have feedback yet."
                                    : "No training sessions available."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:border-primary"
                            >
                                {/* Session Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                            {session.sessionNumber}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                {session.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {session.durationMinutes} minutes
                                            </p>
                                        </div>
                                    </div>
                                    {session.feedbackCount > 0 ? (
                                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                                            ✓ {session.feedbackCount} Feedback
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                                            ⏳ Pending
                                        </span>
                                    )}
                                </div>

                                {/* Plan Info */}
                                <div className="mb-4 rounded-lg bg-muted/50 p-3">
                                    <div className="text-xs text-muted-foreground mb-1">Training Plan</div>
                                    <div className="font-semibold text-sm">{session.plan.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Cohort: {session.plan.cohort.name}
                                    </div>
                                </div>

                                {/* Feedback Stats */}
                                {session.feedbackCount > 0 && session.avgRelevance && session.avgConfidence && (
                                    <div className="mb-4 flex gap-4">
                                        <div className="flex-1 rounded-lg bg-primary/5 p-3 text-center">
                                            <div className="text-xl font-bold text-primary">
                                                {session.avgRelevance.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Avg Relevance</div>
                                        </div>
                                        <div className="flex-1 rounded-lg bg-success/5 p-3 text-center">
                                            <div className="text-xl font-bold text-success">
                                                {session.avgConfidence.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Avg Confidence</div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/plans/${session.planId}/sessions/${session.id}/feedback?sessionTitle=${encodeURIComponent(
                                            session.title
                                        )}&sessionNumber=${session.sessionNumber}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Provide Feedback
                                    </Link>
                                    {session.feedbackCount > 0 && (
                                        <Link
                                            href={`/plans/${session.planId}/sessions/${session.id}/feedback/history`}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-transparent px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                            View History
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
