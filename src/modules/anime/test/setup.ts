import { vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Configurar Pinia para tests
setActivePinia(createPinia())

// Mock de window y localStorage
Object.defineProperty(globalThis, 'window', {
  value: {
    localStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  },
  writable: true
})

// Mock de document
Object.defineProperty(globalThis, 'document', {
  value: {
    createElement: vi.fn(() => ({
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
      appendChild: vi.fn(),
      removeChild: vi.fn()
    })),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  },
  writable: true
})

// Mock de console para evitar logs en tests
globalThis.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
} 