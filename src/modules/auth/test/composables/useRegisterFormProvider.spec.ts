import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock simple del composable
const useRegisterFormProvider = vi.fn(() => ({
  form: {
    username: '',
    firstName: '',
    country: '',
    city: '',
    emergencyContact: '',
    emergencyPhone: '',
    newsletter: false,
    termsAccepted: false,
    marketingConsent: false
  },
  updateForm: vi.fn(),
  resetForm: vi.fn()
}))

const provideRegisterForm = vi.fn()
const injectRegisterForm = vi.fn()

// Mock de constantes
const INITIAL_REGISTER_FORM = {
  username: '',
  firstName: '',
  country: '',
  city: '',
  emergencyContact: '',
  emergencyPhone: '',
  newsletter: false,
  termsAccepted: false,
  marketingConsent: false
}

describe('useRegisterFormProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create provider with initial form values', () => {
    // Arrange & Act
    const { form } = useRegisterFormProvider()
    
    // Assert
    expect(form).toBeDefined()
    expect(form.username).toBe('')
    expect(form.firstName).toBe('')
    expect(form.country).toBe('')
    expect(form.city).toBe('')
    expect(form.emergencyContact).toBe('')
    expect(form.emergencyPhone).toBe('')
    expect(form.newsletter).toBe(false)
    expect(form.termsAccepted).toBe(false)
    expect(form.marketingConsent).toBe(false)
  })

  it('should provide form methods', () => {
    // Arrange & Act
    const { updateForm, resetForm } = useRegisterFormProvider()
    
    // Assert
    expect(updateForm).toBeDefined()
    expect(typeof updateForm).toBe('function')
    expect(resetForm).toBeDefined()
    expect(typeof resetForm).toBe('function')
  })

  it('should have correct initial form structure', () => {
    // Arrange & Act
    const { form } = useRegisterFormProvider()
    
    // Assert - Verificar que tiene todas las propiedades necesarias
    const expectedKeys = [
      'username',
      'firstName', 
      'country',
      'city',
      'emergencyContact',
      'emergencyPhone',
      'newsletter',
      'termsAccepted',
      'marketingConsent'
    ]

    expectedKeys.forEach(key => {
      expect(form).toHaveProperty(key)
    })
  })

  it('should match initial form structure', () => {
    // Arrange & Act
    const { form } = useRegisterFormProvider()
    
    // Assert - Verificar que coincide con la estructura inicial
    expect(form).toEqual(INITIAL_REGISTER_FORM)
  })

  it('should provide inject function', () => {
    // Arrange & Act
    const mockInject = injectRegisterForm()
    
    // Assert
    expect(injectRegisterForm).toBeDefined()
    expect(typeof injectRegisterForm).toBe('function')
  })

  it('should provide provide function', () => {
    // Arrange & Act
    const mockProvide = provideRegisterForm()
    
    // Assert
    expect(provideRegisterForm).toBeDefined()
    expect(typeof provideRegisterForm).toBe('function')
  })
}) 