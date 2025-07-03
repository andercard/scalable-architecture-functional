import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAnimeStore } from '../../stores/anime.store'
import { formatRating, formatNumber, getGenreColor } from '@shared/common/utils/format'
import { animeApi } from '../../services/anime.services'
import type { AnimeCharacter } from '../../types'

export const useAnimeDetail = () => {
  const route = useRoute()
  const animeStore = useAnimeStore()
  const characters = ref<AnimeCharacter[]>([])
  const isLoadingCharacters = ref(false)
  const charactersError = ref<string | null>(null)

  const anime = computed(() => animeStore.currentAnime)
  const isLoading = computed(() => animeStore.isLoading)
  const error = computed(() => animeStore.error)
  const isFavorite = computed(() => 
    anime.value ? animeStore.isFavorite(anime.value.mal_id) : false
  )

  const ratingStars = computed(() => 
    anime.value ? formatRating(anime.value.score) : ''
  )

  const heroStyle = computed(() => ({
    backgroundImage: anime.value?.images?.jpg?.large_image_url 
      ? `url(${anime.value.images.jpg.large_image_url})`
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }))

  const loadCharacters = async (animeId: number) => {
    isLoadingCharacters.value = true
    charactersError.value = null

    const result = await animeApi.getAnimeCharacters(animeId)
    if (result.isRight()) {
      characters.value = result.value.data.data.slice(0, 12)
    } else {
      charactersError.value = result.value.message
      characters.value = []
      console.error('Error loading characters:', result.value)
    }

    isLoadingCharacters.value = false
  }

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    // Usar una imagen base64 como fallback
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
  }

  const toggleFavorite = () => {
    if (anime.value) {
      animeStore.toggleFavorite(anime.value)
    }
  }

  const retry = () => {
    const animeId = Number(route.params.id)
    if (animeId) {
      animeStore.loadAnimeById(animeId)
      loadCharacters(animeId)
    }
  }

  onMounted(() => {
    const animeId = Number(route.params.id)
    if (animeId) {
      animeStore.loadAnimeById(animeId)
      loadCharacters(animeId)
    }
  })

  return {
    anime,
    isLoading,
    error,
    isFavorite,
    ratingStars,
    heroStyle,
    characters,
    charactersError,
    isLoadingCharacters,
    toggleFavorite,
    retry,
    formatNumber,
    getGenreColor,
    handleImageError
  }
} 