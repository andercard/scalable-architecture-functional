[⬅️ Volver al índice](./README.md)

## Factories testing data

¿Por qué usar factories para testing?
Las factories proporcionan datos de prueba consistentes, reutilizables y mantenibles. Siguiendo las mejores prácticas de [Stackademic](https://blog.stackademic.com/best-practices-for-managing-test-data-in-nestjs-with-jest-e4729769047b?gi=2dd7bb52c473), implementamos un enfoque modular que facilita la creación y mantenimiento de datos de prueba.

#### 1. Patrón Factory por Módulo

Estructura recomendada:
```
src/modules/auth/test/factories/
├── register.factory.ts
├── user.factory.ts
└── index.ts
```

Ventajas del enfoque modular:
- Reutilización: Factories específicas por dominio
- Mantenimiento: Cambios centralizados en un lugar
- Consistencia: Datos coherentes en todos los tests
- Flexibilidad: Overrides para casos específicos

#### 2. Implementación de Factories

```typescript
// src/modules/auth/test/factories/register.factory.ts
import type { RegisterForm } from '@/modules/auth/types/Auth.types'

interface RegisterFormOverrides {
  username?: string
  firstName?: string
  country?: string
  city?: string
  emergencyContact?: string
  emergencyPhone?: string
  newsletter?: boolean
  termsAccepted?: boolean
  marketingConsent?: boolean
}

export const createMockRegisterForm = (overrides: RegisterFormOverrides = {}): RegisterForm => ({
  username: '',
  firstName: '',
  country: '',
  city: '',
  emergencyContact: '',
  emergencyPhone: '',
  newsletter: false,
  termsAccepted: false,
  marketingConsent: false,
  ...overrides // Permitir customización
})

export const createValidRegisterForm = (overrides: RegisterFormOverrides = {}): RegisterForm => 
  createMockRegisterForm({
    username: 'testuser123',
    firstName: 'Juan',
    country: 'colombia',
    city: 'Bogotá',
    emergencyContact: 'María García',
    emergencyPhone: '3001234567',
    newsletter: true,
    termsAccepted: true,
    marketingConsent: false,
    ...overrides
  })

// Factory para casos edge
export const createInvalidRegisterForm = (overrides: RegisterFormOverrides = {}): RegisterForm => 
  createMockRegisterForm({
    username: '', // Inválido: vacío
    firstName: 'A', // Inválido: muy corto
    country: '', // Inválido: vacío
    city: '', // Inválido: vacío
    emergencyContact: '', // Inválido: vacío
    emergencyPhone: '', // Inválido: vacío
    newsletter: false,
    termsAccepted: false, // Inválido: no aceptado
    marketingConsent: false,
    ...overrides
  })
```

#### 3. Uso en Tests

```typescript
import { createMockRegisterForm, createValidRegisterForm } from '../factories/register.factory'

describe('Register Form Testing with Factories', () => {
  it('should handle empty form data', () => {
    // Arrange
    const emptyForm = createMockRegisterForm()
    
    // Act & Assert
    expect(emptyForm.username).toBe('')
    expect(emptyForm.termsAccepted).toBe(false)
  })

  it('should handle valid form data', () => {
    // Arrange
    const validForm = createValidRegisterForm()
    
    // Act & Assert
    expect(validForm.username).toBe('testuser123')
    expect(validForm.termsAccepted).toBe(true)
    expect(validForm.country).toBe('colombia')
  })

  it('should allow custom overrides', () => {
    // Arrange
    const customForm = createValidRegisterForm({
      username: 'customuser',
      newsletter: false
    })
    
    // Act & Assert
    expect(customForm.username).toBe('customuser')
    expect(customForm.newsletter).toBe(false)
    expect(customForm.firstName).toBe('Juan') // Mantiene valor por defecto
  })

  it('should handle edge cases with invalid factory', () => {
    // Arrange
    const invalidForm = createInvalidRegisterForm()
    
    // Act & Assert
    expect(invalidForm.username).toBe('')
    expect(invalidForm.termsAccepted).toBe(false)
    expect(invalidForm.firstName).toBe('A')
  })
})
```

#### 4. Factories para Stores

```typescript
// src/modules/auth/test/factories/store.factory.ts
import { createTestingPinia } from '@pinia/testing'
import type { RegisterForm } from '@/modules/auth/types/Auth.types'

export const createMockAuthStore = (overrides = {}) => {
  const pinia = createTestingPinia({
    initialState: {
      auth: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        ...overrides
      }
    },
    stubActions: false
  })
  
  return pinia
}

export const createMockRegisterFormState = (formData: Partial<RegisterForm> = {}) => ({
  form: createValidRegisterForm(formData),
  isLoading: false,
  currentStep: 1,
  totalSteps: 4
})
```

#### 5. Mejores Prácticas para Factories

SÍ hacer:
- Nombres descriptivos: `createValidRegisterForm`, `createInvalidRegisterForm`
- Overrides flexibles: Permitir personalización para casos específicos
- Valores realistas: Usar datos que simulen el mundo real
- Exportación centralizada: `index.ts` para facilitar imports

NO hacer:
- Crear factories con datos hardcodeados sin overrides
- Usar factories para datos que cambian frecuentemente
- Crear factories demasiado específicas que no se reutilizan
- Mezclar lógica de negocio en las factories

Patrón recomendado para factories complejas:
```typescript
// Factory con múltiples variantes
export const createRegisterFormVariants = {
  empty: () => createMockRegisterForm(),
  valid: () => createValidRegisterForm(),
  invalid: () => createInvalidRegisterForm(),
  partial: () => createValidRegisterForm({
    username: 'partial',
    firstName: 'Partial',
    // Solo algunos campos llenos
  })
}
``` 

### Ejemplo de uso

Puedes ver ejemplos prácticos de factories en los siguientes archivos del repositorio público [`scalable-architecture-functional`](https://github.com/andercard/scalable-architecture-functional):

- [`src/modules/anime/test/factories/anime.factory.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/factories/anime.factory.ts)
- [`src/modules/anime/test/components/AnimeCard/index.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/components/AnimeCard/index.spec.ts) 