// Error types
export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public details?: any
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class NetworkError extends AppError {
    constructor(message: string = "Network error. Please check your connection.") {
        super(message, "NETWORK_ERROR", 0);
        this.name = "NetworkError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public fields?: Record<string, string>) {
        super(message, "VALIDATION_ERROR", 400);
        this.name = "ValidationError";
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication required. Please log in.") {
        super(message, "AUTH_ERROR", 401);
        this.name = "AuthenticationError";
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = "You don't have permission to perform this action.") {
        super(message, "AUTHORIZATION_ERROR", 403);
        this.name = "AuthorizationError";
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "The requested resource was not found.") {
        super(message, "NOT_FOUND", 404);
        this.name = "NotFoundError";
    }
}

export class ServerError extends AppError {
    constructor(message: string = "An unexpected error occurred. Please try again.") {
        super(message, "SERVER_ERROR", 500);
        this.name = "ServerError";
    }
}

// Error message formatter
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AppError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "An unexpected error occurred. Please try again.";
};

// User-friendly error messages
export const getUserFriendlyMessage = (error: unknown): string => {
    if (error instanceof NetworkError) {
        return "Unable to connect. Please check your internet connection and try again.";
    }

    if (error instanceof ValidationError) {
        return error.message || "Please check your input and try again.";
    }

    if (error instanceof AuthenticationError) {
        return "Your session has expired. Please log in again.";
    }

    if (error instanceof AuthorizationError) {
        return "You don't have permission to perform this action. Please contact an administrator.";
    }

    if (error instanceof NotFoundError) {
        return "The item you're looking for doesn't exist or has been removed.";
    }

    if (error instanceof ServerError) {
        return "Something went wrong on our end. Our team has been notified. Please try again later.";
    }

    if (error instanceof Error) {
        // Check for common error patterns
        if (error.message.includes("fetch")) {
            return "Unable to load data. Please check your connection and try again.";
        }
        if (error.message.includes("timeout")) {
            return "The request took too long. Please try again.";
        }
        return error.message;
    }

    return "An unexpected error occurred. Please try again.";
};

// HTTP status code to error
export const httpStatusToError = (status: number, message?: string): AppError => {
    switch (status) {
        case 400:
            return new ValidationError(message || "Invalid request");
        case 401:
            return new AuthenticationError(message);
        case 403:
            return new AuthorizationError(message);
        case 404:
            return new NotFoundError(message);
        case 500:
        case 502:
        case 503:
            return new ServerError(message);
        default:
            return new AppError(message || "An error occurred", undefined, status);
    }
};

// API error handler
export const handleApiError = async (response: Response): Promise<never> => {
    let errorMessage = "An error occurred";

    try {
        const data = await response.json();
        errorMessage = data.error || data.message || errorMessage;
    } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
    }

    throw httpStatusToError(response.status, errorMessage);
};

// Retry logic for failed requests
export const retryAsync = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: unknown;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry on validation or auth errors
            if (
                error instanceof ValidationError ||
                error instanceof AuthenticationError ||
                error instanceof AuthorizationError
            ) {
                throw error;
            }

            // Wait before retrying
            if (i < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    throw lastError;
};

// Error logger (can be extended to send to monitoring service)
export const logError = (error: unknown, context?: Record<string, any>) => {
    console.error("Error:", {
        error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
        } : error,
        context,
        timestamp: new Date().toISOString(),
    });

    // In production, send to error monitoring service (e.g., Sentry)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { extra: context });
    // }
};
