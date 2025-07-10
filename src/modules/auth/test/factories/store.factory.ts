import { createTestingPinia } from '@pinia/testing'
import type { AuthState, User } from '../../types/Auth.types'
import { createMockUser } from './auth.factory'

/**
 * Factory para crear store de autenticación con Pinia
 */
export const createMockAuthStore = (overrides: Partial<AuthState> = {}) => {
  const defaultState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }

  return createTestingPinia({
    initialState: {
      auth: {
        ...defaultState,
        ...overrides
      }
    },
    stubActions: false
  })
}

/**
 * Factory para crear store autenticado
 */
export const createAuthenticatedAuthStore = (user?: User) => {
  const mockUser = user || createMockUser()
  
  return createTestingPinia({
    initialState: {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    },
    stubActions: false
  })
}

/**
 * Factory para crear store con estado de carga
 */
export const createLoadingAuthStore = () => {
  return createTestingPinia({
    initialState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
      }
    },
    stubActions: false
  })
}

/**
 * Factory para crear store con error
 */
export const createErrorAuthStore = (error: string) => {
  return createTestingPinia({
    initialState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error
      }
    },
    stubActions: false
  })
} 