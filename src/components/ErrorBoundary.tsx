"use client";

import React, { Component, ReactNode } from "react";
import { logError } from "@/lib/errors";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        logError(error, {
            componentStack: errorInfo.componentStack,
            errorBoundary: true,
        });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-screen items-center justify-center bg-background p-8">
                    <div className="max-w-md text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <svg
                                    className="h-8 w-8 text-red-600 dark:text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
                        <p className="mb-6 text-muted-foreground">
                            We're sorry, but something unexpected happened. Our team has been notified.
                        </p>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/10 p-4 text-left">
                                <p className="mb-2 text-sm font-semibold text-red-800 dark:text-red-400">
                                    Error Details (Development Only):
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300 font-mono">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="rounded-lg border px-6 py-3 font-semibold hover:bg-muted transition-smooth"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
