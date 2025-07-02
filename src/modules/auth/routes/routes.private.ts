import type { RouteRecordRaw } from 'vue-router'

/**
 * Rutas privadas del módulo auth
 * Requieren autenticación
 * 
 * Nota: El módulo auth actualmente no tiene rutas privadas
 * ya que login y register son públicos. Este archivo se mantiene
 * para consistencia con la estructura de otros módulos.
 */
export const authPrivateRoutes: RouteRecordRaw[] = [
  // Ejemplo de ruta privada que podría agregarse en el futuro:
  // {
  //   path: '/profile',
  //   name: 'UserProfile',
  //   component: () => import('../pages/UserProfile.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Mi Perfil',
  //     description: 'Gestiona tu perfil de usuario'
  //   }
  // }
] 