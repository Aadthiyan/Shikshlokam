# Error Handling & Feedback - Usage Guide

## 🎯 Overview

This guide shows how to use the comprehensive error handling and feedback system.

---

## 📋 **1. Toast Notifications**

### Setup (in layout.tsx or _app.tsx):

```tsx
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ui/toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Usage in Components:

```tsx
import { useToast } from "@/contexts/ToastContext";

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Success!", "Your changes have been saved.");
  };

  const handleError = () => {
    toast.error("Error", "Failed to save changes. Please try again.");
  };

  const handleWarning = () => {
    toast.warning("Warning", "This action cannot be undone.");
  };

  const handleInfo = () => {
    toast.info("Info", "New features are available!");
  };

  // Custom duration (default is 5000ms)
  const handleCustom = () => {
    toast.success("Quick message", undefined, 2000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

---

## 🚨 **2. Error Handling**

### Using Custom Error Types:

```tsx
import {
  NetworkError,
  ValidationError,
  AuthenticationError,
  getUserFriendlyMessage,
  logError,
} from "@/lib/errors";
import { useToast } from "@/contexts/ToastContext";

function MyComponent() {
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      // Validate data
      if (!data.name) {
        throw new ValidationError("Name is required", {
          name: "This field is required",
        });
      }

      // Make API call
      const response = await fetch("/api/data", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new NetworkError("Failed to save data");
      }

      toast.success("Success!", "Data saved successfully.");
    } catch (error) {
      // Log error
      logError(error, { component: "MyComponent", action: "submit" });

      // Show user-friendly message
      const message = getUserFriendlyMessage(error);
      toast.error("Error", message);
    }
  };
}
```

### Using Error Boundary:

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

// With custom fallback
function AppWithCustomFallback() {
  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>Oops! Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      }
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Retry Failed Requests:

```tsx
import { retryAsync } from "@/lib/errors";

async function fetchData() {
  // Will retry up to 3 times with exponential backoff
  const data = await retryAsync(
    async () => {
      const response = await fetch("/api/data");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    3, // max retries
    1000 // initial delay (ms)
  );

  return data;
}
```

---

## 📶 **3. Offline Support**

### Setup Offline Indicator (in layout.tsx):

```tsx
import { OfflineIndicator } from "@/components/ui/offline-indicator";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <OfflineIndicator />
      </body>
    </html>
  );
}
```

### Using Online Status Hook:

```tsx
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

function MyComponent() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {isOnline ? (
        <p>You are online</p>
      ) : (
        <p>You are offline. Changes will be saved when you reconnect.</p>
      )}
    </div>
  );
}
```

### Using Offline Queue:

```tsx
import { useOfflineQueue } from "@/hooks/useOnlineStatus";
import { useToast } from "@/contexts/ToastContext";

function MyComponent() {
  const { isOnline, queueSize, addToQueue } = useOfflineQueue();
  const toast = useToast();

  const handleSubmit = async (data) => {
    if (!isOnline) {
      // Add to queue for later
      addToQueue("/api/data", "POST", data);
      toast.info("Offline", "Your changes will be saved when you reconnect.");
      return;
    }

    try {
      const response = await fetch("/api/data", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Success!", "Data saved successfully.");
    } catch (error) {
      // If network error, add to queue
      addToQueue("/api/data", "POST", data);
      toast.warning("Queued", "Request will be retried when online.");
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
      {queueSize > 0 && <p>{queueSize} pending changes</p>}
    </div>
  );
}
```

---

## 🎨 **4. Complete Example**

```tsx
"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  ValidationError,
  getUserFriendlyMessage,
  logError,
  retryAsync,
} from "@/lib/errors";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function MyForm() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const isOnline = useOnlineStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check online status
    if (!isOnline) {
      toast.warning("Offline", "Please connect to the internet to submit.");
      return;
    }

    setLoading(true);

    try {
      // Validate
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name") as string;
      
      if (!name) {
        throw new ValidationError("Name is required");
      }

      // Submit with retry
      await retryAsync(async () => {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit");
        }

        return response.json();
      });

      // Success
      toast.success("Success!", "Form submitted successfully.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      // Log error
      logError(error, { component: "MyForm", action: "submit" });

      // Show user-friendly message
      const message = getUserFriendlyMessage(error);
      toast.error("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <button type="submit" disabled={loading || !isOnline}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <MyForm />
    </ErrorBoundary>
  );
}
```

---

## 🎯 **Best Practices**

1. **Always use try-catch** for async operations
2. **Log errors** for debugging and monitoring
3. **Show user-friendly messages** instead of technical errors
4. **Handle offline scenarios** gracefully
5. **Retry transient failures** automatically
6. **Use error boundaries** to catch React errors
7. **Provide clear actions** (retry, go home, contact support)

---

## 📊 **Error Types Reference**

| Error Type | Use Case | Status Code |
|------------|----------|-------------|
| `NetworkError` | Network/connection issues | 0 |
| `ValidationError` | Invalid user input | 400 |
| `AuthenticationError` | Not logged in | 401 |
| `AuthorizationError` | No permission | 403 |
| `NotFoundError` | Resource not found | 404 |
| `ServerError` | Server-side error | 500 |

---

## 🎨 **Toast Types**

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| `success` | Green | ✓ | Successful operations |
| `error` | Red | ✕ | Errors and failures |
| `warning` | Yellow | ⚠ | Warnings and cautions |
| `info` | Blue | ℹ | Informational messages |
