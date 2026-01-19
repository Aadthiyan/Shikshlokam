"use client";

import { useState } from "react";

interface FeedbackFormProps {
    planId: string;
    sessionId: string;
    sessionTitle: string;
    sessionNumber: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface FeedbackData {
    relevanceScore: number;
    confidenceScore: number;
    comments: string;
    unresolvedIssues: string[];
    trainerNotes: string;
    teacherReactions: string;
    submittedBy: string;
}

const ISSUE_OPTIONS = [
    "FLN_gaps",
    "language_mismatch",
    "behavior_management",
    "assessment_techniques",
    "differentiated_instruction",
    "parent_engagement",
    "resource_constraints",
    "time_management",
    "technology_integration",
    "inclusive_education",
];

export default function FeedbackForm({
    planId,
    sessionId,
    sessionTitle,
    sessionNumber,
    onSuccess,
    onCancel,
}: FeedbackFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FeedbackData>({
        relevanceScore: 0,
        confidenceScore: 0,
        comments: "",
        unresolvedIssues: [],
        trainerNotes: "",
        teacherReactions: "",
        submittedBy: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.relevanceScore === 0) {
            setError("Please rate the session relevance");
            return;
        }
        if (formData.confidenceScore === 0) {
            setError("Please rate teacher confidence gained");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch(`/api/plans/${planId}/sessions/${sessionId}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                onSuccess?.();
            } else {
                setError(data.error || "Failed to submit feedback");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleIssue = (issue: string) => {
        setFormData((prev) => ({
            ...prev,
            unresolvedIssues: prev.unresolvedIssues.includes(issue)
                ? prev.unresolvedIssues.filter((i) => i !== issue)
                : [...prev.unresolvedIssues, issue],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Session Feedback</h2>
                <p className="text-sm text-muted-foreground">
                    Session {sessionNumber}: {sessionTitle}
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-error bg-error/10 p-4">
                    <p className="text-sm text-error">{error}</p>
                </div>
            )}

            {/* Relevance Rating */}
            <div>
                <label className="mb-2 block text-sm font-semibold">
                    Session Relevance <span className="text-error">*</span>
                </label>
                <p className="mb-3 text-xs text-muted-foreground">
                    How relevant was this session to the cohort's needs?
                </p>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                        <button
                            key={score}
                            type="button"
                            onClick={() => setFormData({ ...formData, relevanceScore: score })}
                            className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-semibold transition-all ${formData.relevanceScore === score
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted hover:border-primary"
                                }`}
                        >
                            {score}
                        </button>
                    ))}
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Not Relevant</span>
                    <span>Highly Relevant</span>
                </div>
            </div>

            {/* Confidence Rating */}
            <div>
                <label className="mb-2 block text-sm font-semibold">
                    Teacher Confidence Gained <span className="text-error">*</span>
                </label>
                <p className="mb-3 text-xs text-muted-foreground">
                    How much did teachers' confidence improve after this session?
                </p>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                        <button
                            key={score}
                            type="button"
                            onClick={() => setFormData({ ...formData, confidenceScore: score })}
                            className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-semibold transition-all ${formData.confidenceScore === score
                                    ? "border-success bg-success text-white"
                                    : "border-muted hover:border-success"
                                }`}
                        >
                            {score}
                        </button>
                    ))}
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>No Change</span>
                    <span>Significant Improvement</span>
                </div>
            </div>

            {/* Unresolved Issues */}
            <div>
                <label className="mb-2 block text-sm font-semibold">
                    Unresolved Issues (if any)
                </label>
                <p className="mb-3 text-xs text-muted-foreground">
                    Select issues that still need to be addressed
                </p>
                <div className="flex flex-wrap gap-2">
                    {ISSUE_OPTIONS.map((issue) => (
                        <button
                            key={issue}
                            type="button"
                            onClick={() => toggleIssue(issue)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${formData.unresolvedIssues.includes(issue)
                                    ? "bg-error text-white"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {issue.replace(/_/g, " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comments */}
            <div>
                <label htmlFor="comments" className="mb-2 block text-sm font-semibold">
                    General Comments
                </label>
                <textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Share your overall observations about this session..."
                    className="w-full rounded-lg border p-3 text-sm"
                    rows={4}
                />
            </div>

            {/* Trainer Notes */}
            <div>
                <label htmlFor="trainerNotes" className="mb-2 block text-sm font-semibold">
                    Trainer Notes (Optional)
                </label>
                <textarea
                    id="trainerNotes"
                    value={formData.trainerNotes}
                    onChange={(e) => setFormData({ ...formData, trainerNotes: e.target.value })}
                    placeholder="Any specific observations or suggestions for future trainers..."
                    className="w-full rounded-lg border p-3 text-sm"
                    rows={3}
                />
            </div>

            {/* Teacher Reactions */}
            <div>
                <label htmlFor="teacherReactions" className="mb-2 block text-sm font-semibold">
                    Teacher Reactions (Optional)
                </label>
                <textarea
                    id="teacherReactions"
                    value={formData.teacherReactions}
                    onChange={(e) => setFormData({ ...formData, teacherReactions: e.target.value })}
                    placeholder="How did teachers respond? Any notable feedback from them..."
                    className="w-full rounded-lg border p-3 text-sm"
                    rows={3}
                />
            </div>

            {/* Submitted By */}
            <div>
                <label htmlFor="submittedBy" className="mb-2 block text-sm font-semibold">
                    Your Name
                </label>
                <input
                    type="text"
                    id="submittedBy"
                    value={formData.submittedBy}
                    onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border p-3 text-sm"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
