"use client";

import React from "react";
import { useOnlineStatus, useOfflineQueue } from "@/hooks/useOnlineStatus";

export const OfflineIndicator = () => {
    const isOnline = useOnlineStatus();
    const { queueSize, processing } = useOfflineQueue();

    if (isOnline && queueSize === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
            {!isOnline ? (
                <div className="flex items-center gap-3 rounded-lg border border-yellow-600 bg-yellow-500 px-4 py-3 shadow-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                        <svg
                            className="h-5 w-5 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">You're offline</p>
                        <p className="text-xs text-white/90">
                            Changes will be saved when you reconnect
                        </p>
                    </div>
                </div>
            ) : processing ? (
                <div className="flex items-center gap-3 rounded-lg border border-blue-600 bg-blue-500 px-4 py-3 shadow-lg">
                    <div className="flex h-8 w-8 items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Syncing...</p>
                        <p className="text-xs text-white/90">
                            Processing {queueSize} pending {queueSize === 1 ? "change" : "changes"}
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
