import React from "react";

// Linear Progress Bar
export const LinearProgress = ({
    value = 0,
    max = 100,
    className = "",
    showLabel = false,
    color = "primary",
    size = "md"
}: {
    value?: number;
    max?: number;
    className?: string;
    showLabel?: boolean;
    color?: "primary" | "secondary" | "success" | "warning" | "error";
    size?: "sm" | "md" | "lg";
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colorClasses = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500"
    };

    const sizeClasses = {
        sm: "h-1",
        md: "h-2",
        lg: "h-3"
    };

    return (
        <div className={`w-full ${className}`}>
            <div className={`overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${sizeClasses[size]}`}>
                <div
                    className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="mt-1 text-xs text-muted-foreground text-right">
                    {Math.round(percentage)}%
                </div>
            )}
        </div>
    );
};

// Circular Progress
export const CircularProgress = ({
    value = 0,
    max = 100,
    size = 64,
    strokeWidth = 4,
    color = "primary",
    showLabel = true
}: {
    value?: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: "primary" | "secondary" | "success" | "warning" | "error";
    showLabel?: boolean;
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
        primary: "stroke-primary",
        secondary: "stroke-secondary",
        success: "stroke-green-500",
        warning: "stroke-yellow-500",
        error: "stroke-red-500"
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`${colorClasses[color]} transition-all duration-500 ease-out`}
                />
            </svg>
            {showLabel && (
                <div className="absolute text-sm font-semibold">
                    {Math.round(percentage)}%
                </div>
            )}
        </div>
    );
};

// Indeterminate Spinner
export const Spinner = ({
    size = "md",
    color = "primary"
}: {
    size?: "sm" | "md" | "lg" | "xl";
    color?: "primary" | "secondary" | "white";
}) => {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-4",
        xl: "h-16 w-16 border-4"
    };

    const colorClasses = {
        primary: "border-primary border-t-transparent",
        secondary: "border-secondary border-t-transparent",
        white: "border-white border-t-transparent"
    };

    return (
        <div
            className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        />
    );
};

// Dots Loader
export const DotsLoader = ({
    size = "md",
    color = "primary"
}: {
    size?: "sm" | "md" | "lg";
    color?: "primary" | "secondary" | "white";
}) => {
    const sizeClasses = {
        sm: "h-1.5 w-1.5",
        md: "h-2.5 w-2.5",
        lg: "h-3.5 w-3.5"
    };

    const colorClasses = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        white: "bg-white"
    };

    return (
        <div className="flex items-center gap-1">
            <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: "0ms" }} />
            <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: "150ms" }} />
            <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: "300ms" }} />
        </div>
    );
};

// Step Progress
export const StepProgress = ({
    steps,
    currentStep
}: {
    steps: string[];
    currentStep: number;
}) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 ${index < currentStep
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : index === currentStep
                                            ? "border-primary bg-background text-primary"
                                            : "border-gray-300 bg-background text-gray-400"
                                    }`}
                            >
                                {index < currentStep ? "✓" : index + 1}
                            </div>
                            <div className={`mt-2 text-xs font-medium ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                                {step}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-2 bg-gray-300">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: index < currentStep ? "100%" : "0%" }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// Loading Overlay
export const LoadingOverlay = ({
    message = "Loading...",
    show = true
}: {
    message?: string;
    show?: boolean;
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="rounded-lg bg-white dark:bg-gray-800 p-8 shadow-2xl">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-lg font-semibold">{message}</p>
                </div>
            </div>
        </div>
    );
};

// Progress Bar with Steps
export const ProgressWithSteps = ({
    steps,
    currentStep,
    showPercentage = true
}: {
    steps: number;
    currentStep: number;
    showPercentage?: boolean;
}) => {
    const percentage = ((currentStep - 1) / (steps - 1)) * 100;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium">Step {currentStep} of {steps}</span>
                {showPercentage && <span className="text-muted-foreground">{Math.round(percentage)}%</span>}
            </div>
            <LinearProgress value={currentStep - 1} max={steps - 1} />
        </div>
    );
};
