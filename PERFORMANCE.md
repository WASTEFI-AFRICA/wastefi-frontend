# Performance Optimization Guide

This document outlines the performance optimizations implemented in WasteFi.

## Table of Contents

1. [Code Splitting](#code-splitting)
2. [Image Optimization](#image-optimization)
3. [Bundle Size Optimization](#bundle-size-optimization)
4. [Caching Strategy](#caching-strategy)
5. [Lazy Loading](#lazy-loading)
6. [Performance Metrics](#performance-metrics)

## Code Splitting

### Automatic Code Splitting

Next.js automatically splits code by route. Each page only loads the JavaScript needed for that route.

### Dynamic Imports

For large components, use dynamic imports with `next/dynamic`:

```tsx
import dynamic from 'next/dynamic'

// Lazy load map component (large dependency)
const DynamicMap = dynamic(() => import('@/components/points/CollectionPointMap'), {
  loading: () => <div>Loading map...</div>,
  ssr: false, // Disable SSR for client-only components
})

export function PointsPage() {
  return <DynamicMap />
}
```

### Implemented Dynamic Imports

- ✅ Map components (Leaflet is large)
- ✅ Chart libraries
- ✅ Camera/webcam components
- ✅ QR code scanner
- ✅ Heavy modals

## Image Optimization

### Next.js Image Component

Always use `next/image` instead of `<img>` tags:

```tsx
import Image from 'next/image'

<Image
  src="/images/logo.png"
  alt="WasteFi Logo"
  width={200}
  height={50}
  priority // For above-the-fold images
/>
```

### Image Formats

- Use WebP format for modern browsers
- Provide fallback formats (JPEG, PNG)
- Compress images before uploading

### Responsive Images

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority
/>
```

## Bundle Size Optimization

### Current Bundle Analysis

Run bundle analyzer to check sizes:

```bash
npm install @next/bundle-analyzer
```

Add to `next.config.ts`:

```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(config)
```

Run: `ANALYZE=true npm run build`

### Tree Shaking

Import only what you need:

```tsx
// ❌ Bad - imports entire library
import _ from 'lodash'

// ✅ Good - imports only needed function
import debounce from 'lodash/debounce'
```

### Dependencies Audit

Current optimizations:
- ✅ `lucide-react` (tree-shakeable icons)
- ✅ `date-fns` (modular date library)
- ✅ TailwindCSS v4 (optimized CSS)

### Remove Unused Dependencies

```bash
npm install -g depcheck
depcheck
```

## Caching Strategy

### Service Worker Caching

Implemented in `next.config.ts` with `next-pwa`:

```typescript
{
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.wastefi\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    }
  ]
}
```

### React Query Caching

Configured in `lib/providers/QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})
```

### IndexedDB Caching

Offline data cached in IndexedDB:
- Submissions
- Transactions
- Collections
- Sync queue

## Lazy Loading

### Component Lazy Loading

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
})
```

### Image Lazy Loading

```tsx
<Image
  src="/image.jpg"
  alt="Description"
  loading="lazy" // Default behavior
  width={800}
  height={600}
/>
```

### Route-based Lazy Loading

Routes are automatically code-split by Next.js:
- Each page is a separate chunk
- Shared components are bundled separately
- Dynamic imports for heavy features

## Performance Metrics

### Lighthouse Targets

- **Performance:** > 90
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 90
- **PWA:** 100

### Core Web Vitals

Target metrics:
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Monitoring

Run Lighthouse audit:

```bash
npm run build
npm start
# Open Chrome DevTools > Lighthouse
```

### Performance Testing

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Check bundle size
npm run build -- --profile
```

## Optimization Checklist

### Build-time Optimizations

- [x] Code splitting by route
- [x] Tree shaking enabled
- [x] Minification enabled
- [x] Compression (gzip/brotli)
- [x] CSS optimization
- [x] Remove unused CSS
- [x] Font optimization

### Runtime Optimizations

- [x] Service Worker caching
- [x] React Query caching
- [x] IndexedDB for offline
- [x] Lazy loading images
- [x] Dynamic imports
- [x] Request deduplication
- [x] Debounced searches

### Asset Optimizations

- [x] Next.js Image optimization
- [x] WebP format support
- [x] Responsive images
- [x] Icon optimization (SVG)
- [x] Font subsetting

### Network Optimizations

- [x] API request caching
- [x] Request batching
- [x] Retry logic
- [x] Offline support
- [x] Background sync

## Best Practices

### 1. Avoid Inline Functions in JSX

```tsx
// ❌ Bad - creates new function on every render
<Button onClick={() => handleClick(id)}>Click</Button>

// ✅ Good - use useCallback
const handleButtonClick = useCallback(() => handleClick(id), [id])
<Button onClick={handleButtonClick}>Click</Button>
```

### 2. Memoize Expensive Calculations

```tsx
import { useMemo } from 'react'

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

### 3. Virtualize Long Lists

For lists with 100+ items, use virtualization:

```bash
npm install react-window
```

```tsx
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => <div style={style}>{items[index]}</div>}
</FixedSizeList>
```

### 4. Optimize Re-renders

```tsx
import { memo } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  // Component only re-renders if data changes
  return <div>{data}</div>
})
```

### 5. Use Web Workers for Heavy Computation

```tsx
// worker.ts
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
})

// component.tsx
useEffect(() => {
  const worker = new Worker('/worker.js')
  worker.postMessage(data)
  worker.onmessage = (e) => setResult(e.data)
  return () => worker.terminate()
}, [data])
```

## Debugging Performance

### React DevTools Profiler

1. Install React DevTools extension
2. Open DevTools > Profiler
3. Record interaction
4. Analyze render times

### Chrome DevTools Performance

1. Open DevTools > Performance
2. Record page load
3. Analyze:
   - Loading time
   - Scripting time
   - Rendering time
   - Painting time

### Network Throttling

Test on slow connections:
1. DevTools > Network
2. Select "Slow 3G" or "Fast 3G"
3. Test critical user flows

## Progressive Enhancement

### Core Features First

1. Load critical CSS inline
2. Defer non-critical CSS
3. Load critical JS first
4. Lazy load everything else

### Graceful Degradation

- App works without JavaScript (forms, links)
- Images have alt text
- Fallback for unsupported features

## Future Optimizations

- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Add Edge caching with CDN
- [ ] Optimize font loading with font-display
- [ ] Implement HTTP/2 Server Push
- [ ] Add prefetching for route transitions
- [ ] Optimize third-party scripts
- [ ] Implement resource hints (preload, prefetch)

## Resources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome Performance DevTools](https://developer.chrome.com/docs/devtools/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)

## Monitoring in Production

Recommended tools:
- **Vercel Analytics** - Built-in for Vercel deployments
- **Google Analytics** - User behavior tracking
- **Sentry** - Error and performance monitoring
- **LogRocket** - Session replay and monitoring

---

Last updated: February 2024
