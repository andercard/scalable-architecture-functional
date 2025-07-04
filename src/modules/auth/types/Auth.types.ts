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
  // Datos básicos
  username: string
  firstName: string
  
  // Residencia
  country: string
  city: string
  
  // Información de contacto
  emergencyContact: string
  emergencyPhone: string
  
  // Preferencias
  newsletter: boolean
  termsAccepted: boolean
  marketingConsent: boolean
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