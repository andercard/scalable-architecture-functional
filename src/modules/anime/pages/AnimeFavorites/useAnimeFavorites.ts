import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAnimeStore } from '../../stores/anime.store'
import type { Anime } from '../../types'

export const useAnimeFavorites = () => {
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