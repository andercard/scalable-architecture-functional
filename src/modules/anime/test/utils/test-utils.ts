import { createTestingPinia } from '@pinia/testing'
import { vi, type Mock } from 'vitest'
import { expect } from 'vitest'

/**
 * Utilidades avanzadas para tests del módulo anime
 * Facilita el testing de componentes, stores y servicios
 */

/**
 * Crea una instancia de Pinia para testing con configuración personalizada
 */
export const createTestPinia = (options = {}) => {
  return createTestingPinia({
    createSpy: vi.fn,
    stubActions: false, // Permite que las acciones se ejecuten realmente
    ...options
  })
}

/**
 * Mock de localStorage para tests
 */
export const createLocalStorageMock = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    length: Object.keys(store).length
  }
}

/**
 * Mock de router para tests
 */
export const createRouterMock = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      name: 'home',
      params: {},
      query: {}
    }
  }
})

/**
 * Mock de API response con patrón Either/Result
 */
export const createApiSuccessMock = <T>(data: T) => ({
  _tag: 'Right',
  value: data,
  isLeft: false,
  isRight: true,
  fold: (onFailure: (error: string) => void, onSuccess: (data: T) => void) => {
    if (onSuccess) return onSuccess(data)
    return data
  }
} as unknown)

export const createApiFailureMock = (error: string) => ({
  _tag: 'Left',
  value: error,
  isLeft: true,
  isRight: false,
  fold: (onFailure: (error: string) => void, onSuccess?: (data: unknown) => void) => {
    if (onFailure) return onFailure(error)
    return error
  }
} as unknown)

/**
 * Utilidad para esperar que un estado reactivo cambie
 */
export const waitForStateChange = async (
  getter: () => unknown,
  expectedValue: unknown,
  timeout = 1000
): Promise<void> => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    if (getter() === expectedValue) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  
  throw new Error(`Timeout waiting for state change. Expected: ${expectedValue}, Got: ${getter()}`)
}

/**
 * Utilidad para simular eventos de usuario
 */
export const simulateUserInteraction = {
  click: (element: HTMLElement) => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  },
  
  input: (element: HTMLInputElement, value: string) => {
    element.value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
  },
  
  keydown: (element: HTMLElement, key: string) => {
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  },
  
  scroll: (element: HTMLElement, scrollTop: number) => {
    element.scrollTop = scrollTop
    element.dispatchEvent(new Event('scroll', { bubbles: true }))
  }
}

/**
 * Utilidad para verificar que un mock fue llamado con argumentos específicos
 */
export const expectMockToHaveBeenCalledWith = (mock: Mock, ...args: unknown[]) => {
  expect(mock).toHaveBeenCalledWith(...args)
}

/**
 * Utilidad para verificar que un mock fue llamado exactamente N veces
 */
export const expectMockToHaveBeenCalledTimes = (mock: Mock, times: number) => {
  expect(mock).toHaveBeenCalledTimes(times)
}

/**
 * Utilidad para limpiar todos los mocks después de cada test
 */
export const clearAllMocks = () => {
  vi.clearAllMocks()
  vi.clearAllTimers()
}

/**
 * Utilidad para crear un mock de función que devuelve valores secuenciales
 */
export const createSequentialMock = <T>(values: T[]) => {
  let index = 0
  return vi.fn(() => {
    if (index >= values.length) {
      throw new Error('No more values in sequential mock')
    }
    return values[index++]
  })
}

/**
 * Utilidad para crear un mock de función que devuelve valores basados en argumentos
 */
export const createArgumentBasedMock = <T>(valueMap: Record<string, T>) => {
  return vi.fn((...args: unknown[]) => {
    const key = JSON.stringify(args)
    if (key in valueMap) {
      return valueMap[key]
    }
    throw new Error(`No mock value defined for arguments: ${key}`)
  })
} 