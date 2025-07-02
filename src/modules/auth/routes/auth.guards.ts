import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { ElMessage } from 'element-plus'

// Tipo para los guards
export type AuthGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) =>
  | Promise<boolean | RouteLocationRaw | string | void>
  | boolean
  | RouteLocationRaw
  | string
  | void

/**
 * Guard para limitar intentos de login
 * Previene spam de intentos de autenticación
 */
export const authRateLimitGuard: AuthGuard = async (_to, _from) => {
  const authStore = useAuthStore()
  
  // Verificar si el usuario ya está autenticado
  if (authStore.isAuthenticated) {
    ElMessage.info('Ya has iniciado sesión')
    return { name: 'AnimeList' }
  }

  // Aquí podrías implementar lógica de rate limiting
  // Por ejemplo, verificar intentos recientes en localStorage
  const recentAttempts = localStorage.getItem('login-attempts')
  const attempts = recentAttempts ? JSON.parse(recentAttempts) : []
  const now = Date.now()
  
  // Limpiar intentos antiguos (más de 1 minuto)
  const recentAttemptsFiltered = attempts.filter(
    (timestamp: number) => now - timestamp < 1 * 60 * 1000
  )
  
  if (recentAttemptsFiltered.length >= 5) {
    ElMessage.error('Demasiados intentos de login. Intenta de nuevo en 1 minuto.')
    return false
  }

  return true
}

/**
 * Guard para verificar si el usuario puede registrarse
 * Ejemplo: Verificar si el email ya está en uso
 */
export const authRegistrationGuard: AuthGuard = async (_to, _from) => {
  const authStore = useAuthStore()
  
  // Verificar si el usuario ya está autenticado
  if (authStore.isAuthenticated) {
    ElMessage.info('Ya tienes una cuenta activa')
    return { name: 'AnimeList' }
  }

  return true
}

/**
 * Guard para validar autenticación básica
 * Responsabilidad única: Verificar si la ruta requiere autenticación
 */
export const authRequiresAuthGuard: AuthGuard = async (to, _from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    ElMessage.warning('Debes iniciar sesión para acceder a esta página')
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  
  return true
}

/**
 * Guard para validar acceso para invitados
 * Responsabilidad única: Verificar si la ruta es solo para usuarios no autenticados
 */
export const authRequiresGuestGuard: AuthGuard = async (to, _from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    ElMessage.info('Ya has iniciado sesión')
    return { name: 'AnimeList' }
  }
  
  return true
}

 