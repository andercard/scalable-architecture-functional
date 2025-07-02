import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { animeApi } from '../services/anime.services'
import type { Anime, AnimeSearchParams } from '../types'
import type { LoadingState } from '@shared/types'
import { getReasonMessage } from '@shared/errors'
import { ErrorAnime } from '../errors'

/**
 * Store de Pinia para el módulo de anime
 */
export const useAnimeStore = defineStore('anime', () => {

  const animes = ref<Anime[]>([])
  const currentAnime = ref<Anime | null>(null)
  const favorites = ref<Anime[]>([])
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: null
  })

  // Cargar favoritos desde localStorage al inicializar
  const loadFavoritesFromStorage = () => {
    try {
      const stored = localStorage.getItem('anime-favorites')
      if (stored) {
        favorites.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
    }
  }

  // Guardar favoritos en localStorage cuando cambien
  const saveFavoritesToStorage = () => {
    try {
      localStorage.setItem('anime-favorites', JSON.stringify(favorites.value))
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error)
    }
  }

  // Cargar favoritos al inicializar
  loadFavoritesFromStorage()

  // Observar cambios en favoritos y guardar en localStorage
  watch(favorites, saveFavoritesToStorage, { deep: true })
  const searchQuery = ref('')
  const currentPage = ref(1)
  const hasNextPage = ref(false)
  const hasPreviousPage = ref(false)
  const totalItems = ref(0)

  // Getters
  const isLoading = computed(() => loadingState.value.isLoading)
  const error = computed(() => loadingState.value.error)
  const totalAnimes = computed(() => totalItems.value)
  const totalFavorites = computed(() => favorites.value.length)
  const isFavorite = computed(() => (animeId: number) => 
    favorites.value.some(anime => anime.mal_id === animeId)
  )

  // Actions
  const setLoading = (loading: boolean) => {
    loadingState.value.isLoading = loading
    if (loading) {
      loadingState.value.error = null
    }
  }

  const setError = (errorMessage: string) => {
    loadingState.value.error = errorMessage
    loadingState.value.isLoading = false
  }

  const handleApiError = (failure: any) => {
    const errorMessage = getReasonMessage(failure, ErrorAnime) || ErrorAnime.DEFAULT
    setError(errorMessage)
  }

  const loadAnimeList = async (params: AnimeSearchParams = {}) => {
    setLoading(true)
    
    const result = await animeApi.getAnimeList({
      page: currentPage.value,
      limit: 20,
      ...params
    })

    const data = result.fold(
      (failure) => {
        handleApiError(failure)
        return undefined
      },
      (success) => success.data
    )
    if (data) {
      animes.value = Array.isArray(data.data) ? data.data : []
      const pagination = data.pagination || {}
      hasNextPage.value = !!pagination.has_next_page
      hasPreviousPage.value = !!pagination.has_previous_page
      totalItems.value = pagination.items?.total || 0
    }
    
    setLoading(false)
  }

  const loadTopAnime = async () => {
    setLoading(true)
    
    const result = await animeApi.getTopAnime(currentPage.value)
    
    const data = result.fold(
      (failure) => {
        handleApiError(failure)
        return undefined
      },
      (success) => success.data
    )
    if (data) {
      animes.value = Array.isArray(data.data) ? data.data : []
      const pagination = data.pagination || {}
      hasNextPage.value = !!pagination.has_next_page
      hasPreviousPage.value = !!pagination.has_previous_page
      totalItems.value = pagination.items?.total || 0
    }
    
    setLoading(false)
  }

  const loadSeasonalAnime = async () => {
    setLoading(true)
    
    const result = await animeApi.getSeasonalAnime(currentPage.value)
    
    const data = result.fold(
      (failure) => {
        handleApiError(failure)
        return undefined
      },
      (success) => success.data
    )
    if (data) {
      animes.value = Array.isArray(data.data) ? data.data : []
      const pagination = data.pagination || {}
      hasNextPage.value = !!pagination.has_next_page
      hasPreviousPage.value = !!pagination.has_previous_page
      totalItems.value = pagination.items?.total || 0
    }
    
    setLoading(false)
  }

  const searchAnimes = async (query: string) => {
    if (!query.trim()) {
      await loadAnimeList()
      return
    }

    setLoading(true)
    searchQuery.value = query
    currentPage.value = 1
    
    const result = await animeApi.searchAnime(query, currentPage.value)
    
    const data = result.fold(
      (failure) => {
        handleApiError(failure)
        return undefined
      },
      (success) => success.data
    )
    if (data) {
      animes.value = Array.isArray(data.data) ? data.data : []
      const pagination = data.pagination || {}
      hasNextPage.value = !!pagination.has_next_page
      hasPreviousPage.value = !!pagination.has_previous_page
      totalItems.value = pagination.items?.total || 0
    }
    
    setLoading(false)
  }

  const loadAnimeById = async (id: number) => {
    setLoading(true)
    
    const result = await animeApi.getAnimeById(id)
    
    const data = result.fold(
      (failure) => {
        handleApiError(failure)
        return undefined
      },
      (success) => success.data
    )
    if (data) {
      currentAnime.value = data.data
    }
    
    setLoading(false)
  }

  const addToFavorites = (anime: Anime) => {
    if (!isFavorite.value(anime.mal_id)) {
      favorites.value.push(anime)
    }
  }

  const removeFromFavorites = (animeId: number) => {
    favorites.value = favorites.value.filter(anime => anime.mal_id !== animeId)
  }

  const toggleFavorite = (anime: Anime) => {
    if (isFavorite.value(anime.mal_id)) {
      removeFromFavorites(anime.mal_id)
    } else {
      addToFavorites(anime)
    }
  }

  const changePage = async (page: number) => {
    currentPage.value = page
    if (searchQuery.value) {
      await searchAnimes(searchQuery.value)
    } else {
      await loadAnimeList()
    }
  }

  const nextPage = async () => {
    if (hasNextPage.value) {
      await changePage(currentPage.value + 1)
    }
  }

  const previousPage = async () => {
    if (hasPreviousPage.value && currentPage.value > 1) {
      await changePage(currentPage.value - 1)
    }
  }

  const clearState = () => {
    animes.value = []
    currentAnime.value = null
    searchQuery.value = ''
    currentPage.value = 1
    hasNextPage.value = false
    hasPreviousPage.value = false
    totalItems.value = 0
    loadingState.value = {
      isLoading: false,
      error: null
    }
  }

  return {
    // State
    animes,
    currentAnime,
    favorites,
    searchQuery,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    
    // Getters
    isLoading,
    error,
    totalAnimes,
    totalFavorites,
    isFavorite,
    
    // Actions
    loadAnimeList,
    loadTopAnime,
    loadSeasonalAnime,
    searchAnimes,
    loadAnimeById,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    changePage,
    nextPage,
    previousPage,
    clearState
  }
}) 