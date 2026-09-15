# WasteFi Frontend

**Tagline:** "Financial Inclusion Through Waste Collection - Powered by Open Material Standards"

## Overview

WasteFi is a mobile-first Progressive Web Application (PWA) designed to enable waste collectors in emerging markets to earn income through waste collection, integrated with Stellar blockchain payments and mobile money systems.

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **PWA:** next-pwa
- **State Management:** TBD (Zustand/Redux)
- **Testing:** TBD (Playwright for E2E)

## Project Structure

```
wastefi-frontend/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utilities and helpers
├── public/                 # Static assets
│   ├── icons/             # PWA icons
│   └── manifest.json      # PWA manifest
├── styles/                # Global styles
└── types/                 # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
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

## PWA Features

- **Offline-first architecture** with service workers
- **Installable** on mobile devices
- **Fast loading** with optimized assets
- **Responsive design** for all screen sizes

## Development Roadmap

See the full commit plan in the project documentation:

- Phase 1: Setup (Commits 1-5) ✅ Commit 1 completed
- Phase 2: Collector Mobile App (Commits 6-12)
- Phase 3: Collection Point Dashboard (Commits 13-17)
- Phase 4: Admin & Monitoring (Commits 18-22)
- Phase 5: Polish & Optimization (Commits 23-25)

## License

TBD

## Contributing

TBD
