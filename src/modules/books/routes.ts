import type { RouteRecordRaw } from 'vue-router'

const booksRoutes: RouteRecordRaw[] = [
  {
    path: '/books',
    name: 'BooksList',
    component: () => import('./pages/BooksList.vue'),
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: () => import('./pages/BookDetail.vue'),
    props: true,
  },
]

export default booksRoutes 