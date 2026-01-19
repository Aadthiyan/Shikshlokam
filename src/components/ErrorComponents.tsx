/**
 * Error Components
 * Reusable error states and messages
 */

interface ErrorMessageProps {
    title?: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    supportEmail?: string;
}

export function ErrorMessage({
    title = "Something went wrong",
    message,
    action,
    supportEmail = "support@diet-training.gov.in",
}: ErrorMessageProps) {
    return (
        <div className="rounded-lg border border-error bg-error/10 p-6">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-lg font-semibold text-error">{title}</h3>
            </div>
            <p className="mb-4 text-sm text-foreground">{message}</p>
            <div className="flex flex-wrap gap-3">
                {action && (
                    <button
                        onClick={action.onClick}
                        className="rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white hover:bg-error/90"
                    >
                        {action.label}
                    </button>
                )}
                <a
                    href={`mailto:${supportEmail}`}
                    className="rounded-lg border border-error px-4 py-2 text-sm font-semibold text-error hover:bg-error/10"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
}

export function InlineError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2 rounded-md bg-error/10 px-3 py-2 text-sm text-error">
            <span>⚠️</span>
            <span>{message}</span>
        </div>
    );
}

export function PageError({
    title = "Page Error",
    message = "We couldn't load this page. Please try again.",
    onRetry,
}: {
    title?: string;
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-8">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 text-6xl">😞</div>
                <h1 className="mb-2 text-2xl font-bold">{title}</h1>
                <p className="mb-6 text-muted-foreground">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}

export function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-8">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 text-6xl">🔍</div>
                <h1 className="mb-2 text-2xl font-bold">Page Not Found</h1>
                <p className="mb-6 text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <a
                    href="/"
                    className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
}

export function EmptyState({
    icon = "📭",
    title,
    message,
    action,
}: {
    icon?: string;
    title: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}) {
    return (
        <div className="rounded-lg border bg-card p-12 text-center">
            <div className="mb-4 text-4xl">{icon}</div>
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{message}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
