"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    needsCaptureSchema,
    type NeedsCaptureFormData,
    GRADE_OPTIONS,
    SUBJECT_OPTIONS,
    ISSUE_TAG_OPTIONS,
} from "@/lib/schemas";
import SuccessAnimation from "@/components/SuccessAnimation";

interface Cluster {
    id: string;
    name: string;
    district: string;
    block: string;
    state: string;
    primaryLanguage: string;
    infrastructureLevel: string;
}

export default function NeedsCaptureForm() {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<NeedsCaptureFormData>({
        resolver: zodResolver(needsCaptureSchema),
        defaultValues: {
            grades: [],
            subjects: [],
            issueTags: [],
        },
    });

    // Fetch clusters on mount
    useEffect(() => {
        fetchClusters();
    }, []);

    const fetchClusters = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/clusters");
            const data = await response.json();
            if (data.success) {
                setClusters(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch clusters:", err);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: NeedsCaptureFormData) => {
        try {
            setSubmitting(true);
            setError(null);
            setSuccess(false);

            const response = await fetch("/api/needs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                reset();
                // Auto-hide success message after 5 seconds
                setTimeout(() => setSuccess(false), 5000);
            } else {
                setError(result.error || "Failed to submit need signal");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const selectedGrades = watch("grades") || [];
    const selectedSubjects = watch("subjects") || [];
    const selectedIssues = watch("issueTags") || [];

    const toggleGrade = (grade: string) => {
        const current = selectedGrades;
        if (current.includes(grade)) {
            setValue(
                "grades",
                current.filter((g) => g !== grade)
            );
        } else {
            setValue("grades", [...current, grade]);
        }
    };

    const toggleSubject = (subject: string) => {
        const current = selectedSubjects;
        if (current.includes(subject)) {
            setValue(
                "subjects",
                current.filter((s) => s !== subject)
            );
        } else {
            setValue("subjects", [...current, subject]);
        }
    };

    const toggleIssue = (issue: string) => {
        const current = selectedIssues;
        if (current.includes(issue)) {
            setValue(
                "issueTags",
                current.filter((i) => i !== issue)
            );
        } else {
            setValue("issueTags", [...current, issue]);
        }
    };

    return (
        <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-foreground">Report Classroom Needs</h1>
                <p className="text-muted-foreground">
                    Help us understand the training needs in your cluster. This information will be used to
                    create personalized training plans for teachers.
                </p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 rounded-lg border border-success bg-success/10 p-4">
                    <div className="flex items-start">
                        <svg
                            className="mr-3 h-5 w-5 text-success"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <div>
                            <h3 className="font-semibold text-success">Need signal submitted successfully!</h3>
                            <p className="mt-1 text-sm text-success/80">
                                Thank you for reporting. You can submit another need signal below.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
                    <div className="flex items-start">
                        <svg
                            className="mr-3 h-5 w-5 text-error"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <div>
                            <h3 className="font-semibold text-error">Error submitting need signal</h3>
                            <p className="mt-1 text-sm text-error/80">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Animation */}
            <SuccessAnimation
                show={success}
                message="Need signal submitted successfully!"
                onClose={() => setSuccess(false)}
            />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Cluster Selection */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Cluster Information</h2>

                    <div className="space-y-4">
                        {/* Cluster Dropdown */}
                        <div>
                            <label htmlFor="clusterId" className="mb-2 block text-sm font-medium">
                                Select Cluster <span className="text-error">*</span>
                            </label>
                            <select
                                id="clusterId"
                                {...register("clusterId")}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                                disabled={loading}
                            >
                                <option value="">
                                    {loading ? "Loading clusters..." : "Choose a cluster"}
                                </option>
                                {clusters.map((cluster) => (
                                    <option key={cluster.id} value={cluster.id}>
                                        {cluster.name} - {cluster.block}, {cluster.district} ({cluster.state})
                                    </option>
                                ))}
                            </select>
                            {errors.clusterId && (
                                <p className="mt-1 text-sm text-error">{errors.clusterId.message}</p>
                            )}
                        </div>

                        {/* Reporter Name */}
                        <div>
                            <label htmlFor="reportedBy" className="mb-2 block text-sm font-medium">
                                Your Name (Optional)
                            </label>
                            <input
                                type="text"
                                id="reportedBy"
                                {...register("reportedBy")}
                                placeholder="e.g., Ramesh Kumar (BRP)"
                                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                            />
                            {errors.reportedBy && (
                                <p className="mt-1 text-sm text-error">{errors.reportedBy.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grades & Subjects */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Affected Grades & Subjects</h2>

                    {/* Grades */}
                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-medium">
                            Select Grades <span className="text-error">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {GRADE_OPTIONS.map((grade) => (
                                <button
                                    key={grade.value}
                                    type="button"
                                    onClick={() => toggleGrade(grade.value)}
                                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${selectedGrades.includes(grade.value)
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-input bg-background hover:border-primary/50"
                                        }`}
                                >
                                    {grade.label}
                                </button>
                            ))}
                        </div>
                        {errors.grades && <p className="mt-2 text-sm text-error">{errors.grades.message}</p>}
                    </div>

                    {/* Subjects */}
                    <div>
                        <label className="mb-3 block text-sm font-medium">
                            Select Subjects <span className="text-error">*</span>
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {SUBJECT_OPTIONS.map((subject) => (
                                <button
                                    key={subject.value}
                                    type="button"
                                    onClick={() => toggleSubject(subject.value)}
                                    className={`rounded-lg border px-4 py-2 text-left text-sm font-medium transition-colors ${selectedSubjects.includes(subject.value)
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-input bg-background hover:border-primary/50"
                                        }`}
                                >
                                    {subject.label}
                                </button>
                            ))}
                        </div>
                        {errors.subjects && (
                            <p className="mt-2 text-sm text-error">{errors.subjects.message}</p>
                        )}
                    </div>
                </div>

                {/* Issues */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Key Issues</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Select all issues that apply to this cluster
                    </p>

                    <div className="space-y-3">
                        {ISSUE_TAG_OPTIONS.map((issue) => (
                            <button
                                key={issue.value}
                                type="button"
                                onClick={() => toggleIssue(issue.value)}
                                className={`w-full rounded-lg border p-4 text-left transition-colors ${selectedIssues.includes(issue.value)
                                    ? "border-primary bg-primary/10"
                                    : "border-input bg-background hover:border-primary/30"
                                    }`}
                            >
                                <div className="flex items-start">
                                    <div
                                        className={`mr-3 mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center ${selectedIssues.includes(issue.value)
                                            ? "border-primary bg-primary"
                                            : "border-input"
                                            }`}
                                    >
                                        {selectedIssues.includes(issue.value) && (
                                            <svg
                                                className="h-3 w-3 text-primary-foreground"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="3"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{issue.label}</div>
                                        <div className="mt-1 text-sm text-muted-foreground">{issue.description}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    {errors.issueTags && (
                        <p className="mt-2 text-sm text-error">{errors.issueTags.message}</p>
                    )}
                </div>

                {/* Additional Notes */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Additional Information</h2>

                    <div className="space-y-4">
                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                id="notes"
                                {...register("notes")}
                                rows={4}
                                placeholder="Provide any additional context, specific examples, or observations..."
                                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                            />
                        </div>

                        {/* Metrics (Optional) */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="readingPercent" className="mb-2 block text-sm font-medium">
                                    Reading Below Grade Level (%)
                                </label>
                                <input
                                    type="number"
                                    id="readingPercent"
                                    min="0"
                                    max="100"
                                    placeholder="e.g., 65"
                                    onChange={(e) =>
                                        setValue("metrics.readingBelowGradeLevelPercent", parseFloat(e.target.value))
                                    }
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="attendanceRate" className="mb-2 block text-sm font-medium">
                                    Attendance Rate (%)
                                </label>
                                <input
                                    type="number"
                                    id="attendanceRate"
                                    min="0"
                                    max="100"
                                    placeholder="e.g., 75"
                                    onChange={(e) =>
                                        setValue("metrics.attendanceRate", parseFloat(e.target.value))
                                    }
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="rounded-lg border border-input px-6 py-3 font-medium hover:bg-muted"
                        disabled={submitting}
                    >
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit Need Signal"}
                    </button>
                </div>
            </form>
        </div>
    );
}
