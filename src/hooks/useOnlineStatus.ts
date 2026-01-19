"use client";

import { useState, useEffect } from "react";

export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
};

// Offline queue for failed requests
interface QueuedRequest {
    id: string;
    url: string;
    method: string;
    body?: any;
    timestamp: number;
}

class OfflineQueue {
    private queue: QueuedRequest[] = [];
    private storageKey = "offline_request_queue";

    constructor() {
        this.loadQueue();
    }

    private loadQueue() {
        if (typeof window === "undefined") return;

        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.queue = JSON.parse(stored);
            }
        } catch (error) {
            console.error("Failed to load offline queue:", error);
        }
    }

    private saveQueue() {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
        } catch (error) {
            console.error("Failed to save offline queue:", error);
        }
    }

    add(url: string, method: string, body?: any) {
        const request: QueuedRequest = {
            id: Math.random().toString(36).substring(2, 9),
            url,
            method,
            body,
            timestamp: Date.now(),
        };

        this.queue.push(request);
        this.saveQueue();
        return request.id;
    }

    remove(id: string) {
        this.queue = this.queue.filter((req) => req.id !== id);
        this.saveQueue();
    }

    getAll(): QueuedRequest[] {
        return [...this.queue];
    }

    clear() {
        this.queue = [];
        this.saveQueue();
    }

    async processQueue() {
        const requests = this.getAll();
        const results = [];

        for (const request of requests) {
            try {
                const response = await fetch(request.url, {
                    method: request.method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: request.body ? JSON.stringify(request.body) : undefined,
                });

                if (response.ok) {
                    this.remove(request.id);
                    results.push({ id: request.id, success: true });
                } else {
                    results.push({ id: request.id, success: false, error: response.statusText });
                }
            } catch (error) {
                results.push({ id: request.id, success: false, error });
            }
        }

        return results;
    }
}

export const offlineQueue = new OfflineQueue();

// Hook to process queue when coming back online
export const useOfflineQueue = () => {
    const isOnline = useOnlineStatus();
    const [processing, setProcessing] = useState(false);
    const [queueSize, setQueueSize] = useState(0);

    useEffect(() => {
        setQueueSize(offlineQueue.getAll().length);
    }, []);

    useEffect(() => {
        if (isOnline && queueSize > 0 && !processing) {
            setProcessing(true);
            offlineQueue.processQueue().then((results) => {
                const successCount = results.filter((r) => r.success).length;
                console.log(`Processed ${successCount} of ${results.length} queued requests`);
                setQueueSize(offlineQueue.getAll().length);
                setProcessing(false);
            });
        }
    }, [isOnline, queueSize, processing]);

    return {
        isOnline,
        queueSize,
        processing,
        addToQueue: offlineQueue.add.bind(offlineQueue),
        clearQueue: offlineQueue.clear.bind(offlineQueue),
    };
};
