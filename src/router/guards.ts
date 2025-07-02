import type { Router } from 'vue-router'
import { useAuthStore } from '@modules/auth/stores/authStore'

export const setupRouterGuards = (router: Router) => {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()
    
    // Verificar si la ruta requiere autenticación
    if (to.meta.requiresAuth) {
      if (!authStore.isAuthenticated) {
        // Redirigir a login si no está autenticado
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
      }
    }
    
    // Verificar si la ruta requiere ser invitado (no autenticado)
    if (to.meta.requiresGuest) {
      if (authStore.isAuthenticated) {
        // Redirigir a home si ya está autenticado
        next({ name: 'AnimeList' })
        return
      }
    }
    
    next()
  })
} 