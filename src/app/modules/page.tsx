"use client";

import { useState, useEffect } from "react";

interface Module {
    id: string;
    title: string;
    theme: string;
    competencyTags: string[];
    durationMinutes: number;
    gradeBand: string;
    language: string;
    infraTags: string[];
    description: string;
    objectives: string[];
}

export default function ModulesPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterTheme, setFilterTheme] = useState<string>("all");
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/modules");
            const data = await response.json();

            if (data.success) {
                setModules(data.data);
            } else {
                setError(data.error || "Failed to fetch modules");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const themes = ["all", ...Array.from(new Set(modules.map((m) => m.theme)))];
    const filteredModules =
        filterTheme === "all" ? modules : modules.filter((m) => m.theme === filterTheme);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading modules...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Module Library</h1>
                    <p className="text-muted-foreground">
                        Browse {modules.length} training modules across {themes.length - 1} themes
                    </p>
                </div>

                {/* Theme Filters */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {themes.map((theme) => (
                        <button
                            key={theme}
                            onClick={() => setFilterTheme(theme)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterTheme === theme
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {theme === "all" ? "All Modules" : theme}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Modules Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredModules.map((module) => (
                        <div
                            key={module.id}
                            onClick={() => setSelectedModule(module)}
                            className="cursor-pointer rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                        >
                            {/* Theme Badge */}
                            <div className="mb-3 flex items-center justify-between">
                                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                                    {module.theme}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {module.durationMinutes} min
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="mb-2 text-lg font-semibold line-clamp-2">{module.title}</h3>

                            {/* Description */}
                            <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                                {module.description}
                            </p>

                            {/* Metadata */}
                            <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span>📚 {module.gradeBand.replace(/_/g, " ")}</span>
                                <span>🌐 {module.language}</span>
                            </div>

                            {/* Competency Tags */}
                            <div className="flex flex-wrap gap-1">
                                {module.competencyTags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                                    >
                                        {tag.replace(/_/g, " ")}
                                    </span>
                                ))}
                                {module.competencyTags.length > 3 && (
                                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                        +{module.competencyTags.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Module Detail Modal */}
                {selectedModule && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedModule(null)}
                    >
                        <div
                            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex-1">
                                    <span className="mb-2 inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                                        {selectedModule.theme}
                                    </span>
                                    <h2 className="mb-2 text-2xl font-bold">{selectedModule.title}</h2>
                                    <p className="text-sm text-muted-foreground">{selectedModule.description}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedModule(null)}
                                    className="ml-4 rounded-lg p-2 hover:bg-muted"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Metadata */}
                            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">Duration</div>
                                    <div className="font-semibold">{selectedModule.durationMinutes} minutes</div>
                                </div>
                                <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">Grade Band</div>
                                    <div className="font-semibold">
                                        {selectedModule.gradeBand.replace(/_/g, " ")}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">Language</div>
                                    <div className="font-semibold">{selectedModule.language}</div>
                                </div>
                                <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                                        Infrastructure
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedModule.infraTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-muted px-2 py-1 text-xs font-medium"
                                            >
                                                {tag.replace(/_/g, " ")}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Competencies */}
                            <div className="mb-6">
                                <div className="mb-2 text-sm font-semibold">Competencies Addressed</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedModule.competencyTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                                        >
                                            {tag.replace(/_/g, " ")}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Learning Objectives */}
                            <div>
                                <div className="mb-2 text-sm font-semibold">Learning Objectives</div>
                                <ul className="space-y-2">
                                    {selectedModule.objectives.map((obj, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                                            <span className="text-sm">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
