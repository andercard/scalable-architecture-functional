import type { RouteRecordRaw } from 'vue-router'
import { authPublicRoutes } from './routes.public'
import { authPrivateRoutes } from './routes.private'

/**
 * Rutas del módulo auth
 * Combina rutas públicas y privadas
 */
export const authRoutes: RouteRecordRaw[] = [
  ...authPublicRoutes,
  ...authPrivateRoutes
]

// Exportaciones individuales para casos específicos
export { authPublicRoutes, authPrivateRoutes }

// Re-exportar guards para uso en otros módulos
export * from './auth.guards' 