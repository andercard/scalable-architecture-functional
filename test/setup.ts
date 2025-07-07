import { vi, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import { render, type RenderOptions } from '@testing-library/vue'
import type { ComponentPublicInstance } from 'vue'
import '@testing-library/jest-dom'

/**
 * SETUP GLOBAL PARA TESTING
 * 
 * Basado en las mejores prácticas de:
 * - Vue Testing Library: https://testing-library.com/docs/vue-testing-library/intro/
 * - Vue Test Utils: https://test-utils.vuejs.org/
 * - Vitest: https://vitest.dev/
 * 
 * PRINCIPIOS:
 * - Mockeo selectivo (solo lo necesario)
 * - Uso de localStorage real de jsdom cuando sea posible
 * - Configuración consistente para Vue Testing Library
 * - Separación clara entre setup global y específico por módulo
 */

/**
 * CONFIGURACIÓN DE PLUGINS
 */

// Configuración de Pinia para tests
export const createTestPinia = () => createTestingPinia({ 
  createSpy: vi.fn,
  stubActions: false // Permite que las acciones se ejecuten realmente
})

// Configuración de Vue Router para tests de integración
export const createTestRouter = (routes: any[] = []) => createRouter({
  history: createMemoryHistory(),
  routes
})

/**
 * HELPER PARA VUE TESTING LIBRARY
 * 
 * Configura testing-library con plugins por defecto
 */
export const renderWithPlugins = (
  component: ComponentPublicInstance, 
  options: RenderOptions<ComponentPublicInstance> = {}
) => {
  return render(component, {
    global: {
      plugins: [createTestPinia(), createTestRouter()],
      ...(options.global || {})
    },
    ...options
  })
}

/**
 * MOCKS SELECTIVOS DEL NAVEGADOR
 * 
 * Solo mockeamos APIs específicas que necesitamos para testing
 * jsdom proporciona localStorage real - NO lo mockeamos globalmente
 */

// Mock de IntersectionObserver (para lazy loading, infinite scroll, etc.)
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock de ResizeObserver (para componentes responsivos)
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock de console (útil para debugging en tests)
globalThis.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

/**
 * MOCKS DE LIBRERÍAS EXTERNAS
 * 
 * Solo mocks esenciales que se usan en múltiples módulos
 */

// Mock de la instancia de API base (usado por todos los módulos)
vi.mock('@/core/api/instance', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}))

// Mock de Element Plus (usado en múltiples módulos)
vi.mock('element-plus', () => ({
  ElMessage: vi.fn(),
  ElMessageBox: vi.fn(),
  ElNotification: vi.fn(),
  ElLoading: vi.fn()
}))

/**
 * UTILIDADES PARA TESTING
 */

// Helper para crear mocks de router más específicos
export const createMockRouter = (customMethods: Record<string, unknown> = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      params: {},
      query: {},
      hash: ''
    }
  },
  ...customMethods
})

// Helper para verificar navegación
export const expectNavigation = (
  routerMock: any,
  expectedPath: string,
  expectedOptions?: unknown
) => {
  expect(routerMock.push).toHaveBeenCalledWith(
    expectedPath,
    expectedOptions
  )
}

// Helper para limpiar mocks entre tests
export const clearMocks = () => {
  vi.clearAllMocks()
}

/**
 * UTILIDADES PARA LOCALSTORAGE
 * 
 * jsdom proporciona localStorage real - usamos spying cuando sea necesario
 */

// Helper para spying en localStorage
export const spyOnLocalStorage = () => {
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
  const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
  const clearSpy = vi.spyOn(Storage.prototype, 'clear')
  
  return {
    getItem: getItemSpy,
    setItem: setItemSpy,
    removeItem: removeItemSpy,
    clear: clearSpy,
    clearAll: () => {
      getItemSpy.mockClear()
      setItemSpy.mockClear()
      removeItemSpy.mockClear()
      clearSpy.mockClear()
    }
  }
}

// Helper para limpiar localStorage entre tests
export const clearLocalStorage = () => {
  localStorage.clear()
}

/**
 * CONFIGURACIÓN DE VUE ROUTER PARA TESTS UNITARIOS
 * 
 * Solo para tests que necesitan mocks específicos de router
 * Para tests de integración, usar router real
 */

// Mock de Vue Router para tests unitarios
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => createMockRouter(),
    useRoute: () => ({
      params: {},
      query: {},
      path: '/',
      name: undefined
    })
  }
})