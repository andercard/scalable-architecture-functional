import type { RouteRecordRaw } from 'vue-router'

export const animePublicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'AnimeList',
    component: () => import('../pages/AnimeList.vue'),
  },
  {
    path: '/anime/:id',
    name: 'AnimeDetail',
    component: () => import('../pages/AnimeDetail.vue'),
    props: true,
  },
] 