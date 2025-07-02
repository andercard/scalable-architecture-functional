import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAnimeStore } from '../stores/animeStore'
import { formatRating, formatNumber, getGenreColor } from '@shared/utils/format'
import { animeApi } from '../services/anime.services'
import type { AnimeCharacter } from '../types'

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
    backgroundImage: `url(${anime.value?.images.jpg.large_image_url})`
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
    img.src = 'https://via.placeholder.com/150x200/8b5cf6/ffffff?text=No+Image'
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