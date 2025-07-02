import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { useAnimeStore } from '../stores/animeStore'
import { ElMessage } from 'element-plus'

// Tipo para los guards
export type AnimeGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) =>
  | Promise<boolean | RouteLocationRaw | string | void>
  | boolean
  | RouteLocationRaw
  | string
  | void



/**
 * Guard para verificar que el usuario tenga favoritos
 * Responsabilidad única: Verificar existencia de favoritos
 */
export const animeFavoritesGuard: AnimeGuard = async (_to, _from) => {
  const animeStore = useAnimeStore()

  if (animeStore.favorites.length === 0) {
    ElMessage.info('No tienes favoritos aún. ¡Explora animes y agrega algunos!')
    return { name: 'AnimeList' }
  }

  return true
}

/**
 * Guard para verificar límites de favoritos
 * Responsabilidad única: Verificar límites de uso
 */
export const animeLimitGuard: AnimeGuard = async (_to, _from) => {
  const animeStore = useAnimeStore()
  const MAX_FAVORITES = 100

  if (animeStore.favorites.length >= MAX_FAVORITES) {
    ElMessage.warning(`Has alcanzado el límite de ${MAX_FAVORITES} favoritos`)
    return { name: 'AnimeFavorites' }
  }

  return true
}