# Deployment Guide

Complete guide for deploying WasteFi to production.

## Table of Contents

1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables](#environment-variables)
3. [Deployment Platforms](#deployment-platforms)
4. [Build and Deployment](#build-and-deployment)
5. [Post-deployment Tasks](#post-deployment-tasks)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Pre-deployment Checklist

### Code Quality

- [ ] All tests pass
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Bundle size is acceptable
- [ ] Performance metrics meet targets (Lighthouse >90)

### Security

- [ ] All dependencies up to date
- [ ] Security vulnerabilities fixed (`npm audit`)
- [ ] API keys moved to environment variables
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation in place

### Features

- [ ] All routes tested
- [ ] Offline functionality works
- [ ] PWA installable on mobile
- [ ] Service worker registered
- [ ] Authentication flows tested
- [ ] Payment flows tested
- [ ] File uploads work
- [ ] Multi-language support tested

### Performance

- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Code splitting enabled
- [ ] Caching strategies configured
- [ ] CDN ready for static assets

## Environment Variables

Create `.env.production` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.wastefi.com
NEXT_PUBLIC_API_VERSION=v1

# App Configuration
NEXT_PUBLIC_APP_NAME=WasteFi
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=production

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxx

# Map API Keys
NEXT_PUBLIC_MAPBOX_TOKEN=xxxxx
# or
NEXT_PUBLIC_GOOGLE_MAPS_KEY=xxxxx

# Payment Gateways
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxxxx
NEXT_PUBLIC_MPESA_KEY=xxxxx

# Stellar Blockchain
NEXT_PUBLIC_STELLAR_NETWORK=public
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon.stellar.org

# AWS (for file uploads)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_BUCKET=wastefi-uploads
AWS_ACCESS_KEY_ID=xxxxx (server-side only)
AWS_SECRET_ACCESS_KEY=xxxxx (server-side only)

# Database (if using Edge functions)
DATABASE_URL=postgresql://user:pass@host:5432/wastefi

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Email Service
SENDGRID_API_KEY=xxxxx
FROM_EMAIL=noreply@wastefi.com
```

### Environment Variable Security

**NEVER commit:**
- `.env.local`
- `.env.production`
- API keys
- Database credentials
- Secret tokens

**Safe to commit:**
- `.env.example` (with placeholder values)

## Deployment Platforms

### Option 1: Vercel (Recommended)

#### Automatic Deployment

1. **Connect Repository**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

2. **Configure Project**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

3. **Add Environment Variables**
- Go to Project Settings > Environment Variables
- Add all variables from `.env.production`
- Set for Production environment

4. **Custom Domain**
- Go to Project Settings > Domains
- Add `wastefi.com` and `www.wastefi.com`
- Update DNS records as instructed

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Option 2: AWS Amplify

1. **Connect GitHub Repository**
2. **Configure Build Settings**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. **Add Environment Variables** in Amplify Console
4. **Configure Custom Domain**

### Option 3: Netlify

1. **Connect Repository**
2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### Option 4: Docker (Self-hosted)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  wastefi-frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.wastefi.com
    restart: unless-stopped
```

**Deploy:**

```bash
# Build image
docker build -t wastefi-frontend .

# Run container
docker run -p 3000:3000 wastefi-frontend

# Or with docker-compose
docker-compose up -d
```

## Build and Deployment

### Production Build

```bash
# Install dependencies
npm ci

# Run type check
npm run type-check

# Run linter
npm run lint

# Build for production
npm run build

# Test production build locally
npm start
```

### Build Output

Check build output for:
- Bundle sizes
- Page sizes
- Static vs dynamic pages
- Warnings or errors

Expected output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                   X kB          XX kB
├ ○ /dashboard                          X kB          XX kB
└ ○ /wallet                             X kB          XX kB

○  (Static)  prerendered as static content
```

### Optimize Build

```bash
# Analyze bundle
npm run build:analyze

# Check for large dependencies
npm install -g webpack-bundle-analyzer
```

## Post-deployment Tasks

### 1. Verify Deployment

- [ ] Visit all routes
- [ ] Test authentication
- [ ] Test critical user flows
- [ ] Check responsive design
- [ ] Test offline functionality
- [ ] Verify PWA installation

### 2. Configure CDN

- [ ] Setup CloudFlare or AWS CloudFront
- [ ] Configure cache rules
- [ ] Enable Brotli compression
- [ ] Setup SSL certificate

### 3. Setup Monitoring

#### Vercel Analytics
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Google Analytics
```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
```

#### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4. Setup Backups

- [ ] Database backups (daily)
- [ ] File storage backups
- [ ] Configuration backups

### 5. Configure Notifications

- [ ] Error alerts (Sentry)
- [ ] Uptime monitoring (Pingdom, UptimeRobot)
- [ ] Performance degradation alerts

## Monitoring and Maintenance

### Performance Monitoring

**Recommended Tools:**
- Vercel Analytics
- Google Analytics 4
- Lighthouse CI
- Web Vitals monitoring

**Key Metrics:**
- Page load time
- Time to Interactive (TTI)
- Core Web Vitals (LCP, FID, CLS)
- Error rate
- API response times

### Error Tracking

**Sentry Dashboard:**
- Monitor error frequency
- Track error trends
- Set up alerts for critical errors
- Review stack traces

### Uptime Monitoring

Use services like:
- Pingdom
- UptimeRobot
- StatusCake
- Checkly

### Regular Maintenance

**Weekly:**
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor user feedback

**Monthly:**
- [ ] Update dependencies
- [ ] Review analytics
- [ ] Check security advisories
- [ ] Optimize slow queries

**Quarterly:**
- [ ] Performance audit
- [ ] Security audit
- [ ] User experience review
- [ ] Code refactoring

## Rollback Procedure

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Docker
```bash
# Tag previous version
docker tag wastefi-frontend:latest wastefi-frontend:v1.0.0

# Rollback
docker-compose down
docker-compose up -d wastefi-frontend:v1.0.0
```

### Git
```bash
# Revert to previous commit
git revert HEAD

# Force deploy
git push origin main --force
```

## Troubleshooting

### Build Failures

**Issue:** Out of memory
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Issue:** Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Runtime Errors

**Issue:** 500 Internal Server Error
- Check server logs
- Verify environment variables
- Check API connectivity

**Issue:** Static files not loading
- Verify CDN configuration
- Check CORS headers
- Clear CDN cache

### Performance Issues

**Issue:** Slow page loads
- Check bundle sizes
- Verify caching is working
- Check API response times
- Use CDN for static assets

## Support and Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PWA Best Practices](https://web.dev/pwa/)
- [Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

---

Last updated: February 2024
