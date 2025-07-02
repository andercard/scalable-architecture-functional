import type { RouteRecordRaw } from 'vue-router'

/**
 * Rutas públicas del módulo anime
 * Accesibles sin autenticación
 */
export const animePublicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'AnimeList',
    component: () => import('../pages/AnimeList.vue'),
    meta: {
      title: 'Explorar Animes',
      description: 'Descubre y explora animes populares'
    }
  },
  {
    path: '/anime/:id',
    name: 'AnimeDetail',
    component: () => import('../pages/AnimeDetail.vue'),
    props: true,
    meta: {
      title: 'Detalle de Anime',
      description: 'Información detallada del anime',
      guards: ['animeLimitGuard']
    }
  },
] 