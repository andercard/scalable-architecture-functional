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
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  dateOfBirth: string
  
  // Residencia
  country: string
  state: string
  city: string
  address: string
  postalCode: string
  
  // Información de contacto
  phone: string
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