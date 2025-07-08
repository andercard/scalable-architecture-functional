import type { RegisterCredentials } from '../../types/Auth.types'

/**
 * Factory para crear datos de prueba del formulario de registro
 */
export const createMockRegisterForm = (overrides: Partial<RegisterCredentials> = {}): RegisterCredentials => {
  return {
    username: 'testuser',
    firstName: 'Test User',
    country: 'colombia',
    city: 'Bogotá',
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
    firstName: 'Juan Pérez',
    country: 'colombia',
    city: 'Bogotá',
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
    username: 'ju@n',
    firstName: 'A',
    country: '',
    city: '',
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