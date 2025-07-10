import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withSetup } from '../../../../../test/utils/withSetup'
import { withProvideInject } from '../../../../../test/utils/withSetup'
import { 
  useRegisterFormProvider, 
  provideRegisterForm, 
  injectRegisterForm,
  REGISTER_FORM_PROVIDER_KEY 
} from '@/modules/auth/composables/useRegisterFormProvider'
import { INITIAL_REGISTER_FORM } from '@/modules/auth/constants/forms'
import { createValidRegisterForm } from '../factories'

describe('useRegisterFormProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useRegisterFormProvider', () => {
    it('debe crear provider con valores iniciales del formulario', () => {
      // Arrange & Act
      const { result } = withSetup(() => useRegisterFormProvider())
      
      // Assert
      expect(result.form).toBeDefined()
      expect(result.form.username).toBe('')
      expect(result.form.firstName).toBe('')
      expect(result.form.country).toBe('')
      expect(result.form.city).toBe('')
      expect(result.form.emergencyContact).toBe('')
      expect(result.form.emergencyPhone).toBe('')
      expect(result.form.newsletter).toBe(false)
      expect(result.form.termsAccepted).toBe(false)
      expect(result.form.marketingConsent).toBe(false)
    })

    it('debe tener la estructura correcta del formulario inicial', () => {
      // Arrange & Act
      const { result } = withSetup(() => useRegisterFormProvider())
      
      // Assert - Verificar que tiene todas las propiedades necesarias
      const expectedKeys = [
        'username',
        'email',
        'password',
        'confirmPassword',
        'firstName',
        'lastName',
        'dateOfBirth',
        'country',
        'state',
        'city',
        'address',
        'postalCode',
        'phone',
        'emergencyContact',
        'emergencyPhone',
        'newsletter',
        'termsAccepted',
        'marketingConsent'
      ]

      expectedKeys.forEach(key => {
        expect(result.form).toHaveProperty(key)
      })
    })

    it('debe coincidir con la estructura inicial del formulario', () => {
      // Arrange & Act
      const { result } = withSetup(() => useRegisterFormProvider())
      
      // Assert - Verificar que coincide con la estructura inicial
      expect(result.form).toEqual(INITIAL_REGISTER_FORM)
    })

    it('debe ser reactivo y permitir modificaciones', () => {
      // Arrange
      const { result } = withSetup(() => useRegisterFormProvider())
      
      // Act
      result.form.username = 'testuser'
      result.form.firstName = 'Test'
      result.form.newsletter = true
      
      // Assert
      expect(result.form.username).toBe('testuser')
      expect(result.form.firstName).toBe('Test')
      expect(result.form.newsletter).toBe(true)
    })
  })

  describe('provideRegisterForm', () => {
    it('debe proporcionar el formulario correctamente', () => {
      // Arrange & Act
      const { result } = withSetup(() => provideRegisterForm())
      
      // Assert
      expect(result.form).toBeDefined()
      expect(result.form).toEqual(INITIAL_REGISTER_FORM)
    })

    it('debe usar la misma instancia reactiva', () => {
      // Arrange
      const { result } = withSetup(() => provideRegisterForm())
      
      // Act
      result.form.username = 'testuser'
      
      // Assert
      expect(result.form.username).toBe('testuser')
    })
  })

  describe('injectRegisterForm', () => {
    it('debe inyectar el formulario cuando está disponible', () => {
      // Arrange & Act usando helper global
      const { provideResult, injectResult, app } = withProvideInject(
        () => provideRegisterForm(),
        () => injectRegisterForm()
      )
      // Assert
      expect(injectResult.form).toBeDefined()
      expect(injectResult.form).toEqual(INITIAL_REGISTER_FORM)
      app.unmount()
    })

    it('debe compartir la misma instancia reactiva entre provider e inject', () => {
      // Arrange & Act usando helper global
      const { provideResult, injectResult, app } = withProvideInject(
        () => provideRegisterForm(),
        () => injectRegisterForm()
      )
      // Act
      provideResult.form.username = 'testuser'
      // Assert
      expect(injectResult.form.username).toBe('testuser')
      app.unmount()
    })

    it('debe lanzar error cuando no hay provider disponible', () => {
      // Arrange & Act & Assert
      expect(() => {
        withSetup(() => injectRegisterForm())
      }).toThrow('useRegisterFormProvider debe ser usado dentro de un componente que proporcione el formulario')
    })
  })

  describe('REGISTER_FORM_PROVIDER_KEY', () => {
    it('debe ser un Symbol único', () => {
      // Assert
      expect(typeof REGISTER_FORM_PROVIDER_KEY).toBe('symbol')
      expect(REGISTER_FORM_PROVIDER_KEY.toString()).toContain('registerFormProvider')
    })
  })
}) 