export interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

export interface LoginCredentials {
  username: string
}

export interface RegisterCredentials {
  username: string
  email: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthResponse {
  user: User
  token: string
} 