"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";

export default function SessionFeedbackPage({
    params,
    searchParams,
}: {
    params: { id: string; sessionId: string };
    searchParams: { sessionTitle?: string; sessionNumber?: string };
}) {
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    const handleSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            router.push(`/plans/${params.id}`);
        }, 2000);
    };

    const handleCancel = () => {
        router.push(`/plans/${params.id}`);
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
                        planId={params.id}
                        sessionId={params.sessionId}
                        sessionTitle={searchParams.sessionTitle || "Training Session"}
                        sessionNumber={parseInt(searchParams.sessionNumber || "1")}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
}
