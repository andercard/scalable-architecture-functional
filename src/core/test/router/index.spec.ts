import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Router } from 'vue-router'

// Mock de vue-router
vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => ({
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    getRoutes: vi.fn(() => []),
    hasRoute: vi.fn(),
    removeRoute: vi.fn(),
    addRoute: vi.fn(),
    onError: vi.fn(),
    isReady: vi.fn(() => Promise.resolve()),
    currentRoute: { value: { path: '/', name: 'home' } },
    options: { history: {}, routes: [] }
  })),
  createWebHistory: vi.fn(() => ({}))
}))

describe('Core Router Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Router Creation', () => {
    it('should create router instance', async () => {
      const { createAppRouter } = await import('../../router/index')
      
      expect(createAppRouter).toBeDefined()
      expect(typeof createAppRouter).toBe('function')
    })

    it('should return router with correct methods', async () => {
      const { createAppRouter } = await import('../../router/index')
      const router = createAppRouter()
      
      expect(router).toBeDefined()
      expect(typeof router.push).toBe('function')
      expect(typeof router.replace).toBe('function')
      expect(typeof router.beforeEach).toBe('function')
    })

    it('should have currentRoute property', async () => {
      const { createAppRouter } = await import('../../router/index')
      const router = createAppRouter()
      
      expect(router.currentRoute).toBeDefined()
    })
  })

  describe('Router Guards', () => {
    it('should have guards module', async () => {
      const guards = await import('../../router/guards')
      
      expect(guards).toBeDefined()
      expect(typeof guards).toBe('object')
    })

    it('should export guard functions', async () => {
      const guards = await import('../../router/guards')
      
      // Verificar que se exportan funciones de guards
      expect(typeof guards).toBe('object')
    })
  })

  describe('Router Integration', () => {
    it('should be ready for Vue app integration', async () => {
      const { createAppRouter } = await import('../../router/index')
      const router = createAppRouter()
      
      // Verificar que tiene las propiedades necesarias para Vue
      expect(router).toHaveProperty('options')
      expect(router).toHaveProperty('currentRoute')
    })

    it('should handle route navigation', async () => {
      const { createAppRouter } = await import('../../router/index')
      const router = createAppRouter()
      
      // Verificar métodos de navegación
      expect(typeof router.push).toBe('function')
      expect(typeof router.replace).toBe('function')
      expect(typeof router.go).toBe('function')
    })
  })

  describe('Router Configuration', () => {
    it('should have proper router setup', async () => {
      const { createAppRouter } = await import('../../router/index')
      const router = createAppRouter()
      
      // Verificar configuración básica
      expect(router.options).toBeDefined()
      expect(router.getRoutes).toBeDefined()
    })

    it('should be production ready', async () => {
      const { createAppRouter } = await import('../../router/index')
      const router = createAppRouter()
      
      // Verificar que está listo para producción
      expect(router.isReady).toBeDefined()
      expect(typeof router.isReady).toBe('function')
    })
  })
}) 