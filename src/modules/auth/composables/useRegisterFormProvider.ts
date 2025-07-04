import { reactive, provide, inject, type InjectionKey } from 'vue'
import type { RegisterFormProvider } from '../types'
import { INITIAL_REGISTER_FORM } from '../constants'

export function useRegisterFormProvider(): RegisterFormProvider {
  const form = reactive({ ...INITIAL_REGISTER_FORM })

  const provider: RegisterFormProvider = {
    form
  }

  return provider
}

// Injection key para el provider
export const REGISTER_FORM_PROVIDER_KEY: InjectionKey<RegisterFormProvider> = Symbol('registerFormProvider')

// Función para proveer el formulario
export function provideRegisterForm(): RegisterFormProvider {
  const provider = useRegisterFormProvider()
  provide(REGISTER_FORM_PROVIDER_KEY, provider)
  return provider
}

// Función para inyectar el formulario
export function injectRegisterForm(): RegisterFormProvider {
  const provider = inject(REGISTER_FORM_PROVIDER_KEY)
  if (!provider) {
    throw new Error('useRegisterFormProvider debe ser usado dentro de un componente que proporcione el formulario')
  }
  return provider
} 