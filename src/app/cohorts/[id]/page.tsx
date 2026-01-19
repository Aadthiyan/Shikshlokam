"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Cohort {
    id: string;
    name: string;
    description: string;
    primaryIssues: string[];
    language: string;
    gradeBand: string;
    infrastructureLevel: string;
    teacherCountEstimate: number;
    clusterCount: number;
    createdAt: string;
    needSignals: any[];
    plans: any[];
}

export default function CohortDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [cohort, setCohort] = useState<Cohort | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCohort();
    }, [id]);

    const fetchCohort = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/cohorts/${id}`);
            const data = await response.json();

            if (data.success) {
                setCohort(data.data);
            } else {
                setError(data.error || "Failed to fetch cohort");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const generatePlan = async () => {
        try {
            setGenerating(true);
            setError(null);

            const response = await fetch(`/api/cohorts/${id}/generate-plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    numSessions: 4,
                    useAI: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Navigate to plan page
                router.push(`/plans/${data.data.id}`);
            } else {
                setError(data.error || "Failed to generate plan");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading cohort...</p>
                </div>
            </div>
        );
    }

    if (error && !cohort) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="rounded-lg border border-error bg-error/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-error">Error Loading Cohort</h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    if (!cohort) return null;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/cohorts"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Cohorts
                    </Link>
                    <h1 className="mb-2 text-3xl font-bold">{cohort.name}</h1>
                    <p className="text-muted-foreground">{cohort.description}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Cohort Profile */}
                <div className="mb-8 rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Cohort Profile</h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Primary Issues */}
                        <div>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">Primary Issues</div>
                            <div className="flex flex-wrap gap-2">
                                {cohort.primaryIssues.map((issue) => (
                                    <span
                                        key={issue}
                                        className="rounded-full bg-error/10 px-3 py-1 text-sm font-medium text-error"
                                    >
                                        {issue.replace(/_/g, " ")}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Teacher Count */}
                        <div>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">Teachers</div>
                            <div className="text-2xl font-bold text-primary">
                                {cohort.teacherCountEstimate.toLocaleString()}
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">Language</div>
                            <div className="text-lg font-semibold">{cohort.language}</div>
                        </div>

                        {/* Grade Band */}
                        <div>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">Grade Band</div>
                            <div className="text-lg font-semibold">{cohort.gradeBand.replace(/_/g, " ")}</div>
                        </div>

                        {/* Infrastructure */}
                        <div>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">
                                Infrastructure Level
                            </div>
                            <div className="text-lg font-semibold">{cohort.infrastructureLevel}</div>
                        </div>

                        {/* Clusters */}
                        <div>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">Clusters</div>
                            <div className="text-lg font-semibold">{cohort.clusterCount}</div>
                        </div>
                    </div>
                </div>

                {/* Generate Plan Section */}
                <div className="mb-8 rounded-lg border bg-gradient-to-br from-primary/5 to-secondary/5 p-8 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h2 className="mb-4 text-2xl font-bold">Generate AI Training Plan</h2>
                        <p className="mb-6 text-muted-foreground">
                            Our AI will analyze this cohort's profile and create a personalized 4-session
                            training plan with contextualized objectives and trainer notes.
                        </p>
                        <button
                            onClick={generatePlan}
                            disabled={generating}
                            className="rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {generating ? (
                                <span className="flex items-center">
                                    <svg
                                        className="mr-2 h-5 w-5 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Generating Plan with AI...
                                </span>
                            ) : (
                                <span>🤖 Generate AI Training Plan</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Existing Plans */}
                {cohort.plans && cohort.plans.length > 0 && (
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-xl font-semibold">Generated Plans</h2>
                        <div className="space-y-3">
                            {cohort.plans.map((plan: any) => (
                                <Link
                                    key={plan.id}
                                    href={`/plans/${plan.id}`}
                                    className="block rounded-lg border p-4 hover:border-primary hover:bg-muted/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{plan.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {plan.sessionCount} sessions • {plan.totalDurationMinutes} minutes
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(plan.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
