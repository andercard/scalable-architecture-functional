import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAnimeStore } from '../stores/animeStore'
import type { AnimeFavoritesProps, AnimeFavoritesEmits, Anime } from '../types'

export const useAnimeFavorites = (
  _props: AnimeFavoritesProps,
  _emit: <T extends keyof AnimeFavoritesEmits>(event: T, ...args: AnimeFavoritesEmits[T]) => void
) => {
  const router = useRouter()
  const animeStore = useAnimeStore()
  
  const favorites = computed(() => 
    animeStore.favorites.map(anime => JSON.parse(JSON.stringify(anime)) as Anime)
  )
  const isLoading = computed(() => animeStore.isLoading)
  const error = computed(() => animeStore.error)

  const goToDetail = (animeId: number) => {
    router.push(`/anime/${animeId}`)
  }

  const removeFromFavorites = (animeId: number) => {
    animeStore.removeFromFavorites(animeId)
  }

  return {
    favorites,
    isLoading,
    error,
    goToDetail,
    removeFromFavorites
  }
} 