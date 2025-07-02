import type { RouteRecordRaw } from 'vue-router'

export const animePrivateRoutes: RouteRecordRaw[] = [
  {
    path: '/anime/favorites',
    name: 'AnimeFavorites',
    component: () => import('../pages/AnimeFavorites.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mis Favoritos'
    }
  }
] 