import type { User, LoginCredentials, AuthState } from '../../types/Auth.types'

/**
 * Factory para crear usuarios mock
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjOGI1Y2Y2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTAgMTIwQzUwIDEwMCA3MCA4MCA5MCA4MEgxMTBDMTMwIDgwIDE1MCAxMDAgMTUwIDEyMFYxNTBINTBWMTIwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  ...overrides
})

/**
 * Factory para crear credenciales de login
 */
export const createMockLoginCredentials = (overrides: Partial<LoginCredentials> = {}): LoginCredentials => ({
  username: 'testuser',
  ...overrides
})

/**
 * Factory para crear credenciales válidas de login
 */
export const createValidLoginCredentials = (): LoginCredentials => ({
  username: 'juan_123'
})

/**
 * Factory para crear credenciales inválidas de login
 */
export const createInvalidLoginCredentials = (): LoginCredentials => ({
  username: ''
})

/**
 * Factory para crear estado de autenticación
 */
export const createMockAuthState = (overrides: Partial<AuthState> = {}): AuthState => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...overrides
})

/**
 * Factory para crear estado autenticado
 */
export const createAuthenticatedAuthState = (user?: User): AuthState => ({
  user: user || createMockUser(),
  isAuthenticated: true,
  isLoading: false,
  error: null
})

/**
 * Factory para crear estado de carga
 */
export const createLoadingAuthState = (): AuthState => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
})

/**
 * Factory para crear estado con error
 */
export const createErrorAuthState = (error: string): AuthState => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error
}) 