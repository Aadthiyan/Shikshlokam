"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";

export default function SessionFeedbackPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string; sessionId: string }>;
    searchParams: Promise<{ sessionTitle?: string; sessionNumber?: string }>;
}) {
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    // Unwrap params and searchParams using React.use()
    const { id, sessionId } = use(params);
    const { sessionTitle, sessionNumber } = use(searchParams);

    const handleSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            router.push(`/plans/${id}`);
        }, 2000);
    };

    const handleCancel = () => {
        router.push(`/plans/${id}`);
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-8">
                <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center">
                    <div className="mb-4 text-6xl">✅</div>
                    <h2 className="mb-2 text-2xl font-bold text-success">Feedback Submitted!</h2>
                    <p className="text-sm text-muted-foreground">
                        Thank you for your feedback. Redirecting...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-lg border bg-card p-8">
                    <FeedbackForm
                        planId={id}
                        sessionId={sessionId}
                        sessionTitle={sessionTitle || "Training Session"}
                        sessionNumber={parseInt(sessionNumber || "1")}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
}
