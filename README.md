# WasteFi Frontend

A Progressive Web Application for waste collection and financial inclusion in emerging markets.

## 🌍 Overview

WasteFi enables waste collectors to earn income through waste collection, integrated with Stellar blockchain payments and mobile money systems. Built with Next.js 16, TypeScript, and TailwindCSS.

**Key Features:**
- 📱 Progressive Web App (PWA) - installable on mobile devices
- 🌐 Offline-first architecture with IndexedDB
- 🌍 Multi-language support (English, Swahili, French)
- 🎨 Mobile-first responsive design
- 🔒 Secure authentication and payment processing
- 📊 Real-time analytics and monitoring
- 🎮 Gamification with achievements and leaderboards

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wastefi-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Tech Stack

### Core
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **PWA**: next-pwa with Service Workers

### State & Data
- **Global State**: Zustand
- **Server State**: TanStack React Query
- **Offline Storage**: IndexedDB (idb)
- **HTTP Client**: Axios

### UI & UX
- **Components**: Custom component library
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Maps**: Leaflet + react-leaflet
- **Camera**: react-webcam
- **i18n**: next-intl

## 📁 Project Structure

```
wastefi-frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (collector)/       # Collector dashboard
│   ├── (collection-point)/# Collection point dashboard
│   └── (admin)/           # Admin dashboard
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── navigation/       # Navigation components
│   ├── wallet/           # Wallet components
│   ├── submission/       # Waste submission
│   └── ...               # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── api/              # API client
│   ├── db/               # IndexedDB operations
│   ├── sync/             # Sync manager
│   └── hooks/            # Custom React hooks
├── store/                 # Zustand stores
├── types/                 # TypeScript definitions
├── i18n/                  # Translations
└── public/                # Static assets
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server (webpack mode)
npm run build            # Build for production
npm start                # Start production server

# Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types

# Performance
npm run build:analyze    # Analyze bundle size
npm run lighthouse       # Run Lighthouse audit
```

## 🌐 User Roles

### 👤 Collectors
- Submit waste with photos and material selection
- Track earnings and wallet balance
- Find nearby collection points
- View collection history
- Earn achievements and compete on leaderboards
- Cash out via mobile money, bank, or Stellar

### 🏪 Collection Points
- Verify and approve waste submissions
- Manage inventory and stock levels
- Process payments to collectors
- View analytics and performance metrics
- Track top collectors

### 👨‍💼 Administrators
- Monitor system health
- Manage users and KYC verification
- Detect and investigate fraud
- View platform-wide analytics

## 🌍 Internationalization

The app supports 3 languages:

- 🇬🇧 **English** (en) - Default
- 🇰🇪 **Kiswahili** (sw) - East Africa
- 🇫🇷 **Français** (fr) - West/Central Africa

Users can switch languages in the settings page.

## 📴 Offline Support

WasteFi works offline with:
- IndexedDB for local data storage
- Service Worker for asset caching
- Automatic background sync
- Offline indicators and queue management

Data syncs automatically when connection is restored.

## 🔒 Environment Variables

Create a `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true

# Optional: Analytics, Maps, Payments
# See .env.example for full list
```

See `.env.example` for all available variables.

## 📊 Performance

Target metrics:
- Lighthouse Score: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Bundle Size: Optimized with code splitting
- All routes: Static generation

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t wastefi-frontend .

# Run container
docker run -p 3000:3000 wastefi-frontend
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [Design System](./DESIGN_SYSTEM.md) - UI components and tokens
- [State Management](./STATE_MANAGEMENT.md) - Zustand stores and React Query
- [Offline Architecture](./OFFLINE_ARCHITECTURE.md) - IndexedDB and sync
- [Responsive Layout](./RESPONSIVE_LAYOUT.md) - Mobile-first patterns
- [Internationalization](./INTERNATIONALIZATION.md) - i18n setup
- [Performance](./PERFORMANCE.md) - Optimization techniques
- [Deployment](./DEPLOYMENT.md) - Production deployment guide
- [Project Summary](./PROJECT_SUMMARY.md) - Complete project overview

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

To Be Determined

## 🙏 Acknowledgments

Built to serve waste collectors in emerging markets and contribute to a circular economy.

## 📞 Support

For support, email support@wastefi.com or open an issue on GitHub.

---

**Status**: Production Ready 🚀  
**Version**: 1.0.0  
**Last Updated**: February 2024
