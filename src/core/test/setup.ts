import { vi, afterEach } from 'vitest'

// Mock global de axios antes de cualquier import de core/api
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      defaults: { baseURL: '', timeout: 5000 },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      request: vi.fn()
    }))
  }
}))

// Configuración específica para tests de core
// Este archivo se ejecuta antes de todos los tests del módulo core

// Mock global de console para tests silenciosos
globalThis.console = {
  ...console,
  // Silenciar warnings en tests
  warn: vi.fn(),
  error: vi.fn()
}

// Mock de window.location para tests de router
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
})

// Mock de fetch para tests de API
globalThis.fetch = vi.fn()

// Configuración de timeouts para tests asíncronos
vi.setConfig({
  testTimeout: 5000,
  hookTimeout: 5000
})

// Limpiar mocks después de cada test
afterEach(() => {
  vi.clearAllMocks()
})

// Configuración de variables de entorno para tests
import.meta.env.NODE_ENV = 'test'
import.meta.env.VITE_API_BASE_URL = 'http://localhost:3000/api' 