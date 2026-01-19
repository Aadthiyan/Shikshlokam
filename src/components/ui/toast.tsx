"use client";

import React, { useEffect } from "react";
import { useToast, Toast as ToastType } from "@/contexts/ToastContext";

const Toast = ({ toast, onClose }: { toast: ToastType; onClose: () => void }) => {
    const icons = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
    };

    const colors = {
        success: "bg-green-500 border-green-600",
        error: "bg-red-500 border-red-600",
        warning: "bg-yellow-500 border-yellow-600",
        info: "bg-blue-500 border-blue-600",
    };

    useEffect(() => {
        const duration = toast.duration || 5000;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    return (
        <div
            className={`${colors[toast.type]} pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-l-4 shadow-lg animate-slide-down`}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-bold">
                            {icons[toast.type]}
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-semibold text-white">{toast.title}</p>
                        {toast.message && (
                            <p className="mt-1 text-sm text-white/90">{toast.message}</p>
                        )}
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="inline-flex rounded-md text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-white/20">
                <div
                    className="h-full bg-white/50 transition-all"
                    style={{
                        animation: `progress ${toast.duration || 5000}ms linear`,
                    }}
                />
            </div>
        </div>
    );
};

export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-start gap-4 p-6 sm:p-6"
        >
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

// Add progress animation to globals.css
const style = `
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`;

if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = style;
    document.head.appendChild(styleSheet);
}
