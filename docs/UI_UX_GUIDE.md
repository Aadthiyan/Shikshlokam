# UI/UX Best Practices Guide

## Overview

This guide outlines UI/UX best practices for DIET Training OS to ensure a professional, accessible, and user-friendly experience.

---

## Design System

### Colors

**Primary (Blue):** Professional, trustworthy
- Main: `#3b82f6`
- Use for: Primary actions, links, focus states

**Success (Green):** Positive feedback
- Main: `#22c55e`
- Use for: Success messages, completed states

**Warning (Amber):** Caution
- Main: `#f59e0b`
- Use for: Warnings, pending states

**Error (Red):** Errors and alerts
- Main: `#ef4444`
- Use for: Error messages, destructive actions

### Typography

**Font Family:** Inter (sans-serif)
- Clean, readable, professional
- Good for both headings and body text

**Font Sizes:**
- Headings: 24px - 48px
- Body: 16px
- Small text: 14px
- Tiny text: 12px

**Font Weights:**
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## Component Guidelines

### Buttons

**Primary Button:**
```tsx
<button className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90">
  Primary Action
</button>
```

**Secondary Button:**
```tsx
<button className="rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10">
  Secondary Action
</button>
```

**Destructive Button:**
```tsx
<button className="rounded-lg bg-error px-6 py-3 font-semibold text-white hover:bg-error/90">
  Delete
</button>
```

### Cards

```tsx
<div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
  {/* Card content */}
</div>
```

### Forms

**Input Field:**
```tsx
<input
  type="text"
  className="w-full rounded-lg border p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
  placeholder="Enter text..."
/>
```

**Label:**
```tsx
<label className="mb-2 block text-sm font-semibold">
  Field Label <span className="text-error">*</span>
</label>
```

---

## Loading States

### Page Loading

```tsx
import { PageLoader } from "@/components/LoadingComponents";

<PageLoader message="Loading data..." />
```

### Inline Loading

```tsx
import { InlineLoader } from "@/components/LoadingComponents";

<InlineLoader message="Generating plan..." />
```

### Skeleton Loading

```tsx
import { CardSkeleton } from "@/components/LoadingComponents";

<CardSkeleton />
```

---

## Error Handling

### Page Error

```tsx
import { PageError } from "@/components/ErrorComponents";

<PageError
  title="Failed to Load"
  message="We couldn't load this page. Please try again."
  onRetry={() => window.location.reload()}
/>
```

### Inline Error

```tsx
import { InlineError } from "@/components/ErrorComponents";

<InlineError message="Invalid input. Please check your data." />
```

### Empty State

```tsx
import { EmptyState } from "@/components/ErrorComponents";

<EmptyState
  icon="📭"
  title="No Plans Yet"
  message="Create your first training plan to get started."
  action={{
    label: "Create Plan",
    onClick: () => router.push("/plans/new")
  }}
/>
```

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Close dialog">
  <XIcon />
</button>
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use `tabIndex={0}` for custom interactive elements
- Implement focus styles (2px blue ring)

### Color Contrast

- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- Test with WebAIM Contrast Checker

### Screen Readers

```tsx
<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

---

## Responsive Design

### Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Mobile-First Approach

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

### Touch Targets

- Minimum 44x44px for touch targets
- Add padding to small icons

---

## Performance

### Code Splitting

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSpinner />,
});
```

### Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
/>
```

### Lazy Loading

```tsx
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./Component"));

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

---

## Workflow Optimization

### Minimize Clicks

**Before:** Home → Cohorts → Select → Generate → Configure → Submit
**After:** Home → Cohorts → Generate (auto-configure)

### Clear Navigation

```tsx
<nav className="flex items-center gap-2 text-sm text-muted-foreground">
  <Link href="/">Home</Link>
  <span>/</span>
  <Link href="/cohorts">Cohorts</Link>
  <span>/</span>
  <span className="text-foreground">Cohort Detail</span>
</nav>
```

### Progress Indicators

```tsx
<div className="mb-4">
  <div className="flex justify-between text-sm">
    <span>Generating plan...</span>
    <span>75%</span>
  </div>
  <div className="mt-2 h-2 rounded-full bg-muted">
    <div className="h-full w-3/4 rounded-full bg-primary transition-all" />
  </div>
</div>
```

---

## Helpful Messages

### Loading Messages

- "Generating AI training plan..."
- "Analyzing cohort data..."
- "Fetching feedback..."

### Success Messages

- "✅ Plan generated successfully!"
- "✅ Feedback submitted. Thank you!"
- "✅ Plan published and ready to use."

### Error Messages

- "⚠️ Failed to generate plan. Please try again."
- "⚠️ Invalid cohort data. Please check your input."
- "⚠️ Network error. Please check your connection."

---

## Checklist

### Before Deployment

- [ ] All pages have loading states
- [ ] All errors are handled gracefully
- [ ] All forms have validation
- [ ] All buttons have hover states
- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets are at least 44x44px
- [ ] Images have alt text
- [ ] Page load time < 3 seconds
- [ ] Mobile responsive
- [ ] Empty states implemented
- [ ] Success/error messages clear

---

## Testing

### Lighthouse Audit

Run Lighthouse in Chrome DevTools:
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 85

### Manual Testing

1. **Keyboard Navigation:** Tab through all pages
2. **Screen Reader:** Test with NVDA/JAWS
3. **Mobile:** Test on actual device
4. **Slow Network:** Test with throttling
5. **Error States:** Test with invalid data

---

## Resources

- **Design System:** `/src/config/design-system.ts`
- **Loading Components:** `/src/components/LoadingComponents.tsx`
- **Error Components:** `/src/components/ErrorComponents.tsx`
- **Tailwind Config:** `/tailwind.config.js`

---

*Last Updated: January 13, 2026*
*Version: 1.0*
