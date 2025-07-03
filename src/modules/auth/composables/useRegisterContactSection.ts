import { ref, computed } from 'vue'
import { Phone, User } from '@element-plus/icons-vue'
import { useRegisterFormProvider } from './useRegisterFormProvider'
import type { FormInstance, FormRules } from 'element-plus'

export const useRegisterContactSection = () => {
  const { form, sections } = useRegisterFormProvider()

  const formRef = ref<FormInstance>()

  const section = computed(() => sections.find(s => s.id === 'contact')!)

  const rules: FormRules = {
    phone: [
      { required: true, message: 'Por favor ingresa tu número de teléfono', trigger: 'blur' },
      { min: 10, message: 'El teléfono debe tener al menos 10 dígitos', trigger: 'blur' }
    ],
    emergencyContact: [
      { required: true, message: 'Por favor ingresa el nombre del contacto de emergencia', trigger: 'blur' },
      { min: 2, message: 'El nombre debe tener al menos 2 caracteres', trigger: 'blur' }
    ],
    emergencyPhone: [
      { required: true, message: 'Por favor ingresa el teléfono de emergencia', trigger: 'blur' },
      { min: 10, message: 'El teléfono debe tener al menos 10 dígitos', trigger: 'blur' }
    ]
  }

  return {
    form,
    sections,
    formRef,
    section,
    rules,
    Phone,
    User
  }
} 