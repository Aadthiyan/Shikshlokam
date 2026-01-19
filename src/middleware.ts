import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes (accessible without authentication)
// Clerk handles sign-in/sign-up with its own hosted pages
const isPublicRoute = createRouteMatcher([
    "/",           // Public landing page
    "/api/webhooks(.*)", // Webhook endpoints
]);

// Define public API routes (if any)
const isPublicApiRoute = createRouteMatcher([
    "/api/health", // Health check endpoint
]);

export default clerkMiddleware(async (auth, req) => {
    // Allow public routes
    if (isPublicRoute(req) || isPublicApiRoute(req)) {
        return;
    }

    // Protect all other routes
    await auth.protect();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
