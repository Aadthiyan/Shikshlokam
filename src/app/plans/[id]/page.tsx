"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Plan {
    id: string;
    name: string;
    description: string;
    sessionCount: number;
    totalDurationMinutes: number;
    status: string;
    createdAt: string;
    cohort: {
        id: string;
        name: string;
        primaryIssues: string[];
        language: string;
        teacherCountEstimate: number;
    };
    sessions: Array<{
        id: string;
        sessionNumber: number;
        title: string;
        objectives: string[];
        trainerNotes: string;
        durationMinutes: number;
        module: {
            id: string;
            title: string;
            theme: string;
            competencyTags: string[];
            description: string;
        };
    }>;
    createdBy: {
        name: string;
    };
}

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [translating, setTranslating] = useState(false);
    const [translatedPlan, setTranslatedPlan] = useState<Plan | null>(null);

    useEffect(() => {
        fetchPlan();
    }, [id]);

    const fetchPlan = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/plans/${id}`);
            const data = await response.json();

            if (data.success) {
                setPlan(data.data);
            } else {
                setError(data.error || "Failed to fetch plan");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const translatePlan = async (language: string) => {
        if (!plan) return;

        try {
            setTranslating(true);
            setError(null);

            const response = await fetch("/api/translate/plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planData: plan,
                    language: language,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setTranslatedPlan(data.data);
                setSelectedLanguage(language);
            } else {
                setError(data.error || "Translation failed");
            }
        } catch (err: any) {
            setError(err.message || "Translation error");
        } finally {
            setTranslating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading training plan...</p>
                </div>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="rounded-lg border border-error bg-error/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-error">Error Loading Plan</h2>
                    <p className="text-muted-foreground">{error || "Plan not found"}</p>
                </div>
            </div>
        );
    }

    // Use translated plan if available, otherwise use original
    const displayPlan = translatedPlan || plan;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/cohorts/${plan.cohort.id}`}
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Cohort
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">{displayPlan.name}</h1>
                            <p className="text-muted-foreground">{displayPlan.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Language Selector */}
                            <select
                                value={selectedLanguage}
                                onChange={(e) => translatePlan(e.target.value)}
                                disabled={translating}
                                className="rounded-lg border bg-background px-3 py-2 text-sm font-semibold disabled:opacity-50"
                            >
                                <option value="en">🇬🇧 English</option>
                                <option value="hi">🇮🇳 Hindi (हिंदी)</option>
                                <option value="bn">🇮🇳 Bengali (বাংলা)</option>
                                <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                                <option value="mr">🇮🇳 Marathi (मराठी)</option>
                                <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
                                <option value="gu">🇮🇳 Gujarati (ગુજરાતી)</option>
                                <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                                <option value="ml">🇮🇳 Malayalam (മലയാളം)</option>
                                <option value="or">🇮🇳 Odia (ଓଡ଼ିଆ)</option>
                                <option value="pa">🇮🇳 Punjabi (ਪੰਜਾਬੀ)</option>
                            </select>

                            {translating && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                    Translating...
                                </div>
                            )}

                            <button
                                onClick={async () => {
                                    try {
                                        // Check if translated (non-English)
                                        const isTranslated = translatedPlan !== null;

                                        if (isTranslated) {
                                            // Show helpful message for regional languages
                                            const proceed = confirm(
                                                `📄 Regional Language PDF Export\n\n` +
                                                `For best results with ${selectedLanguage === 'hi' ? 'Hindi' : 'regional language'} text, we recommend:\n\n` +
                                                `1. Use your browser's Print function (Ctrl+P)\n` +
                                                `2. Select "Save as PDF"\n` +
                                                `3. This preserves all formatting and fonts perfectly!\n\n` +
                                                `Click OK to try PDF export anyway, or Cancel to use browser print.`
                                            );

                                            if (!proceed) {
                                                // User chose to use browser print
                                                window.print();
                                                return;
                                            }
                                        }

                                        // Export the currently displayed plan (translated or original)
                                        const response = await fetch(`/api/plans/${id}/export`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ planData: displayPlan }),
                                        });

                                        if (!response.ok) {
                                            throw new Error('Export failed');
                                        }

                                        // Download the PDF
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `training-plan-${id}.pdf`;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                    } catch (error) {
                                        console.error('Export error:', error);
                                        alert('Failed to export PDF');
                                    }
                                }}
                                className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-success/90 flex items-center gap-2"
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
                                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Export PDF
                            </button>
                            <span className="rounded-full bg-warning/20 px-4 py-2 text-sm font-semibold text-warning">
                                {plan.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Plan Summary */}
                <div className="mb-8 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">{plan.sessionCount}</div>
                        <div className="text-sm text-muted-foreground">Sessions</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">{plan.totalDurationMinutes}</div>
                        <div className="text-sm text-muted-foreground">Total Minutes</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">
                            {plan.cohort.teacherCountEstimate}
                        </div>
                        <div className="text-sm text-muted-foreground">Teachers</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-lg font-bold text-primary">{plan.cohort.language}</div>
                        <div className="text-sm text-muted-foreground">Language</div>
                    </div>
                </div>

                {/* Cohort Context */}
                <div className="mb-8 rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Cohort Context</h2>
                    <div className="mb-3">
                        <div className="mb-1 text-sm font-medium text-muted-foreground">Cohort Name</div>
                        <div className="font-semibold">{plan.cohort.name}</div>
                    </div>
                    <div>
                        <div className="mb-2 text-sm font-medium text-muted-foreground">Primary Issues</div>
                        <div className="flex flex-wrap gap-2">
                            {plan.cohort.primaryIssues.map((issue) => (
                                <span
                                    key={issue}
                                    className="rounded-full bg-error/10 px-3 py-1 text-sm font-medium text-error"
                                >
                                    {issue.replace(/_/g, " ")}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Training Sessions */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Training Sessions</h2>

                    {displayPlan.sessions.map((session, index) => (
                        <div key={session.id} className="rounded-lg border bg-card p-6">
                            {/* Session Header */}
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <div className="mb-1 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                            {session.sessionNumber}
                                        </span>
                                        <h3 className="text-xl font-semibold">{session.title}</h3>
                                    </div>
                                    <div className="ml-13 text-sm text-muted-foreground">
                                        {session.durationMinutes} minutes
                                    </div>
                                </div>
                                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                                    {session.module.theme}
                                </span>
                            </div>

                            {/* Module Info */}
                            <div className="mb-4 ml-13 rounded-lg bg-muted/50 p-4">
                                <div className="mb-2 text-sm font-medium text-muted-foreground">
                                    Based on Module
                                </div>
                                <div className="mb-2 font-semibold">{session.module.title}</div>
                                <div className="flex flex-wrap gap-2">
                                    {session.module.competencyTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-background px-2 py-1 text-xs font-medium"
                                        >
                                            {tag.replace(/_/g, " ")}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Learning Objectives */}
                            <div className="mb-4 ml-13">
                                <div className="mb-2 text-sm font-semibold">Learning Objectives</div>
                                <ul className="space-y-2">
                                    {session.objectives.map((objective, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                                            <span className="text-sm">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Trainer Notes */}
                            <div className="ml-13 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Contextualized Trainer Notes
                                </div>
                                <p className="text-sm leading-relaxed">{session.trainerNotes}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 rounded-lg border bg-muted/30 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Plan created by {plan.createdBy.name} on{" "}
                        {new Date(plan.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
