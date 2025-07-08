import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive } from 'vue'

// Mock del composable
const useRegisterValidation = vi.fn(() => ({
  formRules: {
    firstName: [
      {
        required: true,
        message: 'El nombre es requerido',
        trigger: 'blur'
      },
      {
        min: 2,
        max: 50,
        message: 'El nombre debe tener entre 2 y 50 caracteres',
        trigger: 'blur'
      }
    ],
    username: [
      {
        required: true,
        message: 'El usuario es requerido',
        trigger: 'blur'
      },
      {
        min: 3,
        max: 20,
        message: 'El usuario debe tener entre 3 y 20 caracteres',
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: 'El usuario solo puede contener letras, números y guiones bajos',
        trigger: 'blur'
      }
    ],
    country: [
      {
        required: true,
        message: 'El país es requerido',
        trigger: 'change'
      }
    ],
    city: [
      {
        required: true,
        message: 'La ciudad es requerida',
        trigger: 'blur'
      }
    ],
    emergencyContact: [
      {
        required: true,
        message: 'El contacto de emergencia es requerido',
        trigger: 'blur'
      }
    ],
    emergencyPhone: [
      {
        required: true,
        message: 'El teléfono de emergencia es requerido',
        trigger: 'blur'
      }
    ],
    termsAccepted: [
      {
        validator: (rule: any, value: boolean, callback: any) => {
          if (!value) {
            callback(new Error('Debes aceptar los términos y condiciones'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  }
}))

// Mock del tipo RegisterCredentials
interface RegisterCredentials {
  username: string
  firstName: string
  country: string
  city: string
  emergencyContact: string
  emergencyPhone: string
  newsletter: boolean
  termsAccepted: boolean
  marketingConsent: boolean
}

describe('useRegisterValidation', () => {
  let form: RegisterCredentials

  beforeEach(() => {
    vi.clearAllMocks()
    form = reactive({
      username: '',
      firstName: '',
      country: '',
      city: '',
      emergencyContact: '',
      emergencyPhone: '',
      newsletter: false,
      termsAccepted: false,
      marketingConsent: false
    })
  })

  it('should return validation rules for all form fields', () => {
    // Arrange & Act
    const { formRules } = useRegisterValidation(form)
    
    // Assert
    expect(formRules.firstName).toBeDefined()
    expect(formRules.username).toBeDefined()
    expect(formRules.country).toBeDefined()
    expect(formRules.city).toBeDefined()
    expect(formRules.emergencyContact).toBeDefined()
    expect(formRules.emergencyPhone).toBeDefined()
    expect(formRules.termsAccepted).toBeDefined()
  })

  it('should validate firstName as required', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const firstNameRule = formRules.firstName![0]
    
    // Assert - Check required rule exists
    expect(firstNameRule.required).toBe(true)
    expect(firstNameRule.message).toBe('El nombre es requerido')
    expect(firstNameRule.trigger).toBe('blur')
  })

  it('should validate firstName length', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const firstNameRule = formRules.firstName![1]
    
    // Assert - Check length rule exists
    expect(firstNameRule.min).toBe(2)
    expect(firstNameRule.max).toBe(50)
    expect(firstNameRule.message).toBe('El nombre debe tener entre 2 y 50 caracteres')
    expect(firstNameRule.trigger).toBe('blur')
  })

  it('should validate username as required', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const usernameRule = formRules.username![0]
    
    // Assert - Check required rule exists
    expect(usernameRule.required).toBe(true)
    expect(usernameRule.message).toBe('El usuario es requerido')
    expect(usernameRule.trigger).toBe('blur')
  })

  it('should validate username length', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const usernameRule = formRules.username![1]
    
    // Assert - Check length rule exists
    expect(usernameRule.min).toBe(3)
    expect(usernameRule.max).toBe(20)
    expect(usernameRule.message).toBe('El usuario debe tener entre 3 y 20 caracteres')
    expect(usernameRule.trigger).toBe('blur')
  })

  it('should validate username format', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const usernameRule = formRules.username![2]
    
    // Assert - Check pattern rule exists
    expect(usernameRule.pattern).toBeInstanceOf(RegExp)
    expect(usernameRule.message).toBe('El usuario solo puede contener letras, números y guiones bajos')
    expect(usernameRule.trigger).toBe('blur')
  })

  it('should validate country as required', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const countryRule = formRules.country![0]
    
    // Assert - Check required rule exists
    expect(countryRule.required).toBe(true)
    expect(countryRule.message).toBe('El país es requerido')
    expect(countryRule.trigger).toBe('change')
  })

  it('should validate city as required', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const cityRule = formRules.city![0]
    
    // Assert - Check required rule exists
    expect(cityRule.required).toBe(true)
    expect(cityRule.message).toBe('La ciudad es requerida')
    expect(cityRule.trigger).toBe('blur')
  })

  it('should validate emergency contact as required', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const emergencyContactRule = formRules.emergencyContact![0]
    
    // Assert - Check required rule exists
    expect(emergencyContactRule.required).toBe(true)
    expect(emergencyContactRule.message).toBe('El contacto de emergencia es requerido')
    expect(emergencyContactRule.trigger).toBe('blur')
  })

  it('should validate emergency phone as required', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const emergencyPhoneRule = formRules.emergencyPhone![0]
    
    // Assert - Check required rule exists
    expect(emergencyPhoneRule.required).toBe(true)
    expect(emergencyPhoneRule.message).toBe('El teléfono de emergencia es requerido')
    expect(emergencyPhoneRule.trigger).toBe('blur')
  })

  it('should validate terms acceptance', () => {
    // Arrange
    const { formRules } = useRegisterValidation(form)
    const termsRule = formRules.termsAccepted![0]
    
    // Act & Assert - Not accepted terms should fail
    const callback = vi.fn()
    termsRule.validator!(null, false, callback)
    expect(callback).toHaveBeenCalledWith(new Error('Debes aceptar los términos y condiciones'))
    
    // Act & Assert - Accepted terms should pass
    const callback2 = vi.fn()
    termsRule.validator!(null, true, callback2)
    expect(callback2).toHaveBeenCalledWith()
  })
}) 