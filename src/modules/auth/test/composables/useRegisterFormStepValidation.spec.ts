import { describe, it, expect, beforeEach, vi } from 'vitest'
import { withSetup } from '../../../../../test/utils/withSetup'
import { useRegisterValidation } from '@/modules/auth/composables/useRegisterFormStepValidation'
import type { RegisterCredentials } from '@/modules/auth/types/Auth.types'
import { createValidRegisterForm, createInvalidRegisterForm } from '../factories/register.factory'

describe('useRegisterFormStepValidation', () => {
  let validForm: RegisterCredentials
  let invalidForm: RegisterCredentials

  beforeEach(() => {
    validForm = createValidRegisterForm()
    invalidForm = createInvalidRegisterForm()
  })

  describe('formRules', () => {
    it('should return validation rules for all form fields', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act & Assert
      expect(result.formRules).toBeDefined()
      expect(result.formRules.firstName).toBeDefined()
      expect(result.formRules.username).toBeDefined()
      expect(result.formRules.country).toBeDefined()
      expect(result.formRules.city).toBeDefined()
      expect(result.formRules.emergencyContact).toBeDefined()
      expect(result.formRules.emergencyPhone).toBeDefined()
      expect(result.formRules.termsAccepted).toBeDefined()
    })

    it('should have correct firstName validation rules', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act
      const firstNameRules = result.formRules.firstName
      
      // Assert
      expect(firstNameRules).toHaveLength(2)
      
      // Required rule
      expect(firstNameRules[0]).toEqual({
        required: true,
        message: 'El nombre es requerido',
        trigger: 'blur'
      })
      
      // Length rule
      expect(firstNameRules[1]).toEqual({
        min: 2,
        max: 50,
        message: 'El nombre debe tener entre 2 y 50 caracteres',
        trigger: 'blur'
      })
    })

    it('should have correct username validation rules', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act
      const usernameRules = result.formRules.username
      
      // Assert
      expect(usernameRules).toHaveLength(3)
      
      // Required rule
      expect(usernameRules[0]).toEqual({
        required: true,
        message: 'El usuario es requerido',
        trigger: 'blur'
      })
      
      // Length rule
      expect(usernameRules[1]).toEqual({
        min: 3,
        max: 20,
        message: 'El usuario debe tener entre 3 y 20 caracteres',
        trigger: 'blur'
      })
      
      // Pattern rule
      expect(usernameRules[2]).toEqual({
        pattern: /^[a-zA-Z0-9_]+$/,
        message: 'El usuario solo puede contener letras, números y guiones bajos',
        trigger: 'blur'
      })
    })

    it('should have correct country validation rules', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act
      const countryRules = result.formRules.country
      
      // Assert
      expect(countryRules).toHaveLength(1)
      expect(countryRules[0]).toEqual({
        required: true,
        message: 'El país es requerido',
        trigger: 'change'
      })
    })

    it('should have correct city validation rules', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act
      const cityRules = result.formRules.city
      
      // Assert
      expect(cityRules).toHaveLength(1)
      expect(cityRules[0]).toEqual({
        required: true,
        message: 'La ciudad es requerida',
        trigger: 'blur'
      })
    })

    it('should have correct emergencyContact validation rules', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act
      const emergencyContactRules = result.formRules.emergencyContact
      
      // Assert
      expect(emergencyContactRules).toHaveLength(1)
      expect(emergencyContactRules[0]).toEqual({
        required: true,
        message: 'El contacto de emergencia es requerido',
        trigger: 'blur'
      })
    })

    it('should have correct emergencyPhone validation rules', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act
      const emergencyPhoneRules = result.formRules.emergencyPhone
      
      // Assert
      expect(emergencyPhoneRules).toHaveLength(1)
      expect(emergencyPhoneRules[0]).toEqual({
        required: true,
        message: 'El teléfono de emergencia es requerido',
        trigger: 'blur'
      })
    })

    it('should have correct termsAccepted validation rules', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act
      const termsAcceptedRules = result.formRules.termsAccepted
      
      // Assert
      expect(termsAcceptedRules).toHaveLength(1)
      expect(termsAcceptedRules[0]).toHaveProperty('validator')
      expect(termsAcceptedRules[0]).toHaveProperty('trigger', 'change')
      expect(typeof termsAcceptedRules[0].validator).toBe('function')
    })
  })

  describe('validator function for termsAccepted', () => {
    it('should call callback with error when terms are not accepted', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      const validator = result.formRules.termsAccepted[0].validator
      const callback = vi.fn()
      
      // Act
      validator(null, false, callback)
      
      // Assert
      expect(callback).toHaveBeenCalledWith(new Error('Debes aceptar los términos y condiciones'))
    })

    it('should call callback without error when terms are accepted', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      const validator = result.formRules.termsAccepted[0].validator
      const callback = vi.fn()
      
      // Act
      validator(null, true, callback)
      
      // Assert
      expect(callback).toHaveBeenCalledWith()
    })
  })

  describe('validation with different form states', () => {
    it('should work with valid form data', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act & Assert
      expect(result.formRules).toBeDefined()
      expect(Object.keys(result.formRules)).toHaveLength(7)
    })

    it('should work with invalid form data', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(invalidForm))
      
      // Act & Assert
      expect(result.formRules).toBeDefined()
      expect(Object.keys(result.formRules)).toHaveLength(7)
    })

    it('should work with empty form data', () => {
      // Arrange
      const emptyForm = createValidRegisterForm({
        username: '',
        firstName: '',
        country: '',
        city: '',
        emergencyContact: '',
        emergencyPhone: '',
        termsAccepted: false
      })
      
      // Act
      const { result } = withSetup(() => useRegisterValidation(emptyForm))
      
      // Assert
      expect(result.formRules).toBeDefined()
      expect(result.formRules.username[0].required).toBe(true)
      expect(result.formRules.firstName[0].required).toBe(true)
    })
  })

  describe('pattern validation for username', () => {
    it('should have correct regex pattern for username', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      const usernamePattern = result.formRules.username[2].pattern as RegExp
      
      // Act & Assert - Valid usernames
      expect(usernamePattern.test('user123')).toBe(true)
      expect(usernamePattern.test('user_name')).toBe(true)
      expect(usernamePattern.test('User123')).toBe(true)
      expect(usernamePattern.test('123user')).toBe(true)
      
      // Act & Assert - Invalid usernames
      expect(usernamePattern.test('user-name')).toBe(false)
      expect(usernamePattern.test('user.name')).toBe(false)
      expect(usernamePattern.test('user name')).toBe(false)
      expect(usernamePattern.test('user@name')).toBe(false)
    })
  })

  describe('length validation', () => {
    it('should have correct length constraints for firstName', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      const firstNameRule = result.formRules.firstName[1]
      
      // Act & Assert
      expect(firstNameRule.min).toBe(2)
      expect(firstNameRule.max).toBe(50)
      expect(firstNameRule.message).toBe('El nombre debe tener entre 2 y 50 caracteres')
    })

    it('should have correct length constraints for username', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      const usernameRule = result.formRules.username[1]
      
      // Act & Assert
      expect(usernameRule.min).toBe(3)
      expect(usernameRule.max).toBe(20)
      expect(usernameRule.message).toBe('El usuario debe tener entre 3 y 20 caracteres')
    })
  })

  describe('trigger events', () => {
    it('should have correct trigger events for each field', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterValidation(validForm))
      
      // Act & Assert
      expect(result.formRules.firstName[0].trigger).toBe('blur')
      expect(result.formRules.username[0].trigger).toBe('blur')
      expect(result.formRules.country[0].trigger).toBe('change')
      expect(result.formRules.city[0].trigger).toBe('blur')
      expect(result.formRules.emergencyContact[0].trigger).toBe('blur')
      expect(result.formRules.emergencyPhone[0].trigger).toBe('blur')
      expect(result.formRules.termsAccepted[0].trigger).toBe('change')
    })
  })
}) 