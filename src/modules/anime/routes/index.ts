import type { RouteRecordRaw } from 'vue-router'
import { animePublicRoutes } from './public'
import { animePrivateRoutes } from './private'

export const animeRoutes: RouteRecordRaw[] = [
  ...animePublicRoutes,
  ...animePrivateRoutes
]

// Exportaciones individuales para casos específicos
export { animePublicRoutes, animePrivateRoutes }

// Exportación por defecto para compatibilidad
export default animeRoutes 