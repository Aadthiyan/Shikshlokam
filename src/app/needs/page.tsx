"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VoiceRecorder from "@/components/VoiceRecorder";

interface NeedSignal {
    id: string;
    cluster: {
        name: string;
        district: string;
        block: string;
        state: string;
        infrastructureLevel: string;
    };
    grades: string[];
    subjects: string[];
    issueTags: string[];
    notes?: string;
    reportedBy?: string;
    createdAt: string;
}

export default function NeedsListPage() {
    const [needs, setNeeds] = useState<NeedSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [generationMessage, setGenerationMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchNeeds();
    }, []);

    const fetchNeeds = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/needs");
            const data = await response.json();

            if (data.success) {
                setNeeds(data.data);
            } else {
                setError(data.error || "Failed to fetch needs");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCohorts = async () => {
        try {
            setGenerating(true);
            setGenerationMessage(null);

            // Get all need IDs
            const needIds = needs.map(n => n.id);

            // Call suggest cohorts API
            const suggestResponse = await fetch("/api/cohorts/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ needSignalIds: needIds }),
            });

            const suggestData = await suggestResponse.json();

            if (!suggestData.success || suggestData.data.length === 0) {
                setGenerationMessage("No cohorts could be generated. Try adding more needs with similar issues.");
                return;
            }

            // Create cohorts from suggestions
            let createdCount = 0;
            for (const suggestion of suggestData.data) {
                const createResponse = await fetch("/api/cohorts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        needSignalIds: suggestion.needSignalIds,
                        userId: "demo_user",
                    }),
                });

                if (createResponse.ok) {
                    createdCount++;
                }
            }

            if (createdCount > 0) {
                setGenerationMessage(`✅ Successfully created ${createdCount} cohort${createdCount > 1 ? 's' : ''}! Redirecting...`);
                setTimeout(() => {
                    window.location.href = "/cohorts";
                }, 2000);
            } else {
                setGenerationMessage("❌ Failed to create cohorts. Please try again.");
            }
        } catch (err: any) {
            setGenerationMessage(`❌ Error: ${err.message}`);
        } finally {
            setGenerating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInfraLevelColor = (level: string) => {
        switch (level) {
            case "HIGH":
                return "bg-success/20 text-success";
            case "MEDIUM":
                return "bg-warning/20 text-warning";
            case "LOW":
                return "bg-error/20 text-error";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading need signals...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="rounded-lg border border-error bg-error/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-error">Error Loading Needs</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <button
                        onClick={fetchNeeds}
                        className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">Reported Needs</h1>
                            <p className="text-muted-foreground">
                                View all classroom needs reported by BRPs and CRPs
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {needs.length >= 2 && (
                                <button
                                    onClick={handleGenerateCohorts}
                                    disabled={generating}
                                    className="rounded-lg bg-success px-6 py-3 font-semibold text-white hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {generating ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            🤖 Generate Cohorts
                                        </>
                                    )}
                                </button>
                            )}
                            <Link
                                href="/needs/new"
                                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                + Report New Need
                            </Link>
                        </div>
                    </div>

                    {/* Generation Message */}
                    {generationMessage && (
                        <div className={`rounded-lg p-4 ${generationMessage.includes('✅') ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                            {generationMessage}
                        </div>
                    )}

                    {/* Voice Recorder - NEW FEATURE! */}
                    <div className="mt-6">
                        <VoiceRecorder
                            onTranscriptionComplete={async (needData) => {
                                console.log("Voice transcription complete:", needData);

                                try {
                                    // Show loading alert
                                    const loadingAlert = `Voice transcription successful!\n\nCreating need...\n\n- Cluster: ${needData.clusterName}\n- Issue: ${needData.primaryIssue}\n- Grade: ${needData.gradeBand}\n- Infrastructure: ${needData.infrastructureLevel}`;

                                    // Find or create cluster
                                    let clusterId = null;

                                    // Try to find existing cluster by name
                                    const clustersResponse = await fetch("/api/clusters");
                                    const clustersData = await clustersResponse.json();

                                    if (clustersData.success && clustersData.data.length > 0) {
                                        const matchingCluster = clustersData.data.find((c: any) =>
                                            c.name.toLowerCase().includes(needData.clusterName.toLowerCase()) ||
                                            needData.clusterName.toLowerCase().includes(c.name.toLowerCase())
                                        );

                                        if (matchingCluster) {
                                            clusterId = matchingCluster.id;
                                        } else {
                                            // Use first cluster as fallback
                                            clusterId = clustersData.data[0].id;
                                        }
                                    }

                                    if (!clusterId) {
                                        alert("No clusters found. Please create a cluster first.");
                                        return;
                                    }

                                    // Create the need
                                    const response = await fetch("/api/needs", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            clusterId: clusterId,
                                            grades: [needData.gradeBand],
                                            subjects: needData.subjects || ["ALL"], // Use extracted subjects or default to ALL
                                            issueTags: [needData.primaryIssue],
                                            notes: `Voice-reported need: ${needData.description}`,
                                            reportedBy: "Voice Reporter",
                                        }),
                                    });

                                    const result = await response.json();

                                    if (result.success) {
                                        alert(`✅ Need created successfully!\n\nCluster: ${needData.clusterName}\nIssue: ${needData.primaryIssue}\nGrade: ${needData.gradeBand}\n\nRefreshing page...`);
                                        // Refresh the page to show the new need
                                        window.location.reload();
                                    } else {
                                        alert(`❌ Failed to create need: ${result.error}`);
                                    }
                                } catch (error: any) {
                                    console.error("Error creating need:", error);
                                    alert(`❌ Error creating need: ${error.message}`);
                                }
                            }}
                            language="auto"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">{needs.length}</div>
                        <div className="text-sm text-muted-foreground">Total Need Signals</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">
                            {new Set(needs.map((n) => n.cluster.name)).size}
                        </div>
                        <div className="text-sm text-muted-foreground">Unique Clusters</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">
                            {new Set(needs.flatMap((n) => n.issueTags)).size}
                        </div>
                        <div className="text-sm text-muted-foreground">Unique Issues</div>
                    </div>
                </div>

                {/* Needs List */}
                {needs.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <svg
                                className="h-8 w-8 text-muted-foreground"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">No needs reported yet</h3>
                        <p className="mb-4 text-muted-foreground">
                            Start by reporting classroom needs from your cluster
                        </p>
                        <Link
                            href="/needs/new"
                            className="inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            Report First Need
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {needs.map((need) => (
                            <div key={need.id} className="rounded-lg border bg-card p-6 hover:border-primary/50 transition-colors">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="mb-1 text-lg font-semibold">{need.cluster.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {need.cluster.block}, {need.cluster.district}, {need.cluster.state}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getInfraLevelColor(
                                            need.cluster.infrastructureLevel
                                        )}`}
                                    >
                                        {need.cluster.infrastructureLevel} Infrastructure
                                    </span>
                                </div>

                                <div className="mb-4 grid gap-4 sm:grid-cols-3">
                                    {/* Grades */}
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-muted-foreground">Grades</div>
                                        <div className="flex flex-wrap gap-2">
                                            {need.grades.map((grade) => (
                                                <span
                                                    key={grade}
                                                    className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                                                >
                                                    Grade {grade}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subjects */}
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-muted-foreground">Subjects</div>
                                        <div className="flex flex-wrap gap-2">
                                            {need.subjects.slice(0, 3).map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                            {need.subjects.length > 3 && (
                                                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                                    +{need.subjects.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Issues */}
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-muted-foreground">Key Issues</div>
                                        <div className="flex flex-wrap gap-2">
                                            {need.issueTags.slice(0, 2).map((issue) => (
                                                <span
                                                    key={issue}
                                                    className="rounded-full bg-error/10 px-2 py-1 text-xs font-medium text-error"
                                                >
                                                    {issue.replace(/_/g, " ")}
                                                </span>
                                            ))}
                                            {need.issueTags.length > 2 && (
                                                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                                    +{need.issueTags.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {need.notes && (
                                    <div className="mb-4 rounded-lg bg-muted p-3">
                                        <div className="mb-1 text-xs font-medium text-muted-foreground">Notes</div>
                                        <p className="text-sm">{need.notes}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div>
                                        {need.reportedBy && <span>Reported by {need.reportedBy}</span>}
                                    </div>
                                    <div>{formatDate(need.createdAt)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
