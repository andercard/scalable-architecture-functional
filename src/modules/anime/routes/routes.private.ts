import type { RouteRecordRaw } from 'vue-router'

/**
 * Rutas privadas del módulo anime
 * Requieren autenticación
 */
export const animePrivateRoutes: RouteRecordRaw[] = [
  {
    path: '/anime/favorites',
    name: 'AnimeFavorites',
    component: () => import('../pages/AnimeFavorites/index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mis Favoritos',
      description: 'Gestiona tus animes favoritos',
      // Usar guards específicos para verificar favoritos
      guards: ['animeFavoritesGuard']
    }
  }
] 