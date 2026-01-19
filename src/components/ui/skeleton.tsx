import React from "react";

// Base Skeleton Component
export const Skeleton = ({
    className = "",
    variant = "rectangular",
    animation = "pulse",
    style
}: {
    className?: string;
    variant?: "rectangular" | "circular" | "text";
    animation?: "pulse" | "shimmer" | "wave";
    style?: React.CSSProperties;
}) => {
    const baseClasses = "bg-gray-200 dark:bg-gray-700";

    const variantClasses = {
        rectangular: "rounded-lg",
        circular: "rounded-full",
        text: "rounded"
    };

    const animationClasses = {
        pulse: "animate-pulse",
        shimmer: "animate-shimmer",
        wave: "animate-wave"
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    );
};

// Card Skeleton
export const CardSkeleton = () => {
    return (
        <div className="rounded-lg border bg-card p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-6 w-3/4" variant="text" />
                <Skeleton className="h-8 w-16" variant="rectangular" />
            </div>
            <Skeleton className="h-4 w-1/2 mb-4" variant="text" />
            <div className="grid grid-cols-2 gap-3 mb-4">
                <Skeleton className="h-16" variant="rectangular" />
                <Skeleton className="h-16" variant="rectangular" />
            </div>
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-5/6" variant="text" />
                <Skeleton className="h-4 w-4/6" variant="text" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" variant="rectangular" />
                <Skeleton className="h-10 w-20" variant="rectangular" />
            </div>
        </div>
    );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
    return (
        <div className="space-y-3 animate-fade-in">
            {/* Header */}
            <div className="flex gap-4 pb-3 border-b">
                <Skeleton className="h-4 w-1/4" variant="text" />
                <Skeleton className="h-4 w-1/4" variant="text" />
                <Skeleton className="h-4 w-1/4" variant="text" />
                <Skeleton className="h-4 w-1/4" variant="text" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 py-3">
                    <Skeleton className="h-4 w-1/4" variant="text" />
                    <Skeleton className="h-4 w-1/4" variant="text" />
                    <Skeleton className="h-4 w-1/4" variant="text" />
                    <Skeleton className="h-4 w-1/4" variant="text" />
                </div>
            ))}
        </div>
    );
};

// Chart Skeleton
export const ChartSkeleton = () => {
    return (
        <div className="rounded-lg border bg-card p-6 animate-fade-in">
            <Skeleton className="h-6 w-1/3 mb-6" variant="text" />
            <div className="flex items-end justify-between h-64 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1"
                        style={{ height: `${Math.random() * 100 + 50}%` }}
                        variant="rectangular"
                    />
                ))}
            </div>
        </div>
    );
};

// Stats Card Skeleton
export const StatsCardSkeleton = () => {
    return (
        <div className="rounded-lg border bg-card p-6 animate-fade-in">
            <Skeleton className="h-4 w-2/3 mb-3" variant="text" />
            <Skeleton className="h-10 w-1/2 mb-2" variant="text" />
            <Skeleton className="h-3 w-1/3" variant="text" />
        </div>
    );
};

// List Item Skeleton
export const ListItemSkeleton = () => {
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg border bg-card animate-fade-in">
            <Skeleton className="h-12 w-12" variant="circular" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" variant="text" />
                <Skeleton className="h-3 w-1/2" variant="text" />
            </div>
            <Skeleton className="h-8 w-20" variant="rectangular" />
        </div>
    );
};

// Dashboard Grid Skeleton
export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
    return (
        <div className="flex items-center gap-4 animate-fade-in">
            <Skeleton className="h-16 w-16" variant="circular" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" variant="text" />
                <Skeleton className="h-4 w-1/2" variant="text" />
            </div>
        </div>
    );
};

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            {Array.from({ length: fields }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/4" variant="text" />
                    <Skeleton className="h-10 w-full" variant="rectangular" />
                </div>
            ))}
            <div className="flex gap-4 pt-4">
                <Skeleton className="h-10 w-32" variant="rectangular" />
                <Skeleton className="h-10 w-32" variant="rectangular" />
            </div>
        </div>
    );
};

// Page Header Skeleton
export const PageHeaderSkeleton = () => {
    return (
        <div className="mb-8 animate-fade-in">
            <Skeleton className="h-4 w-24 mb-4" variant="text" />
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" variant="text" />
                    <Skeleton className="h-4 w-96" variant="text" />
                </div>
                <Skeleton className="h-10 w-32" variant="rectangular" />
            </div>
        </div>
    );
};
