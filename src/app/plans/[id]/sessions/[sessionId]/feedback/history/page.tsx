"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Feedback {
    id: string;
    relevanceScore: number;
    confidenceScore: number;
    comments: string | null;
    unresolvedIssues: string[];
    trainerNotes: string | null;
    teacherReactions: string | null;
    submittedBy: string | null;
    createdAt: string;
    user?: {
        name: string | null;
        email: string;
    };
}

interface Stats {
    count: number;
    avgRelevance: number;
    avgConfidence: number;
}

export default function FeedbackHistoryPage({
    params,
}: {
    params: Promise<{ id: string; sessionId: string }>;
}) {
    // Unwrap params using React.use()
    const { id, sessionId } = use(params);

    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeedback();
    }, [sessionId]);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/plans/${id}/sessions/${sessionId}/feedback`
            );
            const data = await response.json();

            if (data.success) {
                setFeedbacks(data.data);
                setStats(data.stats);
            } else {
                setError(data.error || "Failed to fetch feedback");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading feedback...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/plans/${id}`}
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Plan
                    </Link>
                    <h1 className="mb-2 text-3xl font-bold">Session Feedback History</h1>
                    <p className="text-muted-foreground">
                        View all feedback submitted for this training session
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Statistics */}
                {stats && stats.count > 0 && (
                    <div className="mb-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border bg-card p-6">
                            <div className="text-3xl font-bold text-primary">{stats.count}</div>
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
                            <div className="text-sm text-muted-foreground">Avg Confidence Gain</div>
                        </div>
                    </div>
                )}

                {/* Feedback List */}
                {feedbacks.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <div className="mb-4 text-4xl">📝</div>
                        <h3 className="mb-2 text-lg font-semibold">No Feedback Yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            No feedback has been submitted for this session yet.
                        </p>
                        <Link
                            href={`/plans/${id}/sessions/${sessionId}/feedback`}
                            className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            Submit Feedback
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {feedbacks.map((feedback) => (
                            <div key={feedback.id} className="rounded-lg border bg-card p-6">
                                {/* Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <div className="font-semibold">
                                            {feedback.submittedBy || feedback.user?.name || "Anonymous"}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(feedback.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">
                                                {feedback.relevanceScore}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Relevance</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-success">
                                                {feedback.confidenceScore}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Confidence</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments */}
                                {feedback.comments && (
                                    <div className="mb-4">
                                        <div className="mb-1 text-sm font-semibold">Comments:</div>
                                        <p className="text-sm text-muted-foreground">{feedback.comments}</p>
                                    </div>
                                )}

                                {/* Unresolved Issues */}
                                {feedback.unresolvedIssues.length > 0 && (
                                    <div className="mb-4">
                                        <div className="mb-2 text-sm font-semibold">Unresolved Issues:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.unresolvedIssues.map((issue) => (
                                                <span
                                                    key={issue}
                                                    className="rounded-full bg-error/10 px-3 py-1 text-xs font-medium text-error"
                                                >
                                                    {issue.replace(/_/g, " ")}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Trainer Notes */}
                                {feedback.trainerNotes && (
                                    <div className="mb-4">
                                        <div className="mb-1 text-sm font-semibold">Trainer Notes:</div>
                                        <p className="text-sm text-muted-foreground">{feedback.trainerNotes}</p>
                                    </div>
                                )}

                                {/* Teacher Reactions */}
                                {feedback.teacherReactions && (
                                    <div>
                                        <div className="mb-1 text-sm font-semibold">Teacher Reactions:</div>
                                        <p className="text-sm text-muted-foreground">
                                            {feedback.teacherReactions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
