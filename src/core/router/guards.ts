import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import {
  animeFavoritesGuard,
  animeLimitGuard
} from '@/modules/anime/routes/anime.guards'
import {
  authRateLimitGuard,
  authRegistrationGuard,
  authRequiresAuthGuard,
  authRequiresGuestGuard
} from '@/modules/auth/routes/auth.guards'

// Tipo para los guards
export type RouterGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) =>
  | Promise<boolean | RouteLocationRaw | string | void>
  | boolean
  | RouteLocationRaw
  | string
  | void

// Guards globales que se ejecutan en orden
export const globalGuards: RouterGuard[] = [
  authRequiresAuthGuard,
  authRequiresGuestGuard,
]

// Mapa de guards específicos por nombre
const specificGuards: Record<string, RouterGuard> = {
  animeFavoritesGuard,
  animeLimitGuard,
  authRateLimitGuard,
  authRegistrationGuard,
}

// Función para ejecutar guards en cadena
export const executeGuards = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): Promise<boolean | RouteLocationRaw | string | void> => {
  // Ejecutar guards globales primero
  for (const guard of globalGuards) {
    const result = await guard(to, from)
    // Si el guard retorna algo que no es true/undefined, interrumpir la cadena
    if (result !== true && result !== undefined) {
      return result
    }
  }

  // Ejecutar guards específicos si la ruta los define
  if (to.meta.guards && Array.isArray(to.meta.guards)) {
    for (const guardName of to.meta.guards) {
      const guard = specificGuards[guardName as string]
      if (guard) {
        const result = await guard(to, from)
        if (result !== true && result !== undefined) {
          return result
        }
      }
    }
  }

  return true
}