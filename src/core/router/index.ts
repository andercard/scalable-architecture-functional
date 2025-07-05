// Archivo de rutas principal
import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router'
import { animeRoutes } from '@/modules/anime/routes/index'
import { authRoutes } from '@/modules/auth/routes/index'
import { executeGuards } from './guards'

const routes: RouteRecordRaw[] = [
  ...animeRoutes,
  ...authRoutes,
]

// Función para crear y configurar el router
export const createAppRouter = (): Router => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  router.beforeEach(async (to, from) => {
    return await executeGuards(to, from)
  })

  return router
}

export default routes 