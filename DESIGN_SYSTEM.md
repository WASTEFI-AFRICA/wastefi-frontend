# WasteFi Design System

## Overview

The WasteFi design system provides a consistent, accessible, and mobile-first component library for the WasteFi application.

## Design Principles

1. **Mobile-First**: All components are optimized for mobile devices
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Performance**: Optimized for low-bandwidth environments
4. **Consistency**: Unified design language across all screens
5. **Simplicity**: Clear, intuitive interfaces for all user levels

## Color Palette

### Brand Colors
- **Primary**: `#10b981` (Emerald Green) - Represents growth and sustainability
- **Primary Dark**: `#059669` - Hover and active states
- **Primary Light**: `#34d399` - Backgrounds and accents

### Semantic Colors
- **Success**: `#10b981` - Confirmations, completed actions
- **Warning**: `#f59e0b` - Alerts, cautions
- **Error**: `#ef4444` - Errors, destructive actions
- **Info**: `#3b82f6` - Informational messages

### Neutrals
- **Background**: `#ffffff` (light) / `#0f172a` (dark)
- **Foreground**: `#0f172a` (light) / `#f1f5f9` (dark)
- **Muted**: `#f1f5f9` (light) / `#1e293b` (dark)
- **Border**: `#e2e8f0` (light) / `#334155` (dark)

## Typography

### Font Stack
- Sans: Geist Sans (fallback: system-ui, sans-serif)
- Mono: Geist Mono (fallback: monospace)

### Type Scale
| Class | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| `.heading-1` | 2.25rem (36px) | 700 | 1.2 | Page titles |
| `.heading-2` | 1.875rem (30px) | 700 | 1.25 | Section headers |
| `.heading-3` | 1.5rem (24px) | 600 | 1.3 | Subsection headers |
| `.heading-4` | 1.25rem (20px) | 600 | 1.4 | Card titles |
| `.body-large` | 1.125rem (18px) | 400 | 1.75 | Important text |
| `.body-regular` | 1rem (16px) | 400 | 1.5 | Default body text |
| `.body-small` | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| `.caption` | 0.75rem (12px) | 400 | 1.25 | Labels, captions |

## Spacing Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `xs` | 0.25rem (4px) | Tight spacing |
| `sm` | 0.5rem (8px) | Small gaps |
| `md` | 1rem (16px) | Standard spacing |
| `lg` | 1.5rem (24px) | Section spacing |
| `xl` | 2rem (32px) | Large gaps |
| `2xl` | 3rem (48px) | Major sections |

## Components

### Button

Variants:
- `primary` - Main actions
- `secondary` - Secondary actions
- `outline` - Tertiary actions
- `ghost` - Subtle actions
- `success` - Confirmations
- `destructive` - Delete/remove actions

Sizes: `sm`, `md`, `lg`, `xl`, `icon`

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md">Submit</Button>
<Button variant="outline" loading>Processing...</Button>
```

### Card

Container component for grouped content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Input

Form input with label and error handling.

```tsx
import { Input } from "@/components/ui";

<Input 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
  error="Invalid email"
/>
```

### Badge

Status indicators and labels.

Variants: `default`, `secondary`, `success`, `warning`, `error`, `outline`

```tsx
import { Badge } from "@/components/ui";

<Badge variant="success">Active</Badge>
```

## Utilities

### Class Name Merging

Use the `cn()` utility to merge Tailwind classes:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```

### Formatting Helpers

```tsx
import { formatCurrency, formatDate, formatWeight } from "@/lib/utils";

formatCurrency(125.50) // "$125.50"
formatDate(new Date()) // "Sep 15, 2026"
formatWeight(1.5) // "1.50kg"
```

## Responsive Design

Mobile breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Use Tailwind's responsive prefixes:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Dark Mode

Automatic dark mode support based on system preferences. Uses CSS custom properties for seamless switching.

## Accessibility

- All interactive elements have focus states
- Color contrast ratios meet WCAG AA standards
- Semantic HTML throughout
- Screen reader friendly labels
- Keyboard navigation support

## Animation

Available animations:
- `.animate-fade-in` - Fade in content
- `.animate-slide-up` - Slide up with fade

## Usage Guidelines

1. **Consistency**: Use design tokens (colors, spacing) instead of arbitrary values
2. **Hierarchy**: Maintain clear visual hierarchy with typography scale
3. **Feedback**: Provide visual feedback for all interactions (hover, active, loading)
4. **Simplicity**: Avoid overusing colors and effects
5. **Mobile**: Always test on mobile devices first

## Future Components

Planned for upcoming commits:
- Modal/Dialog
- Toast notifications
- Form components (Select, Checkbox, Radio)
- Navigation components
- Loading states
- Empty states
