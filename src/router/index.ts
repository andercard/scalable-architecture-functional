// Archivo de rutas principal
import type { RouteRecordRaw } from 'vue-router'
import { animeRoutes } from '@modules/anime/routes/index'
import { authRoutes } from '@modules/auth/routes/index'

const routes: RouteRecordRaw[] = [
  ...animeRoutes,
  ...authRoutes,
]

export default routes 