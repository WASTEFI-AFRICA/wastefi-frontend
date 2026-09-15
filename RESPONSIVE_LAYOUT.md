# Responsive Layout System

## Overview

WasteFi implements a mobile-first responsive layout system optimized for various screen sizes and devices. The navigation adapts based on viewport width to provide the best user experience.

## Navigation System

### Mobile (< 768px)

**Bottom Navigation Bar**
- Fixed position at bottom of screen
- 4 primary actions: Home, Submit, Wallet, Profile
- Icon + label for each action
- Active state highlighting
- Always visible for quick access

**Top Bar**
- Logo and app branding
- Sync status indicator
- Notifications bell
- Menu button (opens sidebar drawer)

**Sidebar Drawer**
- Slides in from left
- Full navigation menu
- User profile section
- Logout button
- Close button (X)
- Dark overlay backdrop

### Desktop (≥ 768px)

**Persistent Sidebar**
- Always visible on left
- Full navigation menu
- User profile at top
- Scrollable content
- Logout at bottom

**Top Bar**
- Logo and title
- Sync status
- Notifications
- No menu button (sidebar always visible)

**No Bottom Navigation**
- Hidden on desktop
- Navigation through sidebar instead

## Component Architecture

### Navigation Components

#### BottomNav (`components/navigation/BottomNav.tsx`)

Mobile-only bottom navigation bar.

```tsx
import { BottomNav } from "@/components/navigation/BottomNav";

// Already included in collector layout
<BottomNav />
```

**Features:**
- Active route highlighting
- Icon + label format
- Responsive tap targets (min 44x44px)
- Semantic HTML with proper links
- Hidden on desktop (md:hidden)

#### TopBar (`components/navigation/TopBar.tsx`)

Header bar with branding and actions.

```tsx
import { TopBar } from "@/components/navigation/TopBar";

<TopBar title="Dashboard" showMenu={true} />
```

**Props:**
- `title` (optional): Page title or app name
- `showMenu` (optional): Show/hide menu button (default: true)

**Features:**
- Sticky positioning
- Sync status badge
- Notification indicator
- Responsive layout

#### Sidebar (`components/navigation/Sidebar.tsx`)

Sidebar navigation for all routes.

```tsx
import { Sidebar } from "@/components/navigation/Sidebar";

<Sidebar />
```

**Features:**
- Drawer mode on mobile
- Persistent mode on desktop
- User profile section
- Active route highlighting
- Badge support for notifications
- Smooth transitions

**Behavior:**
- Mobile: Toggles with menu button, closes on route change
- Desktop: Always visible, relative positioning
- Uses `useUIStore` for open/close state

### Layout Components

#### Container (`components/layout/Container.tsx`)

Responsive container with max-width constraints.

```tsx
import { Container } from "@/components/layout/Container";

<Container size="xl" noPadding={false}>
  <YourContent />
</Container>
```

**Props:**
- `size`: "sm" | "md" | "lg" | "xl" | "full" (default: "xl")
- `noPadding`: Remove horizontal padding (default: false)
- `className`: Additional CSS classes

**Sizes:**
- `sm`: max-w-2xl (672px)
- `md`: max-w-4xl (896px)
- `lg`: max-w-6xl (1152px)
- `xl`: max-w-7xl (1280px)
- `full`: max-w-full (100%)

**Responsive Padding:**
- Mobile: px-4 (16px)
- Tablet: px-6 (24px)
- Desktop: px-8 (32px)

#### PageHeader (`components/layout/PageHeader.tsx`)

Consistent page header with title and actions.

```tsx
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui";

<PageHeader
  title="Dashboard"
  description="Track your collections and earnings"
  actions={
    <Button>
      <Plus className="w-5 h-5 mr-2" />
      New Submission
    </Button>
  }
/>
```

**Props:**
- `title` (required): Page title
- `description` (optional): Page description
- `actions` (optional): Action buttons (right side)
- `className` (optional): Additional CSS classes

**Features:**
- Responsive flex layout
- Title truncation on overflow
- Actions hidden on mobile if needed

#### Section (`components/layout/Section.tsx`)

Consistent section spacing.

```tsx
import { Section } from "@/components/layout/Section";

<Section spacing="md">
  <YourContent />
</Section>
```

**Props:**
- `spacing`: "sm" | "md" | "lg" (default: "md")
- `className`: Additional CSS classes

**Spacing:**
- `sm`: py-4 (16px)
- `md`: py-6 (24px)
- `lg`: py-8 (32px)

## Layout Structure

### Collector Layout

The collector layout wraps all collector pages:

```tsx
// app/(collector)/layout.tsx
<div className="min-h-screen">
  <div className="md:flex">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <TopBar />
      <main className="flex-1 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  </div>
  <BottomNav />
</div>
```

**Layout Breakdown:**
1. Sidebar: Drawer (mobile) / Persistent (desktop)
2. Main content area: Flexible, takes remaining space
3. TopBar: Sticky header
4. Page content: Scrollable, with bottom padding for nav
5. BottomNav: Fixed at bottom (mobile only)

### Page Structure

Recommended structure for collector pages:

```tsx
import { Container, PageHeader, Section } from "@/components/layout";
import { Card } from "@/components/ui";

export default function MyPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Page Title"
          description="Page description"
          actions={<Button>Action</Button>}
        />
      </Section>

      <Section spacing="sm">
        <Card>
          {/* Page content */}
        </Card>
      </Section>

      <Section spacing="sm">
        {/* More content */}
      </Section>
    </Container>
  );
}
```

## Breakpoints

WasteFi uses Tailwind's default breakpoints:

| Breakpoint | Min Width | Device        |
|------------|-----------|---------------|
| `sm`       | 640px     | Large phone   |
| `md`       | 768px     | Tablet        |
| `lg`       | 1024px    | Desktop       |
| `xl`       | 1280px    | Large desktop |

### Usage:

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  // 1 column on mobile, 2 on tablet, 3 on desktop
</div>

// Hide on mobile
<Button className="hidden md:flex">
  Desktop Only
</Button>

// Show only on mobile
<Button className="md:hidden">
  Mobile Only
</Button>
```

## State Management

Navigation state is managed through `useUIStore`:

```tsx
import { useUIStore } from "@/store/uiStore";

const { isSidebarOpen, toggleSidebar } = useUIStore();

// Open sidebar
toggleSidebar();

// Check if open
if (isSidebarOpen) {
  // Sidebar is open
}
```

## Responsive Patterns

### Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id}>{/* content */}</Card>
  ))}
</div>
```

### Flex Layouts

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Text Sizing

```tsx
// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

### Spacing

```tsx
// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>

// Responsive margin
<div className="mt-4 md:mt-6 lg:mt-8">
  Content
</div>
```

## Touch Targets

All interactive elements follow mobile touch target guidelines:

- **Minimum size**: 44x44px (iOS) / 48x48px (Android)
- **Spacing**: 8px minimum between targets
- **Feedback**: Visual feedback on tap/hover

Example:
```tsx
// Button with proper touch target
<Button size="lg">  // h-11 (44px)
  Action
</Button>

// Icon button
<Button size="icon">  // h-10 w-10 (40px+)
  <Icon />
</Button>
```

## Accessibility

### Keyboard Navigation

- All navigation items are keyboard accessible
- Tab order follows visual order
- Sidebar can be closed with Escape key

### Screen Readers

- Semantic HTML (`<nav>`, `<main>`, `<header>`)
- ARIA labels for icon-only buttons
- Skip links for main content

### Focus Management

- Visible focus indicators
- Focus trapped in mobile sidebar when open
- Focus returned to menu button when closed

## Performance

### Code Splitting

Each page is automatically code-split by Next.js.

### Client Components

- Navigation components are client components ("use client")
- Layout components are server components (default)
- Minimizes client-side JavaScript

### Lazy Loading

Images and heavy components should use lazy loading:

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
});
```

## Testing Responsive Layout

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device preset or custom dimensions
4. Test navigation at different sizes

### Test Checklist

- [ ] Bottom nav visible on mobile (<768px)
- [ ] Bottom nav hidden on desktop (≥768px)
- [ ] Sidebar drawer works on mobile
- [ ] Sidebar persistent on desktop
- [ ] All touch targets ≥44px
- [ ] No horizontal scroll on any device
- [ ] Content readable without zooming
- [ ] Actions accessible on all devices

## Best Practices

1. **Mobile-First**: Design for mobile, enhance for desktop
2. **Progressive Enhancement**: Core functionality works everywhere
3. **Touch-Friendly**: Large tap targets, adequate spacing
4. **Fast Navigation**: Bottom nav for quick access
5. **Consistent Patterns**: Use provided layout components
6. **Test on Real Devices**: Emulators don't capture everything

## Future Enhancements

- [ ] Tablet-optimized layouts
- [ ] Landscape mode optimizations
- [ ] Gesture-based navigation
- [ ] Adaptive UI based on connection speed
- [ ] Platform-specific navigation patterns
