"use client";

import { useState, useEffect } from "react";

interface Recommendations {
    lowPerformingSessions: Array<{
        sessionId: string;
        title: string;
        avgRelevance: number;
    }>;
    suggestedModules: Array<{
        moduleId: string;
        title: string;
        theme: string;
    }>;
    insights: string[];
}

interface PlanAnalyticsProps {
    planId: string;
}

export default function PlanAnalytics({ planId }: PlanAnalyticsProps) {
    const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecommendations();
    }, [planId]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/plans/${planId}/recommendations`);
            const data = await response.json();

            if (data.success) {
                setRecommendations(data.data);
            } else {
                setError(data.error || "Failed to load recommendations");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-lg border bg-card p-6">
                <div className="text-center">
                    <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !recommendations) {
        return null;
    }

    if (
        recommendations.insights.length === 0 &&
        recommendations.lowPerformingSessions.length === 0 &&
        recommendations.suggestedModules.length === 0
    ) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Insights */}
            {recommendations.insights.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold">💡 Insights & Recommendations</h3>
                    <div className="space-y-3">
                        {recommendations.insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className="rounded-lg bg-primary/5 p-4 text-sm leading-relaxed"
                            >
                                {insight}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Low Performing Sessions */}
            {recommendations.lowPerformingSessions.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold">📉 Sessions Needing Improvement</h3>
                    <div className="space-y-3">
                        {recommendations.lowPerformingSessions.map((session) => (
                            <div
                                key={session.sessionId}
                                className="flex items-center justify-between rounded-lg bg-error/5 p-4"
                            >
                                <div>
                                    <div className="font-semibold">{session.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Consider replacing with a different module
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-error">
                                        {session.avgRelevance.toFixed(1)}/5
                                    </div>
                                    <div className="text-xs text-muted-foreground">Avg Relevance</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Modules */}
            {recommendations.suggestedModules.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold">✨ Suggested Alternative Modules</h3>
                    <div className="space-y-3">
                        {recommendations.suggestedModules.map((module) => (
                            <div
                                key={module.moduleId}
                                className="flex items-center justify-between rounded-lg bg-success/5 p-4"
                            >
                                <div>
                                    <div className="font-semibold">{module.title}</div>
                                    <div className="text-sm text-muted-foreground">{module.theme}</div>
                                </div>
                                <div className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success">
                                    High Rated
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
