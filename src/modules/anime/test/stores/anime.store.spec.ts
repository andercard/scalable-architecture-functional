/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Setup específico del módulo anime (solo mocks)
import '../setup'

import { useAnimeStore } from '../../stores/anime.store'
import { animeApi } from '../../services/anime.services'
import type { Anime } from '../../types'

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

// Mock global de localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock de la API
vi.mock('../../services/anime.services', () => ({
  animeApi: {
    getAnimeList: vi.fn(),
    getAnimeById: vi.fn(),
    getTopAnime: vi.fn(),
    getSeasonalAnime: vi.fn(),
    searchAnime: vi.fn()
  }
}))

// Mock de anime de ejemplo con todas las propiedades requeridas
const mockAnime = {
  id: 1,
  mal_id: 1,
  title: 'Test Anime',
  type: 'TV',
  status: 'Airing',
  year: 2024,
  episodes: 12,
  score: 8.5,
  source: 'Manga',
  airing: true,
  duration: '24 min',
  rating: 'PG-13',
  scored_by: 1000,
  rank: 1,
  popularity: 1,
  members: 50000,
  favorites: 1000,
  synopsis: 'Test synopsis',
  season: 'Winter',
  images: {
    jpg: {
      image_url: 'test.jpg',
      small_image_url: 'test_small.jpg',
      large_image_url: 'test_large.jpg'
    }
  },
  broadcast: {
    day: 'Monday',
    time: '00:00',
    timezone: 'Asia/Tokyo',
    string: 'Mondays at 00:00 (JST)'
  },
  genres: [
    { mal_id: 1, name: 'Action', type: 'anime', url: 'https://myanimelist.net/anime/genre/1/Action' },
    { mal_id: 2, name: 'Adventure', type: 'anime', url: 'https://myanimelist.net/anime/genre/2/Adventure' }
  ],
  producers: [],
  licensors: [],
  studios: [],
  explicit_genres: [],
  themes: [],
  demographics: []
} as const

// Utility function para crear store con configuración común
const createTestStore = () => {
  setActivePinia(createPinia())
  return useAnimeStore()
}

// Utility function para crear mocks de API exitosos
const createSuccessMock = (data: unknown) => ({
  _tag: 'Right',
  value: { data },
  isLeft: false,
  isRight: true,
  fold: (onFailure: (error: string) => void, onSuccess: (data: unknown) => void) => {
    onSuccess(data)
    return data
  }
} as any)

// Utility function para crear mocks de API fallidos
const createFailureMock = (error: string) => ({
  _tag: 'Left',
  value: error,
  isLeft: true,
  isRight: false,
  fold: (onFailure: (error: string) => void, onSuccess?: (data: unknown) => void) => {
    if (onFailure) return onFailure(error)
    return error
  }
} as any)

describe('Anime Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('State Management', () => {
    it('should initialize with empty state when no data is available', () => {
      // Arrange
      const store = createTestStore()
      
      // Assert
      expect(store.animes).toEqual([])
      expect(store.currentAnime).toBeNull()
      expect(store.favorites).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.currentPage).toBe(1)
      expect(store.totalAnimes).toBe(0)
      expect(store.totalFavorites).toBe(0)
    })

    it('should handle localStorage errors gracefully and initialize with empty favorites', () => {
      // Arrange
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      // Act
      const store = createTestStore()
      
      // Assert
      expect(store.favorites).toEqual([])
      expect(store.totalFavorites).toBe(0)
    })
  })

  describe('Loading State Management', () => {
    it('should show loading state during API calls and hide it when complete', async () => {
      // Arrange
      const store = createTestStore()
      const mockResponse = createSuccessMock({
        data: [],
        pagination: { items: { total: 0 } }
      })
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      const loadPromise = store.loadAnimeList()
      
      // Assert - During loading
      expect(store.isLoading).toBe(true)
      
      // Act - Wait for completion
      await loadPromise
      
      // Assert - After loading
      expect(store.isLoading).toBe(false)
    })

    it('should show error state when API fails and hide loading state', async () => {
      // Arrange
      const store = createTestStore()
      const mockResponse = createFailureMock('API Error')
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeList()
      
      // Assert
      expect(store.error).toBe('Error en el módulo de anime')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Favorites Management', () => {
    it('should add anime to favorites when user adds a new anime', () => {
      // Arrange
      const store = createTestStore()
      
      // Act
      store.addToFavorites(mockAnime as unknown as Anime)
      
      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(mockAnime.mal_id)
      expect(store.totalFavorites).toBe(1)
      expect(store.isFavorite(mockAnime.mal_id)).toBe(true)
    })

    it('should not add duplicate anime to favorites when user tries to add same anime twice', () => {
      // Arrange
      const store = createTestStore()
      
      // Act
      store.addToFavorites(mockAnime as unknown as Anime)
      store.addToFavorites(mockAnime as unknown as Anime)
      
      // Assert
      expect(store.totalFavorites).toBe(1)
      expect(store.favorites).toHaveLength(1)
    })

    it('should remove anime from favorites when user removes an anime', () => {
      // Arrange
      const store = createTestStore()
      store.addToFavorites(mockAnime as unknown as Anime)
      expect(store.totalFavorites).toBe(1)
      
      // Act
      store.removeFromFavorites(mockAnime.mal_id)
      
      // Assert
      expect(store.totalFavorites).toBe(0)
      expect(store.isFavorite(mockAnime.mal_id)).toBe(false)
    })

    it('should toggle favorite status when user toggles an anime', () => {
      // Arrange
      const store = createTestStore()
      
      // Act & Assert - Add to favorites
      store.toggleFavorite(mockAnime as unknown as Anime)
      expect(store.isFavorite(mockAnime.mal_id)).toBe(true)
      
      // Act & Assert - Remove from favorites
      store.toggleFavorite(mockAnime as unknown as Anime)
      expect(store.isFavorite(mockAnime.mal_id)).toBe(false)
    })

    it('should update favorites state when user adds anime to favorites', async () => {
      // Arrange
      const store = createTestStore()
      
      // Act
      store.addToFavorites(mockAnime as unknown as Anime)
      
      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(mockAnime.mal_id)
      expect(store.totalFavorites).toBe(1)
    })
  })

  describe('API Integration', () => {
    it('should load anime list successfully and update store state', async () => {
      // Arrange
      const store = createTestStore()
      const mockAnimeList = [mockAnime as unknown as Anime]
      const mockResponse = createSuccessMock({
        data: mockAnimeList,
        pagination: { items: { total: 1 } }
      })
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeList()
      
      // Assert
      expect(store.animes).toHaveLength(1)
      expect(store.animes[0].mal_id).toBe(mockAnime.mal_id)
      expect(store.totalAnimes).toBe(1)
      expect(store.error).toBeNull()
    })

    it('should handle API errors gracefully and show error message', async () => {
      // Arrange
      const store = createTestStore()
      const mockResponse = createFailureMock('Network error')
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeList()
      
      // Assert
      expect(store.error).toBe('Error en el módulo de anime')
      expect(store.animes).toEqual([])
    })

    it('should load top anime successfully and update store state', async () => {
      // Arrange
      const store = createTestStore()
      const mockTopAnime = [mockAnime as unknown as Anime]
      const mockResponse = createSuccessMock({
        data: mockTopAnime,
        pagination: { items: { total: 1 } }
      })
      vi.mocked(animeApi.getTopAnime).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadTopAnime()
      
      // Assert
      expect(store.animes).toHaveLength(1)
      expect(store.animes[0].mal_id).toBe(mockAnime.mal_id)
      expect(store.totalAnimes).toBe(1)
    })

    it('should load seasonal anime successfully and update store state', async () => {
      // Arrange
      const store = createTestStore()
      const mockSeasonalAnime = [mockAnime as unknown as Anime]
      const mockResponse = createSuccessMock({
        data: mockSeasonalAnime,
        pagination: { items: { total: 1 } }
      })
      vi.mocked(animeApi.getSeasonalAnime).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadSeasonalAnime()
      
      // Assert
      expect(store.animes).toHaveLength(1)
      expect(store.animes[0].mal_id).toBe(mockAnime.mal_id)
      expect(store.totalAnimes).toBe(1)
    })

    it('should search anime successfully and update store state with results', async () => {
      // Arrange
      const store = createTestStore()
      const mockSearchResults = [mockAnime as unknown as Anime]
      const mockResponse = createSuccessMock({
        data: mockSearchResults,
        pagination: { items: { total: 1 } }
      })
      vi.mocked(animeApi.searchAnime).mockResolvedValue(mockResponse)
      
      // Act
      await store.searchAnimes('test')
      
      // Assert
      expect(store.animes).toHaveLength(1)
      expect(store.animes[0].mal_id).toBe(mockAnime.mal_id)
      expect(store.totalAnimes).toBe(1)
      expect(vi.mocked(animeApi.searchAnime)).toHaveBeenCalledWith('test', 1)
    })

    it('should load anime by ID successfully and set current anime', async () => {
      // Arrange
      const store = createTestStore()
      const mockResponse = createSuccessMock({
        data: mockAnime as unknown as Anime
      })
      vi.mocked(animeApi.getAnimeById).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeById(1)
      
      // Assert
      expect(store.currentAnime).not.toBeNull()
      expect(store.currentAnime?.mal_id).toBe(mockAnime.mal_id)
      expect(store.error).toBeNull()
    })

    it('should handle anime by ID errors and show error message', async () => {
      // Arrange
      const store = createTestStore()
      const mockResponse = createFailureMock('Not found')
      vi.mocked(animeApi.getAnimeById).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeById(999)
      
      // Assert
      expect(store.currentAnime).toBeNull()
      expect(store.error).toBe('Error en el módulo de anime')
    })
  })

  describe('Pagination Management', () => {
    it('should update current page when user navigates to different page', () => {
      // Arrange
      const store = createTestStore()
      
      // Act
      store.currentPage = 2
      
      // Assert
      expect(store.currentPage).toBe(2)
    })

    it('should maintain current page when loading new data', async () => {
      // Arrange
      const store = createTestStore()
      store.currentPage = 3
      const mockResponse = createSuccessMock({
        data: [],
        pagination: { items: { total: 0 } }
      })
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeList()
      
      // Assert
      expect(store.currentPage).toBe(3)
    })
  })

  describe('Error Handling', () => {
    it('should clear error when starting new operation', async () => {
      // Arrange
      const store = createTestStore()
      const mockResponse = createSuccessMock({
        data: [],
        pagination: { items: { total: 0 } }
      })
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeList()
      
      // Assert
      expect(store.error).toBeNull()
    })

    it('should handle API timeout gracefully and show error message', async () => {
      // Arrange
      const store = createTestStore()
      const mockResponse = createFailureMock('Timeout')
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      await store.loadAnimeList()
      
      // Assert
      expect(store.error).toBe('Error en el módulo de anime')
      expect(store.isLoading).toBe(false)
    })
  })
}) 