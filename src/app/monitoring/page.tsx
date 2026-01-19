"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ModuleEffectiveness {
    moduleId: string;
    moduleTitle: string;
    theme: string;
    effectivenessScore: number;
    usageCount: number;
    avgRelevance: number;
    avgConfidence: number;
    recentPerformance: number;
    trend: "improving" | "stable" | "declining";
    recommendForUse: boolean;
}

interface UnresolvedPattern {
    issue: string;
    frequency: number;
    affectedCohorts: string[];
    suggestedActions: string[];
}

interface ImprovementMetric {
    period: string;
    avgRelevance: number;
    avgConfidence: number;
    improvementRate: number;
}

export default function MonitoringPage() {
    const [modules, setModules] = useState<ModuleEffectiveness[]>([]);
    const [patterns, setPatterns] = useState<UnresolvedPattern[]>([]);
    const [metrics, setMetrics] = useState<ImprovementMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [modulesRes, patternsRes, metricsRes] = await Promise.all([
                fetch("/api/learning?type=modules"),
                fetch("/api/learning?type=unresolved-patterns"),
                fetch("/api/learning?type=improvement&months=3"),
            ]);

            const [modulesData, patternsData, metricsData] = await Promise.all([
                modulesRes.json(),
                patternsRes.json(),
                metricsRes.json(),
            ]);

            if (modulesData.success) setModules(modulesData.data);
            if (patternsData.success) setPatterns(patternsData.data);
            if (metricsData.success) setMetrics(metricsData.data);
        } catch (err: any) {
            setError(err.message || "Failed to load monitoring data");
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "improving":
                return "📈";
            case "declining":
                return "📉";
            default:
                return "➡️";
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case "improving":
                return "text-success";
            case "declining":
                return "text-error";
            default:
                return "text-muted-foreground";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading monitoring data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Continuous Monitoring</h1>
                    <p className="text-muted-foreground">
                        Track system performance and identify improvement opportunities
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Improvement Metrics */}
                {metrics.length > 0 && (
                    <div className="mb-8 rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-xl font-semibold">Performance Trends (Last 3 Months)</h2>
                        <div className="space-y-4">
                            {metrics.map((metric, idx) => (
                                <div
                                    key={metric.period}
                                    className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
                                >
                                    <div>
                                        <div className="font-semibold">
                                            {new Date(metric.period + "-01").toLocaleDateString("en-IN", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Avg Relevance: {metric.avgRelevance.toFixed(2)} | Avg Confidence:{" "}
                                            {metric.avgConfidence.toFixed(2)}
                                        </div>
                                    </div>
                                    {idx > 0 && (
                                        <div
                                            className={`text-right ${metric.improvementRate > 0 ? "text-success" : "text-error"
                                                }`}
                                        >
                                            <div className="text-2xl font-bold">
                                                {metric.improvementRate > 0 ? "+" : ""}
                                                {metric.improvementRate.toFixed(1)}%
                                            </div>
                                            <div className="text-xs">vs previous month</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Module Rankings */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">Module Effectiveness Rankings</h2>
                    {modules.length === 0 ? (
                        <div className="rounded-lg border bg-card p-12 text-center">
                            <div className="mb-4 text-4xl">📊</div>
                            <h3 className="mb-2 text-lg font-semibold">No Data Yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Module rankings will appear once feedback is collected.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {modules.slice(0, 10).map((module, idx) => (
                                <div
                                    key={module.moduleId}
                                    className={`rounded-lg border p-6 ${module.recommendForUse ? "bg-card" : "bg-muted/30"
                                        }`}
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-2xl font-bold text-muted-foreground">
                                                    #{idx + 1}
                                                </span>
                                                <span className={`text-xl ${getTrendColor(module.trend)}`}>
                                                    {getTrendIcon(module.trend)}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold">{module.moduleTitle}</h3>
                                            <p className="text-sm text-muted-foreground">{module.theme}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-primary">
                                                {module.effectivenessScore}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Effectiveness</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div>
                                            <div className="font-semibold">{module.avgRelevance.toFixed(1)}/5</div>
                                            <div className="text-xs text-muted-foreground">Relevance</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">{module.avgConfidence.toFixed(1)}/5</div>
                                            <div className="text-xs text-muted-foreground">Confidence</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">{module.usageCount}</div>
                                            <div className="text-xs text-muted-foreground">Uses</div>
                                        </div>
                                    </div>
                                    {!module.recommendForUse && (
                                        <div className="mt-3 rounded bg-error/10 px-2 py-1 text-xs text-error">
                                            ⚠️ Not recommended for use
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Unresolved Patterns */}
                {patterns.length > 0 && (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold">Persistent Issues & Recommendations</h2>
                        <div className="space-y-4">
                            {patterns.slice(0, 5).map((pattern) => (
                                <div key={pattern.issue} className="rounded-lg border bg-card p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-lg font-semibold">
                                                {pattern.issue.replace(/_/g, " ")}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>🔴 {pattern.frequency} occurrences</span>
                                                <span>👥 {pattern.affectedCohorts.length} cohorts affected</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Affected Cohorts */}
                                    <div className="mb-4">
                                        <div className="mb-2 text-sm font-semibold">Affected Cohorts:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {pattern.affectedCohorts.slice(0, 3).map((cohort) => (
                                                <span
                                                    key={cohort}
                                                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                                >
                                                    {cohort}
                                                </span>
                                            ))}
                                            {pattern.affectedCohorts.length > 3 && (
                                                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                                                    +{pattern.affectedCohorts.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Suggested Actions */}
                                    <div>
                                        <div className="mb-2 text-sm font-semibold">💡 Suggested Actions:</div>
                                        <ul className="space-y-2">
                                            {pattern.suggestedActions.map((action, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                                                    <span className="text-sm">{action}</span>
                                                </li>
                                            ))}
                                        </ul>
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
