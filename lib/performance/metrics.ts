/**
 * Performance Metrics Utilities
 * 
 * Helpers for measuring and reporting performance metrics
 */

// Report Web Vitals to analytics
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }

  // In production, send to analytics
  // Example: Google Analytics, Vercel Analytics, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

// Measure component render time
export function measureRender(componentName: string, callback: () => void) {
  const start = performance.now()
  callback()
  const end = performance.now()
  const duration = end - start

  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} render time: ${duration.toFixed(2)}ms`)
  }

  return duration
}

// Mark performance milestones
export function markPerformance(name: string) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name)
  }
}

// Measure between two marks
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name)[0]
      return measure.duration
    } catch (error) {
      console.error('Error measuring performance:', error)
      return 0
    }
  }
  return 0
}

// Get navigation timing
export function getNavigationTiming() {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const timing = window.performance.timing
  
  return {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    domParsing: timing.domContentLoadedEventStart - timing.responseEnd,
    domComplete: timing.domComplete - timing.domLoading,
    loadComplete: timing.loadEventEnd - timing.navigationStart,
  }
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check connection type
export function getConnectionType(): string {
  if (typeof navigator === 'undefined' || !(navigator as any).connection) {
    return 'unknown'
  }

  const connection = (navigator as any).connection
  return connection.effectiveType || 'unknown'
}

// Check if on slow connection
export function isSlowConnection(): boolean {
  const type = getConnectionType()
  return type === 'slow-2g' || type === '2g'
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Check if device has low memory
export function hasLowMemory(): boolean {
  if (typeof navigator === 'undefined' || !(navigator as any).deviceMemory) {
    return false
  }

  // Consider devices with less than 4GB as low memory
  return (navigator as any).deviceMemory < 4
}

// Get device capabilities
export function getDeviceCapabilities() {
  if (typeof navigator === 'undefined') {
    return {
      memory: 'unknown',
      cores: 'unknown',
      connection: 'unknown',
    }
  }

  return {
    memory: (navigator as any).deviceMemory || 'unknown',
    cores: navigator.hardwareConcurrency || 'unknown',
    connection: getConnectionType(),
  }
}
