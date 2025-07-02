import type { RouteRecordRaw } from 'vue-router'

/**
 * Rutas públicas del módulo auth
 * Accesibles solo para usuarios no autenticados
 */
export const authPublicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: {
      requiresGuest: true,
      title: 'Iniciar Sesión',
      description: 'Accede a tu cuenta de Anime Explorer',
      guards: ['authRateLimitGuard']
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
    meta: {
      requiresGuest: true,
      title: 'Registrarse',
      description: 'Crea tu cuenta en Anime Explorer',
      guards: ['authRegistrationGuard']
    }
  }
] 