import type { RouteRecordRaw } from 'vue-router'
import { authPublicRoutes } from './public'

export const authRoutes: RouteRecordRaw[] = [
  ...authPublicRoutes
]

// Exportaciones individuales
export { authPublicRoutes }

// Exportación por defecto
export default authRoutes 