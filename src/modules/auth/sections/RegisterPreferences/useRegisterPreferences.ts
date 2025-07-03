import { ref, computed } from 'vue'
import { useRegisterFormProvider } from '../../composables/useRegisterFormProvider'
import type { FormInstance, FormRules } from 'element-plus'

export const useRegisterPreferences = () => {
  const { form, sections } = useRegisterFormProvider()

  const formRef = ref<FormInstance>()

  const section = computed(() => sections.find((s: { id: string }) => s.id === 'preferences')!)

  const showTerms = () => {
    // Aquí se abriría un modal con los términos y condiciones
    console.log('Mostrar términos y condiciones')
  }

  const showPrivacy = () => {
    // Aquí se abriría un modal con la política de privacidad
    console.log('Mostrar política de privacidad')
  }

  const rules: FormRules = {
    termsAccepted: [
      {
        validator: (_rule, value, callback) => {
          if (!value) {
            callback(new Error('Debes aceptar los términos y condiciones para continuar'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  }

  return {
    form,
    sections,
    formRef,
    section,
    showTerms,
    showPrivacy,
    rules
  }
} 