import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth.store'
import type { FormInstance, FormRules } from 'element-plus'
import type { RegisterForm } from '../types/Register.types'

export const useRegister = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const registerFormRef = ref<FormInstance>()
  const isLoading = computed(() => authStore.isLoading)

  const registerForm = reactive<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('Por favor confirma tu contraseña'))
    } else if (value !== registerForm.password) {
      callback(new Error('Las contraseñas no coinciden'))
    } else {
      callback()
    }
  }

  const rules: FormRules = {
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
      { min: 6, message: 'La contraseña debe tener al menos 6 caracteres', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ]
  }

  const handleRegister = async () => {
    if (!registerFormRef.value) return
    
    try {
      await registerFormRef.value.validate()
      const success = await authStore.register(registerForm)
      
      if (success) {
        ElMessage.success('¡Registro exitoso!')
        router.push('/')
      } else {
        ElMessage.error(authStore.error || 'Error en el registro')
      }
    } catch (error) {
      console.error('Error en el formulario:', error)
    }
  }

  return {
    registerFormRef,
    registerForm,
    isLoading,
    rules,
    handleRegister
  }
} 