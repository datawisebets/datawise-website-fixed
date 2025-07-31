import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Set React act environment for React 19
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16))
global.cancelAnimationFrame = vi.fn()

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    timing: {
      navigationStart: Date.now(),
      domContentLoadedEventEnd: Date.now() + 100,
      loadEventEnd: Date.now() + 200,
      responseStart: Date.now() + 50,
      domContentLoadedEventStart: Date.now() + 80,
    },
  },
})

// Mock navigator
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
})

// Mock PostHog
global.posthog = {
  capture: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  init: vi.fn(),
}

// Mock gtag
global.gtag = vi.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Setup fetch mock
global.fetch = vi.fn()

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    register: vi.fn(() => Promise.resolve()),
    ready: Promise.resolve(),
  },
})
