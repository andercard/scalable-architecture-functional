import type { Anime } from '@/modules/anime/types'
import { ref } from 'vue'

// vi está disponible globalmente en el contexto de testing
declare const vi: any

// Tipo para overrides del store
export type StoreOverrides = {
  $state?: Partial<{
    favorites: Anime[]
    animes: Anime[]
    currentAnime: Anime | undefined
    searchQuery: string
    isLoading: boolean
    error: string | undefined
    totalItems: number
  }>
  currentAnime?: Anime | undefined
  isLoading?: boolean
  error?: string | undefined
  isFavorite?: (animeId: number) => boolean
  loadAnimeById?: () => Promise<void>
  toggleFavorite?: (anime: Anime) => void
  loadAnimeList?: () => Promise<void>
  loadAnimeCharacters?: (animeId: number) => Promise<void>
}

/**
 * Factory para crear mocks de store de anime compatibles con Pinia
 * 
 * @param overrides - Overrides para personalizar el mock del store
 * @returns Mock del store con estructura completa de Pinia
 */
export function createMockAnimeStore(overrides: StoreOverrides = {}) {
  const defaultState = {
    favorites: [],
    animes: [],
    currentAnime: undefined,
    searchQuery: '',
    isLoading: false,
    error: undefined,
    totalItems: 0,
    ...overrides.$state
  }

  // Ref interno para currentAnime
  const _currentAnime = ref(overrides.currentAnime ?? defaultState.currentAnime)

  return {
    // Propiedades de Pinia
    $id: 'anime',
    $state: defaultState,
    $patch: vi.fn(),
    $reset: vi.fn(),
    $subscribe: vi.fn(),
    $onAction: vi.fn(),
    
    // Propiedades del store
    favorites: defaultState.favorites,
    animes: defaultState.animes,
    // Getter para simular el unwrap automático de Pinia
    get currentAnime() { return _currentAnime.value },
    set currentAnime(val) { _currentAnime.value = val },
    // Para tests de composables que quieran acceder al ref directamente
    _currentAnimeRef: _currentAnime,
    searchQuery: defaultState.searchQuery,
    isLoading: overrides.isLoading ?? defaultState.isLoading,
    error: overrides.error ?? defaultState.error,
    totalItems: defaultState.totalItems,
    
    // Métodos del store
    isFavorite: overrides.isFavorite ?? vi.fn(() => false),
    loadAnimeById: overrides.loadAnimeById ?? vi.fn(),
    toggleFavorite: overrides.toggleFavorite ?? vi.fn(),
    loadAnimeList: overrides.loadAnimeList ?? vi.fn(),
    loadAnimeCharacters: overrides.loadAnimeCharacters ?? vi.fn(),
    
    // Métodos adicionales que pueden existir
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    clearError: vi.fn(),
    setLoading: vi.fn(),
    setSearchQuery: vi.fn(),
    setCurrentAnime: vi.fn(),
    setAnimeList: vi.fn(),
    setCharacters: vi.fn(),
    setTotalItems: vi.fn()
  } as unknown as ReturnType<typeof import('@/modules/anime/stores/anime.store').useAnimeStore>
}

/**
 * Factory para crear mocks de store con datos específicos
 */
export const createMockStoreWithAnime = (anime: Anime) => 
  createMockAnimeStore({
    $state: { currentAnime: anime },
    currentAnime: anime
  })

export const createMockStoreWithFavorites = (favorites: Anime[]) => 
  createMockAnimeStore({
    $state: { favorites }
  })

export const createMockStoreWithError = (error: string) => 
  createMockAnimeStore({
    $state: { error },
    error
  })

export const createMockStoreWithLoading = (isLoading: boolean) => 
  createMockAnimeStore({
    $state: { isLoading },
    isLoading
  })

/**
 * Factory para crear mocks de store con múltiples animes
 */
export const createMockStoreWithAnimeList = (animes: Anime[]) => 
  createMockAnimeStore({
    $state: { animes, totalItems: animes.length }
  }) 