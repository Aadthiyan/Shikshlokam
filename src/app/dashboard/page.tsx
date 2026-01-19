"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface DashboardData {
    needsByDistrict: Array<{ name: string; count: number }>;
    needsByIssue: Array<{ name: string; value: number }>;
    needsByGrade: Array<{ name: string; count: number }>;
    trendsOverTime: Array<{ date: string; needs: number; cohorts: number; plans: number }>;
    infrastructureBreakdown: Array<{ name: string; value: number }>;
}

interface Activity {
    id: string;
    type: "need" | "cohort" | "plan";
    message: string;
    timestamp: Date;
    user: string;
}

interface FilterPreset {
    id: string;
    name: string;
    timeRange: string;
    district?: string;
    issue?: string;
}

interface PredictiveInsight {
    title: string;
    description: string;
    trend: "up" | "down" | "stable";
    confidence: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("7d");
    const [activities, setActivities] = useState<Activity[]>([]);
    const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
    const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([]);
    const [showSavePresetModal, setShowSavePresetModal] = useState(false);
    const [newPresetName, setNewPresetName] = useState("");
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [widgetLayout, setWidgetLayout] = useState<string[]>([
        "needsByDistrict",
        "needsByIssue",
        "needsByGrade",
        "infrastructure",
        "trends",
    ]);
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

    const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchDashboardData();
        loadFilterPresets();
        initializePredictiveInsights();
        startRealTimeUpdates();

        return () => {
            if (activityIntervalRef.current) {
                clearInterval(activityIntervalRef.current);
            }
        };
    }, [timeRange]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/dashboard?range=${timeRange}`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const startRealTimeUpdates = () => {
        // Simulate real-time activity feed
        const generateActivity = (): Activity => {
            const types: Array<"need" | "cohort" | "plan"> = ["need", "cohort", "plan"];
            const type = types[Math.floor(Math.random() * types.length)];
            const users = ["Rajesh Kumar", "Priya Singh", "Amit Sharma", "Sunita Devi"];
            const districts = ["Ranchi", "Dumka", "Hazaribagh", "Bokaro"];

            const messages = {
                need: `reported a new training need in ${districts[Math.floor(Math.random() * districts.length)]}`,
                cohort: `created a new cohort for FLN training`,
                plan: `published a training plan`,
            };

            return {
                id: Date.now().toString() + Math.random(),
                type,
                message: messages[type],
                timestamp: new Date(),
                user: users[Math.floor(Math.random() * users.length)],
            };
        };

        // Add initial activities
        setActivities([
            generateActivity(),
            generateActivity(),
            generateActivity(),
        ]);

        // Update every 10 seconds
        activityIntervalRef.current = setInterval(() => {
            setActivities(prev => [generateActivity(), ...prev].slice(0, 10));
        }, 10000);
    };

    const initializePredictiveInsights = () => {
        setPredictiveInsights([
            {
                title: "FLN Gaps Trending Up",
                description: "Expected 15% increase in FLN-related needs next month based on current patterns",
                trend: "up",
                confidence: 87,
            },
            {
                title: "Digital Literacy Demand Growing",
                description: "Digital literacy requests up 23% this week, likely to continue",
                trend: "up",
                confidence: 92,
            },
            {
                title: "Ranchi District Peak Activity",
                description: "Ranchi showing highest engagement, recommend additional resources",
                trend: "up",
                confidence: 78,
            },
        ]);
    };

    const loadFilterPresets = () => {
        const saved = localStorage.getItem("dashboardPresets");
        if (saved) {
            setFilterPresets(JSON.parse(saved));
        } else {
            // Default presets
            setFilterPresets([
                { id: "1", name: "Last Week Overview", timeRange: "7d" },
                { id: "2", name: "Monthly Summary", timeRange: "30d" },
                { id: "3", name: "All Time Stats", timeRange: "all" },
            ]);
        }
    };

    const saveFilterPreset = () => {
        if (!newPresetName.trim()) return;

        const newPreset: FilterPreset = {
            id: Date.now().toString(),
            name: newPresetName,
            timeRange,
        };

        const updated = [...filterPresets, newPreset];
        setFilterPresets(updated);
        localStorage.setItem("dashboardPresets", JSON.stringify(updated));
        setNewPresetName("");
        setShowSavePresetModal(false);
    };

    const loadPreset = (preset: FilterPreset) => {
        setTimeRange(preset.timeRange);
        setSelectedPreset(preset.id);
    };

    const deletePreset = (id: string) => {
        const updated = filterPresets.filter(p => p.id !== id);
        setFilterPresets(updated);
        localStorage.setItem("dashboardPresets", JSON.stringify(updated));
        if (selectedPreset === id) {
            setSelectedPreset(null);
        }
    };

    const handleDragStart = (widget: string) => {
        setDraggedWidget(widget);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetWidget: string) => {
        if (!draggedWidget) return;

        const newLayout = [...widgetLayout];
        const draggedIndex = newLayout.indexOf(draggedWidget);
        const targetIndex = newLayout.indexOf(targetWidget);

        newLayout[draggedIndex] = targetWidget;
        newLayout[targetIndex] = draggedWidget;

        setWidgetLayout(newLayout);
        setDraggedWidget(null);
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "need": return "📝";
            case "cohort": return "👥";
            case "plan": return "📋";
            default: return "•";
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "up": return "📈";
            case "down": return "📉";
            case "stable": return "➡️";
            default: return "•";
        }
    };

    const renderWidget = (widgetId: string) => {
        const widgets: Record<string, React.JSX.Element> = {
            needsByDistrict: (
                <div
                    className="rounded-lg border bg-card p-6 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart("needsByDistrict")}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("needsByDistrict")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Needs by District</h2>
                        <span className="text-xs text-muted-foreground">Drag to reorder</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data?.needsByDistrict || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#0088FE" name="Needs Reported" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ),
            needsByIssue: (
                <div
                    className="rounded-lg border bg-card p-6 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart("needsByIssue")}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("needsByIssue")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Issues Breakdown</h2>
                        <span className="text-xs text-muted-foreground">Drag to reorder</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data?.needsByIssue || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {(data?.needsByIssue || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ),
            needsByGrade: (
                <div
                    className="rounded-lg border bg-card p-6 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart("needsByGrade")}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("needsByGrade")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Needs by Grade Level</h2>
                        <span className="text-xs text-muted-foreground">Drag to reorder</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data?.needsByGrade || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#00C49F" name="Needs" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ),
            infrastructure: (
                <div
                    className="rounded-lg border bg-card p-6 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart("infrastructure")}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("infrastructure")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Infrastructure Levels</h2>
                        <span className="text-xs text-muted-foreground">Drag to reorder</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data?.infrastructureBreakdown || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {(data?.infrastructureBreakdown || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ),
            trends: (
                <div
                    className="rounded-lg border bg-card p-6 lg:col-span-2 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart("trends")}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("trends")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Platform Activity Trends</h2>
                        <span className="text-xs text-muted-foreground">Drag to reorder</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data?.trendsOverTime || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="needs" stroke="#0088FE" name="Needs" />
                            <Line type="monotone" dataKey="cohorts" stroke="#00C49F" name="Cohorts" />
                            <Line type="monotone" dataKey="plans" stroke="#FFBB28" name="Plans" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ),
        };

        return widgets[widgetId] || null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-7xl">
                {/* Save Preset Modal */}
                {showSavePresetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="rounded-lg bg-white p-8 max-w-md w-full shadow-2xl dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Save Filter Preset</h2>
                                <button onClick={() => setShowSavePresetModal(false)} className="text-2xl">×</button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Preset Name</label>
                                <input
                                    type="text"
                                    value={newPresetName}
                                    onChange={(e) => setNewPresetName(e.target.value)}
                                    placeholder="e.g., Weekly FLN Report"
                                    className="w-full rounded-lg border px-4 py-2"
                                />
                            </div>
                            <div className="mb-6 text-sm text-muted-foreground">
                                Current settings: {timeRange}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={saveFilterPreset}
                                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    Save Preset
                                </button>
                                <button
                                    onClick={() => setShowSavePresetModal(false)}
                                    className="flex-1 rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Home
                    </Link>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">Analytics Dashboard</h1>
                            <p className="text-muted-foreground">
                                Real-time insights with predictive analytics and customizable widgets
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setTimeRange("7d")}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold ${timeRange === "7d"
                                    ? "bg-primary text-primary-foreground"
                                    : "border hover:bg-muted"
                                    }`}
                            >
                                7 Days
                            </button>
                            <button
                                onClick={() => setTimeRange("30d")}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold ${timeRange === "30d"
                                    ? "bg-primary text-primary-foreground"
                                    : "border hover:bg-muted"
                                    }`}
                            >
                                30 Days
                            </button>
                            <button
                                onClick={() => setTimeRange("all")}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold ${timeRange === "all"
                                    ? "bg-primary text-primary-foreground"
                                    : "border hover:bg-muted"
                                    }`}
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => setShowSavePresetModal(true)}
                                className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"
                            >
                                💾 Save Preset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Presets */}
                {filterPresets.length > 0 && (
                    <div className="mb-6 rounded-lg border bg-card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">Saved Presets</h3>
                            <span className="text-xs text-muted-foreground">Click to load</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {filterPresets.map((preset) => (
                                <div key={preset.id} className="flex items-center gap-1">
                                    <button
                                        onClick={() => loadPreset(preset)}
                                        className={`rounded-lg px-3 py-1 text-sm ${selectedPreset === preset.id
                                            ? "bg-primary text-primary-foreground"
                                            : "border hover:bg-muted"
                                            }`}
                                    >
                                        {preset.name}
                                    </button>
                                    <button
                                        onClick={() => deletePreset(preset.id)}
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main Content - 3 columns */}
                    <div className="lg:col-span-3">
                        {/* Predictive Analytics */}
                        <div className="mb-6 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6">
                            <h2 className="mb-4 text-xl font-bold">🔮 Predictive Insights</h2>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {predictiveInsights.map((insight, index) => (
                                    <div key={index} className="rounded-lg border bg-white dark:bg-gray-800 p-4">
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="text-2xl">{getTrendIcon(insight.trend)}</span>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-sm">{insight.title}</h3>
                                                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500"
                                                    style={{ width: `${insight.confidence}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-semibold">{insight.confidence}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Charts Grid - Draggable */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {widgetLayout.map((widgetId) => (
                                <div key={widgetId}>
                                    {renderWidget(widgetId)}
                                </div>
                            ))}
                        </div>

                        {/* Insights */}
                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            <div className="rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                                <div className="mb-2 text-sm font-medium text-muted-foreground">Top Issue</div>
                                <div className="text-2xl font-bold text-primary">
                                    {data?.needsByIssue?.[0]?.name || "FLN Gaps"}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {data?.needsByIssue?.[0]?.value || 0} reports
                                </div>
                            </div>

                            <div className="rounded-lg border bg-gradient-to-br from-secondary/10 to-secondary/5 p-6">
                                <div className="mb-2 text-sm font-medium text-muted-foreground">Most Active District</div>
                                <div className="text-2xl font-bold text-secondary">
                                    {data?.needsByDistrict?.[0]?.name || "Ranchi"}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {data?.needsByDistrict?.[0]?.count || 0} needs
                                </div>
                            </div>

                            <div className="rounded-lg border bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                                <div className="mb-2 text-sm font-medium text-muted-foreground">Primary Focus</div>
                                <div className="text-2xl font-bold text-accent">
                                    {data?.needsByGrade?.[0]?.name || "Primary 1-3"}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {data?.needsByGrade?.[0]?.count || 0} needs
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Live Activity Feed */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg border bg-card p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">🔴 Live Activity</h2>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                                    <span className="text-xs text-muted-foreground">Live</span>
                                </div>
                            </div>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="rounded-lg border bg-background p-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-lg">{getActivityIcon(activity.type)}</span>
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <strong>{activity.user}</strong> {activity.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(activity.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-xs text-center text-muted-foreground">
                                Updates every 10 seconds
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
