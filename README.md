# WasteFi Frontend

**Tagline:** "Financial Inclusion Through Waste Collection - Powered by Open Material Standards"

## Overview

WasteFi is a mobile-first Progressive Web Application (PWA) designed to enable waste collectors in emerging markets to earn income through waste collection, integrated with Stellar blockchain payments and mobile money systems.

## 🎉 Phase 1 Complete!

**Setup phase completed with 5 commits:**
- ✅ Next.js + TypeScript + PWA configuration
- ✅ Design system with component library
- ✅ State management (Zustand + React Query)
- ✅ Offline-first architecture (IndexedDB + Service Worker)
- ✅ Responsive layout with mobile-first navigation

See [PROGRESS.md](./PROGRESS.md) for detailed completion status.

## Tech Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4
- **PWA:** next-pwa

### State Management
- **Global State:** Zustand (lightweight, performant)
- **Server State:** TanStack React Query (caching, sync)
- **Offline Storage:** IndexedDB via idb library

### UI & Components
- **Component System:** Custom component library
- **Icons:** Lucide React
- **Variants:** class-variance-authority
- **Utilities:** clsx, tailwind-merge

### API & Data
- **HTTP Client:** Axios with interceptors
- **Type Safety:** Comprehensive TypeScript definitions

## Project Structure

```
wastefi-frontend/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes
│   ├── (collector)/         # Collector-specific routes
│   ├── (collection-point)/  # Collection point routes
│   ├── (admin)/             # Admin routes
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   ├── ui/                  # UI components (Button, Card, etc.)
│   ├── navigation/          # Navigation components
│   ├── layout/              # Layout components
│   ├── offline/             # Offline indicators
│   └── providers/           # Context providers
├── lib/                     # Utilities and helpers
│   ├── api/                 # API client configuration
│   ├── db/                  # IndexedDB operations
│   ├── sync/                # Sync manager
│   ├── hooks/               # Custom React hooks
│   └── utils.ts             # Utility functions
├── store/                   # Zustand stores
│   ├── authStore.ts         # Authentication state
│   ├── walletStore.ts       # Wallet state
│   └── uiStore.ts           # UI state (modals, toasts)
├── types/                   # TypeScript type definitions
│   └── api.ts               # API types
├── public/                  # Static assets
│   ├── icons/               # PWA icons
│   └── manifest.json        # PWA manifest
└── *.md                     # Documentation files
```

## Documentation

Comprehensive guides for all major features:

1. **[PROGRESS.md](./PROGRESS.md)** - Development progress and status
2. **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design tokens and component usage
3. **[STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)** - State architecture and patterns
4. **[OFFLINE_ARCHITECTURE.md](./OFFLINE_ARCHITECTURE.md)** - Offline-first implementation
5. **[RESPONSIVE_LAYOUT.md](./RESPONSIVE_LAYOUT.md)** - Responsive design patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Features Implemented

### ✅ Core Infrastructure
- Progressive Web App (PWA) with offline support
- Service Worker with intelligent caching
- IndexedDB for offline data persistence
- Automatic background synchronization

### ✅ Design System
- Comprehensive color palette (brand, semantic, neutrals)
- Typography scale (6 levels)
- Component library (Button, Card, Input, Badge)
- Dark mode support
- Responsive utilities

### ✅ Navigation
- Bottom navigation for mobile (4 tabs)
- Persistent sidebar for desktop
- Drawer sidebar for mobile
- Top bar with sync status
- Active route highlighting

### ✅ State Management
- Authentication state (Zustand)
- Wallet state (Zustand)
- UI state for modals/toasts (Zustand)
- Server state caching (React Query)
- Offline queue management

### ✅ Offline Support
- Submissions saved offline
- Automatic sync when online
- Retry logic (max 3 attempts)
- Sync queue with priority
- Online/offline indicators

### ✅ Layouts & Routing
- App Router with route groups
- Auth layout (centered)
- Collector layout (with navigation)
- Collection point layout
- Admin layout
- Responsive containers

## Development Roadmap

### Phase 1: Setup ✅ (Commits 1-5) - COMPLETED
- [x] Initialize Next.js with TypeScript and PWA
- [x] Setup TailwindCSS and component library
- [x] Configure routing and state management
- [x] Add offline-first architecture
- [x] Implement responsive layout

### Phase 2: Collector Mobile App (Commits 6-12)
- [ ] Onboarding flow and registration
- [ ] Wallet dashboard
- [ ] Waste submission form with camera
- [ ] Collection point finder with map
- [ ] QR code scanner
- [ ] Mobile money cashout
- [ ] Offline sync enhancements

### Phase 3: Collection Point Dashboard (Commits 13-17)
- [ ] Collection point admin login
- [ ] Waste verification interface
- [ ] Inventory management
- [ ] Payment processing
- [ ] Analytics dashboard

### Phase 4: Admin & Monitoring (Commits 18-22)
- [ ] Super admin dashboard
- [ ] User management and KYC
- [ ] Fraud detection
- [ ] Analytics and impact visualization
- [ ] RecycleGraph material passport viewer

### Phase 5: Polish & Optimization (Commits 23-25)
- [ ] Internationalization (i18n)
- [ ] Performance optimization
- [ ] E2E testing with Playwright

## PWA Features

- **Offline-first architecture** with service workers
- **Installable** on mobile devices and desktop
- **Fast loading** with optimized assets and caching
- **Responsive design** for all screen sizes
- **Background sync** for offline submissions
- **Push notifications** (future enhancement)

## Environment Variables

Create `.env.local` based on `.env.example`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# App Configuration
NEXT_PUBLIC_APP_NAME=WasteFi
NEXT_PUBLIC_APP_VERSION=0.1.0
```

## Scripts

```bash
# Development server (webpack mode for PWA)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- **Lighthouse Score Target:** 90+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Optimized for:** Low-bandwidth environments

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

TBD

## Acknowledgments

Built for emerging market waste collectors with love ♻️
