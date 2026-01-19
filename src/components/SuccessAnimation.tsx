"use client";

import { useEffect } from "react";

interface SuccessAnimationProps {
    show: boolean;
    message: string;
    onClose?: () => void;
}

export default function SuccessAnimation({ show, message, onClose }: SuccessAnimationProps) {
    useEffect(() => {
        if (show && typeof window !== "undefined") {
            // Trigger confetti
            import("canvas-confetti").then((confetti) => {
                confetti.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            });

            // Auto-close after 3 seconds
            if (onClose) {
                const timer = setTimeout(onClose, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="animate-scale-in rounded-lg bg-card p-8 shadow-2xl border border-success">
                <div className="flex flex-col items-center gap-4">
                    {/* Success Checkmark */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 animate-bounce">
                        <svg
                            className="h-12 w-12 text-success"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    {/* Success Message */}
                    <div className="text-center">
                        <h3 className="mb-2 text-2xl font-bold text-success">Success!</h3>
                        <p className="text-muted-foreground">{message}</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
