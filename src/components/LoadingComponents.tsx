/**
 * Loading Components
 * Reusable loading states and skeletons
 */

export function LoadingSpinner({ size = "md", message }: { size?: "sm" | "md" | "lg"; message?: string }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`}
            />
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
    );
}

export function LoadingSkeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-muted ${className || "h-4 w-full"}`} />
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <LoadingSkeleton className="mb-4 h-6 w-3/4" />
            <LoadingSkeleton className="mb-2 h-4 w-full" />
            <LoadingSkeleton className="mb-2 h-4 w-5/6" />
            <LoadingSkeleton className="h-4 w-4/6" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <LoadingSkeleton className="h-12 w-12" />
                    <div className="flex-1 space-y-2">
                        <LoadingSkeleton className="h-4 w-3/4" />
                        <LoadingSkeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function PageLoader({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <LoadingSpinner size="lg" message={message} />
        </div>
    );
}

export function InlineLoader({ message }: { message?: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoadingSpinner size="sm" />
            {message && <span>{message}</span>}
        </div>
    );
}
