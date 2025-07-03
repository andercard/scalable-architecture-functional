import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/auth.store'
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginForm } from './Login.types'

export const useLogin = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const loginFormRef = ref<FormInstance>()
  const isLoading = computed(() => authStore.isLoading)

  const loginForm = reactive<LoginForm>({
    username: 'demo'
  })

  const rules: FormRules = {
    username: [
      { required: true, message: 'Por favor ingresa tu usuario', trigger: 'blur' }
    ]
  }

  const handleLogin = async () => {
    if (!loginFormRef.value) return
    
    try {
      await loginFormRef.value.validate()
      const success = await authStore.login(loginForm)
      
      if (success) {
        ElMessage.success('¡Bienvenido!')
        router.push('/')
      } else {
        ElMessage.error(authStore.error || 'Error en el login')
      }
    } catch (error) {
      console.error('Error en el formulario:', error)
    }
  }

  return {
    loginFormRef,
    loginForm,
    isLoading,
    rules,
    handleLogin
  }
} 