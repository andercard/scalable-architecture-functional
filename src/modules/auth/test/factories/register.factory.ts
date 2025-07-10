import type { RegisterCredentials } from '../../types/Auth.types'

/**
 * Factory para crear datos de prueba del formulario de registro
 */
export const createMockRegisterForm = (overrides: Partial<RegisterCredentials> = {}): RegisterCredentials => {
  return {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    country: 'colombia',
    state: 'Cundinamarca',
    city: 'Bogotá',
    address: 'Calle 123 # 45-67',
    postalCode: '110111',
    phone: '3001234567',
    emergencyContact: 'Emergency Contact',
    emergencyPhone: '3001234567',
    newsletter: false,
    termsAccepted: false,
    marketingConsent: false,
    ...overrides
  }
}

/**
 * Factory para crear formulario válido
 */
export const createValidRegisterForm = (): RegisterCredentials => {
  return createMockRegisterForm({
    username: 'juan_123',
    email: 'juan@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    firstName: 'Juan',
    lastName: 'Pérez',
    dateOfBirth: '1990-01-01',
    country: 'colombia',
    state: 'Cundinamarca',
    city: 'Bogotá',
    address: 'Calle 123 # 45-67',
    postalCode: '110111',
    phone: '3001234567',
    emergencyContact: 'María García',
    emergencyPhone: '3001234567',
    newsletter: true,
    termsAccepted: true,
    marketingConsent: false
  })
}

/**
 * Factory para crear formulario inválido
 */
export const createInvalidRegisterForm = (): RegisterCredentials => {
  return createMockRegisterForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    state: '',
    city: '',
    address: '',
    postalCode: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    newsletter: false,
    termsAccepted: false,
    marketingConsent: false
  })
}

/**
 * Factory para crear formulario parcialmente lleno
 */
export const createPartialRegisterForm = (): RegisterCredentials => {
  return createMockRegisterForm({
    username: 'juan123',
    firstName: 'Juan',
    country: 'colombia',
    city: 'Bogotá',
    emergencyContact: '',
    emergencyPhone: '',
    newsletter: false,
    termsAccepted: false,
    marketingConsent: false
  })
}

/**
 * Factory para crear formulario con datos de diferentes países
 */
export const createRegisterFormByCountry = (country: string, city: string): RegisterCredentials => {
  return createMockRegisterForm({
    country,
    city
  })
}

/**
 * Factory para crear formulario con preferencias específicas
 */
export const createRegisterFormWithPreferences = (
  newsletter: boolean = false,
  termsAccepted: boolean = true,
  marketingConsent: boolean = false
): RegisterCredentials => {
  return createMockRegisterForm({
    newsletter,
    termsAccepted,
    marketingConsent
  })
} 