import { useRouter } from 'vue-router'

export const useRegisterSuccessStep = () => {
  const router = useRouter()

  // Función para ir al login
  const goToLogin = () => {
    router.push('/login')
  }

  // Función para ir al inicio
  const goToHome = () => {
    router.push('/')
  }

  return {
    goToLogin,
    goToHome
  }
} 