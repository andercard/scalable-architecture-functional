import { ref, computed, watch } from 'vue'
import { User, Message, Lock } from '@element-plus/icons-vue'
import { useRegisterFormProvider } from './useRegisterFormProvider'
import type { FormInstance, FormRules } from 'element-plus'

export const useRegisterBasicSection = () => {
  const { form, sections, updateSection } = useRegisterFormProvider()

  const formRef = ref<FormInstance>()

  const section = computed(() => sections.find(s => s.id === 'basic')!)

  const rules: FormRules = {
    firstName: [
      { required: true, message: 'Por favor ingresa tu nombre', trigger: 'blur' },
      { min: 2, message: 'El nombre debe tener al menos 2 caracteres', trigger: 'blur' }
    ],
    lastName: [
      { required: true, message: 'Por favor ingresa tu apellido', trigger: 'blur' },
      { min: 2, message: 'El apellido debe tener al menos 2 caracteres', trigger: 'blur' }
    ],
    username: [
      { required: true, message: 'Por favor ingresa tu usuario', trigger: 'blur' },
      { min: 3, message: 'El usuario debe tener al menos 3 caracteres', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Por favor ingresa tu email', trigger: 'blur' },
      { type: 'email', message: 'Por favor ingresa un email válido', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'Por favor ingresa tu contraseña', trigger: 'blur' },
      { min: 8, message: 'La contraseña debe tener al menos 8 caracteres', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: 'Por favor confirma tu contraseña', trigger: 'blur' },
      {
        validator: (_rule, value, callback) => {
          if (value !== form.password) {
            callback(new Error('Las contraseñas no coinciden'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    dateOfBirth: [
      { required: true, message: 'Por favor selecciona tu fecha de nacimiento', trigger: 'change' }
    ]
  }

  // Watch para validar el formulario y actualizar isValid
  watch(
    () => ({ ...form }),
    () => {
      if (!formRef.value) return
      formRef.value.validate((valid: boolean) => {
        updateSection('basic', { isValid: valid })
      })
    },
    { deep: true }
  )

  return {
    form,
    sections,
    formRef,
    section,
    rules,
    User,
    Message,
    Lock
  }
} 