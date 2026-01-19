"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Cohort {
    id: string;
    name: string;
    description: string;
    tags: string[];
    primaryIssues: string[];
    language: string;
    gradeBand: string;
    infrastructureLevel: string;
    teacherCountEstimate: number;
    clusterCount: number;
    createdAt: string;
    needSignals: any[];
    _count: {
        plans: number;
    };
}

export default function CohortsPage() {
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCohorts();
    }, []);

    const fetchCohorts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/cohorts");
            const data = await response.json();

            if (data.success) {
                setCohorts(data.data);
            } else {
                setError(data.error || "Failed to fetch cohorts");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
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

    const getIssueColor = (issue: string) => {
        const colors: Record<string, string> = {
            FLN_gaps: "bg-error/10 text-error",
            language_mismatch: "bg-warning/10 text-warning",
            multi_grade_classroom: "bg-info/10 text-info",
            low_infrastructure: "bg-error/10 text-error",
            student_absenteeism: "bg-warning/10 text-warning",
            classroom_behavior: "bg-secondary/10 text-secondary",
            tlm_shortage: "bg-warning/10 text-warning",
            teacher_shortage: "bg-error/10 text-error",
            special_needs: "bg-info/10 text-info",
            digital_divide: "bg-warning/10 text-warning",
        };
        return colors[issue] || "bg-muted text-muted-foreground";
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading cohorts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="rounded-lg border border-error bg-error/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-error">Error Loading Cohorts</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <button
                        onClick={fetchCohorts}
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold">Teacher Cohorts</h1>
                        <p className="text-muted-foreground">
                            Intelligently grouped teachers with similar training needs
                        </p>
                    </div>
                    <Link
                        href="/needs"
                        className="rounded-lg border border-input px-6 py-3 font-semibold hover:bg-muted"
                    >
                        View All Needs
                    </Link>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">{cohorts.length}</div>
                        <div className="text-sm text-muted-foreground">Active Cohorts</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">
                            {cohorts.reduce((sum, c) => sum + c.teacherCountEstimate, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Teachers</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">
                            {cohorts.reduce((sum, c) => sum + c.clusterCount, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Clusters Covered</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="text-2xl font-bold text-primary">
                            {cohorts.reduce((sum, c) => sum + c._count.plans, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Training Plans</div>
                    </div>
                </div>

                {/* Cohorts List */}
                {cohorts.length === 0 ? (
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
                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">No cohorts created yet</h3>
                        <p className="mb-4 text-muted-foreground">
                            Cohorts will be automatically created from reported needs
                        </p>
                        <Link
                            href="/needs/new"
                            className="inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            Report Classroom Needs
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {cohorts.map((cohort) => (
                            <Link
                                key={cohort.id}
                                href={`/cohorts/${cohort.id}`}
                                className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                            >
                                {/* Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                                            {cohort.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {cohort.description}
                                        </p>
                                    </div>
                                    <span
                                        className={`ml-4 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getInfraLevelColor(
                                            cohort.infrastructureLevel
                                        )}`}
                                    >
                                        {cohort.infrastructureLevel}
                                    </span>
                                </div>

                                {/* Primary Issues */}
                                <div className="mb-4">
                                    <div className="mb-2 text-xs font-medium text-muted-foreground">
                                        Primary Issues
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cohort.primaryIssues.map((issue) => (
                                            <span
                                                key={issue}
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${getIssueColor(
                                                    issue
                                                )}`}
                                            >
                                                {issue.replace(/_/g, " ")}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Teachers</div>
                                        <div className="text-lg font-semibold">
                                            {cohort.teacherCountEstimate.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Clusters</div>
                                        <div className="text-lg font-semibold">{cohort.clusterCount}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Language</div>
                                        <div className="text-sm font-medium">{cohort.language}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Grade Band</div>
                                        <div className="text-sm font-medium">
                                            {cohort.gradeBand.replace(/_/g, " ")}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                                    <div>{cohort.needSignals.length} need signals</div>
                                    <div>
                                        {cohort._count.plans > 0 ? (
                                            <span className="text-success">{cohort._count.plans} plan(s) created</span>
                                        ) : (
                                            <span className="text-warning">No plans yet</span>
                                        )}
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
