import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useRegisterValidation } from '../../composables/useRegisterFormStepValidation'
import { provideRegisterForm } from '../../composables/useRegisterFormProvider'

export function useRegisterFormStep(emit: (event: 'registration-success', username: string) => void) {
  // Proveer el provider
  const { form } = provideRegisterForm();

  const isLoading = ref(false)
  const mainFormRef = ref<FormInstance>()

  // Composable para validación
  const { formRules } = useRegisterValidation(form)

  // Función para manejar el envío del formulario
  const onSubmit = async () => {
    try {
      await mainFormRef.value?.validate()
      
      // Simular envío del formulario
      isLoading.value = true
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aquí iría la lógica real de envío
      console.log('Formulario enviado:', form)
      
      // Emitir el evento de éxito
      emit('registration-success', form.username)
    } finally {
      isLoading.value = false
    }
  }

  return {
    form,
    isLoading,
    mainFormRef,
    formRules,
    onSubmit
  }
} 