import type { RouteRecordRaw } from 'vue-router'
import { animePublicRoutes } from './routes.public'
import { animePrivateRoutes } from './routes.private'

/**
 * Rutas del módulo anime
 * Combina rutas públicas y privadas
 */
export const animeRoutes: RouteRecordRaw[] = [
  ...animePublicRoutes,
  ...animePrivateRoutes
]

// Exportaciones individuales para casos específicos
export { animePublicRoutes, animePrivateRoutes }

// Re-exportar guards para uso en otros módulos
export * from './anime.guards' 