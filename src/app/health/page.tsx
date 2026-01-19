"use client";

import { useEffect, useState } from "react";

interface HealthStatus {
    status: string;
    timestamp: string;
    latency: number;
    services: {
        database: {
            status: string;
            latency?: number;
            error?: string;
        };
        ai: {
            groq: {
                status: string;
                latency?: number;
                error?: string;
                configured: boolean;
            };
            openai: {
                status: string;
                latency?: number;
                error?: string;
                configured: boolean;
            };
        };
        authentication: {
            configured: boolean;
            provider: string;
        };
    };
    configuration: {
        aiServiceAvailable: boolean;
        authenticationEnabled: boolean;
        environment: string;
    };
}

interface Stats {
    users: number;
    clusters: number;
    needSignals: number;
    cohorts: number;
    modules: number;
    plans: number;
}

export default function HealthDashboard() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHealth = async () => {
        try {
            setLoading(true);
            setError(null);

            const [healthRes, statsRes] = await Promise.all([
                fetch("/api/health"),
                fetch("/api/stats"),
            ]);

            const healthData = await healthRes.json();
            const statsData = await statsRes.json();

            setHealth(healthData);
            setStats(statsData.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch health status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading && !health) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground">Loading health status...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="rounded-lg border border-error bg-error/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-error">Health Check Failed</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <button
                        onClick={fetchHealth}
                        className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "up":
            case "healthy":
                return "text-success";
            case "down":
                return "text-error";
            case "degraded":
                return "text-warning";
            default:
                return "text-muted-foreground";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "up":
            case "healthy":
                return "bg-success/20 text-success";
            case "down":
                return "bg-error/20 text-error";
            case "degraded":
                return "bg-warning/20 text-warning";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">System Health Dashboard</h1>
                    <p className="text-muted-foreground">
                        Monitor the status of all services and dependencies
                    </p>
                </div>

                {/* Overall Status */}
                {health && (
                    <div className="mb-6 rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Overall Status</h2>
                                <p className="text-sm text-muted-foreground">
                                    Last updated: {new Date(health.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadge(health.status)}`}
                                >
                                    {health.status.toUpperCase()}
                                </span>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Response time: {health.latency}ms
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Services Grid */}
                <div className="mb-6 grid gap-6 md:grid-cols-2">
                    {/* Database */}
                    {health && (
                        <div className="rounded-lg border bg-card p-6">
                            <h3 className="mb-4 text-lg font-semibold">Database</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={`font-semibold ${getStatusColor(health.services.database.status)}`}>
                                        {health.services.database.status.toUpperCase()}
                                    </span>
                                </div>
                                {health.services.database.latency && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Latency:</span>
                                        <span>{health.services.database.latency}ms</span>
                                    </div>
                                )}
                                {health.services.database.error && (
                                    <div className="mt-2 rounded bg-error/10 p-2 text-sm text-error">
                                        {health.services.database.error}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* AI Services */}
                    {health && (
                        <div className="rounded-lg border bg-card p-6">
                            <h3 className="mb-4 text-lg font-semibold">AI Services</h3>

                            {/* Groq */}
                            <div className="mb-4">
                                <h4 className="mb-2 font-medium">Groq (Primary)</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className={`font-semibold ${getStatusColor(health.services.ai.groq.status)}`}>
                                            {health.services.ai.groq.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Configured:</span>
                                        <span>{health.services.ai.groq.configured ? "Yes" : "No"}</span>
                                    </div>
                                    {health.services.ai.groq.latency && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Latency:</span>
                                            <span>{health.services.ai.groq.latency}ms</span>
                                        </div>
                                    )}
                                    {health.services.ai.groq.error && (
                                        <div className="mt-2 rounded bg-error/10 p-2 text-xs text-error">
                                            {health.services.ai.groq.error}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* OpenAI */}
                            <div>
                                <h4 className="mb-2 font-medium">OpenAI (Fallback)</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className={`font-semibold ${getStatusColor(health.services.ai.openai.status)}`}>
                                            {health.services.ai.openai.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Configured:</span>
                                        <span>{health.services.ai.openai.configured ? "Yes" : "No"}</span>
                                    </div>
                                    {health.services.ai.openai.latency && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Latency:</span>
                                            <span>{health.services.ai.openai.latency}ms</span>
                                        </div>
                                    )}
                                    {health.services.ai.openai.error && (
                                        <div className="mt-2 rounded bg-error/10 p-2 text-xs text-error">
                                            {health.services.ai.openai.error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Database Statistics */}
                {stats && (
                    <div className="mb-6 rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold">Database Statistics</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{stats.users}</div>
                                <div className="text-sm text-muted-foreground">Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{stats.clusters}</div>
                                <div className="text-sm text-muted-foreground">Clusters</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{stats.needSignals}</div>
                                <div className="text-sm text-muted-foreground">Need Signals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{stats.cohorts}</div>
                                <div className="text-sm text-muted-foreground">Cohorts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{stats.modules}</div>
                                <div className="text-sm text-muted-foreground">Modules</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{stats.plans}</div>
                                <div className="text-sm text-muted-foreground">Plans</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Configuration */}
                {health && (
                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-lg font-semibold">Configuration</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <div className="text-sm text-muted-foreground">Environment</div>
                                <div className="font-semibold">{health.configuration.environment}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">AI Service</div>
                                <div className="font-semibold">
                                    {health.configuration.aiServiceAvailable ? "Enabled" : "Disabled"}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Authentication</div>
                                <div className="font-semibold">
                                    {health.configuration.authenticationEnabled
                                        ? `Enabled (${health.services.authentication.provider})`
                                        : "Disabled"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Refresh Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={fetchHealth}
                        disabled={loading}
                        className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? "Refreshing..." : "Refresh Status"}
                    </button>
                </div>
            </div>
        </div>
    );
}
