import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'UserProfile',
    component: () => import('./pages/UserProfile.vue'),
  },
]

export default userRoutes 