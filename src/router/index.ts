// Archivo de rutas principal
import { RouteRecordRaw } from 'vue-router'
import booksRoutes from '../modules/books/routes'
import userRoutes from '../modules/user/routes'

const routes: RouteRecordRaw[] = [
  ...booksRoutes,
  ...userRoutes,
]

export default routes 