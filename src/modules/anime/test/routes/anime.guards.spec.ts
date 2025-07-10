import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ElMessage } from 'element-plus'
import { animeFavoritesGuard, animeLimitGuard } from '../../routes/anime.guards'
import { useAnimeStore } from '../../stores/anime.store'
import { createMockAnime } from '../factories/anime.factory'

// Mock de Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    info: vi.fn(),
    warning: vi.fn()
  }
}))

// Mock de vue-router
const mockTo = {
  name: 'AnimeFavorites',
  params: {},
  query: {},
  hash: '',
  fullPath: '/anime/favorites',
  matched: [],
  meta: {},
  redirectedFrom: undefined,
  path: '/anime/favorites'
}

const mockFrom = {
  name: 'AnimeList',
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: undefined,
  path: '/'
}

describe('Anime Guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('animeFavoritesGuard', () => {
    it('should allow navigation when user has favorites', async () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime()
      store.favorites = [anime]
      
      // Act
      const result = await animeFavoritesGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toBe(true)
      expect(ElMessage.info).not.toHaveBeenCalled()
    })

    it('should redirect to AnimeList when user has no favorites', async () => {
      // Arrange
      const store = useAnimeStore()
      store.favorites = []
      
      // Act
      const result = await animeFavoritesGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toEqual({ name: 'AnimeList' })
      expect(ElMessage.info).toHaveBeenCalledWith(
        'No tienes favoritos aún. ¡Explora animes y agrega algunos!'
      )
    })

    it('should show info message when redirecting due to no favorites', async () => {
      // Arrange
      const store = useAnimeStore()
      store.favorites = []
      
      // Act
      await animeFavoritesGuard(mockTo, mockFrom)
      
      // Assert
      expect(ElMessage.info).toHaveBeenCalledTimes(1)
      expect(ElMessage.info).toHaveBeenCalledWith(
        'No tienes favoritos aún. ¡Explora animes y agrega algunos!'
      )
    })

    it('should handle empty favorites array', async () => {
      // Arrange
      const store = useAnimeStore()
      store.favorites = []
      
      // Act
      const result = await animeFavoritesGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toEqual({ name: 'AnimeList' })
    })

    it('should handle multiple favorites', async () => {
      // Arrange
      const store = useAnimeStore()
      const anime1 = createMockAnime({ mal_id: 1, title: 'Anime 1' })
      const anime2 = createMockAnime({ mal_id: 2, title: 'Anime 2' })
      store.favorites = [anime1, anime2]
      
      // Act
      const result = await animeFavoritesGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toBe(true)
      expect(ElMessage.info).not.toHaveBeenCalled()
    })
  })

  describe('animeLimitGuard', () => {
    it('should allow navigation when user has less than 100 favorites', async () => {
      // Arrange
      const store = useAnimeStore()
      const animes = Array.from({ length: 50 }, (_, i) => 
        createMockAnime({ mal_id: i + 1, title: `Anime ${i + 1}` })
      )
      store.favorites = animes
      
      // Act
      const result = await animeLimitGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toBe(true)
      expect(ElMessage.warning).not.toHaveBeenCalled()
    })

    it('should redirect to AnimeFavorites when user has exactly 100 favorites', async () => {
      // Arrange
      const store = useAnimeStore()
      const animes = Array.from({ length: 100 }, (_, i) => 
        createMockAnime({ mal_id: i + 1, title: `Anime ${i + 1}` })
      )
      store.favorites = animes
      
      // Act
      const result = await animeLimitGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toEqual({ name: 'AnimeFavorites' })
      expect(ElMessage.warning).toHaveBeenCalledWith(
        'Has alcanzado el límite de 100 favoritos'
      )
    })

    it('should redirect to AnimeFavorites when user has more than 100 favorites', async () => {
      // Arrange
      const store = useAnimeStore()
      const animes = Array.from({ length: 150 }, (_, i) => 
        createMockAnime({ mal_id: i + 1, title: `Anime ${i + 1}` })
      )
      store.favorites = animes
      
      // Act
      const result = await animeLimitGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toEqual({ name: 'AnimeFavorites' })
      expect(ElMessage.warning).toHaveBeenCalledWith(
        'Has alcanzado el límite de 100 favoritos'
      )
    })

    it('should show warning message when redirecting due to limit exceeded', async () => {
      // Arrange
      const store = useAnimeStore()
      const animes = Array.from({ length: 100 }, (_, i) => 
        createMockAnime({ mal_id: i + 1, title: `Anime ${i + 1}` })
      )
      store.favorites = animes
      
      // Act
      await animeLimitGuard(mockTo, mockFrom)
      
      // Assert
      expect(ElMessage.warning).toHaveBeenCalledTimes(1)
      expect(ElMessage.warning).toHaveBeenCalledWith(
        'Has alcanzado el límite de 100 favoritos'
      )
    })

    it('should handle empty favorites array', async () => {
      // Arrange
      const store = useAnimeStore()
      store.favorites = []
      
      // Act
      const result = await animeLimitGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toBe(true)
      expect(ElMessage.warning).not.toHaveBeenCalled()
    })

    it('should handle single favorite', async () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime()
      store.favorites = [anime]
      
      // Act
      const result = await animeLimitGuard(mockTo, mockFrom)
      
      // Assert
      expect(result).toBe(true)
      expect(ElMessage.warning).not.toHaveBeenCalled()
    })
  })

  describe('Guard Integration', () => {
    it('should work together with different favorite counts', async () => {
      // Arrange
      const store = useAnimeStore()
      
      // Test with no favorites
      store.favorites = []
      const favoritesResult = await animeFavoritesGuard(mockTo, mockFrom)
      expect(favoritesResult).toEqual({ name: 'AnimeList' })
      
      // Test with some favorites
      const anime = createMockAnime()
      store.favorites = [anime]
      const limitResult = await animeLimitGuard(mockTo, mockFrom)
      expect(limitResult).toBe(true)
    })

    it('should handle edge cases correctly', async () => {
      // Arrange
      const store = useAnimeStore()
      
      // Edge case: exactly 99 favorites (should pass both guards)
      const animes = Array.from({ length: 99 }, (_, i) => 
        createMockAnime({ mal_id: i + 1, title: `Anime ${i + 1}` })
      )
      store.favorites = animes
      
      const favoritesResult = await animeFavoritesGuard(mockTo, mockFrom)
      const limitResult = await animeLimitGuard(mockTo, mockFrom)
      
      // Assert
      expect(favoritesResult).toBe(true)
      expect(limitResult).toBe(true)
    })
  })
}) 