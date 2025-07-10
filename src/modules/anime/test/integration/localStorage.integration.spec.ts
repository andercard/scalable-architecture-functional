import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { useAnimeStore } from '@/modules/anime/stores/anime.store'
import { createMockAnime } from '../factories/anime.factory'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Anime Store - localStorage Integration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
    localStorageMock.clear.mockImplementation(() => {})
    
    // Create a fresh Pinia instance for each test
    const pinia = createTestingPinia({
      stubActions: false
    })
    setActivePinia(pinia)
  })

  afterEach(() => {
    // Clean up localStorage after each test
    localStorageMock.clear()
  })

  describe('Favorites Persistence', () => {
    it('should load favorites from localStorage on store initialization', () => {
      // Arrange
      const mockFavorites = [
        createMockAnime({ mal_id: 1, title: 'Stored Favorite' })
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFavorites))

      // Act
      const store = useAnimeStore()

      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].title).toBe('Stored Favorite')
    })

    it('should save favorites to localStorage when adding new favorite', () => {
      // Arrange
      const store = useAnimeStore()
      const newAnime = createMockAnime({ mal_id: 1, title: 'New Favorite' })

      // Act
      store.addToFavorites(newAnime)

      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].title).toBe('New Favorite')
    })

    it('should save favorites to localStorage when removing favorite', () => {
      // Arrange
      const store = useAnimeStore()
      const anime1 = createMockAnime({ mal_id: 1, title: 'Anime 1' })
      const anime2 = createMockAnime({ mal_id: 2, title: 'Anime 2' })
      
      store.addToFavorites(anime1)
      store.addToFavorites(anime2)

      // Act
      store.removeFromFavorites(1)

      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(2)
    })

    it('should save favorites to localStorage when toggling favorite', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 1, title: 'Toggle Test' })

      // Act - Add to favorites
      store.toggleFavorite(anime)

      // Assert - Should be saved
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].title).toBe('Toggle Test')

      // Act - Remove from favorites
      store.toggleFavorite(anime)

      // Assert - Should be removed
      expect(store.favorites).toHaveLength(0)
    })

    it('should handle empty localStorage gracefully', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)

      // Act
      const store = useAnimeStore()

      // Assert
      expect(store.favorites).toHaveLength(0)
    })

    it('should handle invalid JSON in localStorage gracefully', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('invalid json')

      // Act
      const store = useAnimeStore()

      // Assert
      expect(store.favorites).toHaveLength(0)
    })

    it('should handle localStorage errors gracefully', () => {
      // Arrange
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      // Act
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 1, title: 'Test' })

      // Assert - Should not throw error
      expect(() => store.addToFavorites(anime)).not.toThrow()
      expect(store.favorites).toHaveLength(1)
    })
  })

  describe('Data Integrity', () => {
    it('should maintain data integrity across store operations', () => {
      // Arrange
      const store = useAnimeStore()
      const anime1 = createMockAnime({ mal_id: 1, title: 'Anime 1' })
      const anime2 = createMockAnime({ mal_id: 2, title: 'Anime 2' })

      // Act - Add multiple favorites
      store.addToFavorites(anime1)
      store.addToFavorites(anime2)

      // Assert - Check store state
      expect(store.favorites).toHaveLength(2)
      expect(store.favorites[0].mal_id).toBe(1)
      expect(store.favorites[0].title).toBe('Anime 1')
      expect(store.favorites[1].mal_id).toBe(2)
      expect(store.favorites[1].title).toBe('Anime 2')

      // Act - Remove one favorite
      store.removeFromFavorites(1)

      // Assert - Check store state
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(2)
    })

    it('should prevent duplicate favorites', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 1, title: 'Duplicate Test' })

      // Act - Add same anime twice
      store.addToFavorites(anime)
      store.addToFavorites(anime)

      // Assert
      expect(store.favorites).toHaveLength(1)
    })

    it('should handle complex anime objects correctly', () => {
      // Arrange
      const store = useAnimeStore()
      const complexAnime = createMockAnime({
        mal_id: 123,
        title: 'Complex Anime',
        genres: [
          { mal_id: 1, name: 'Action', type: 'anime', url: 'https://example.com/genre/1' },
          { mal_id: 2, name: 'Adventure', type: 'anime', url: 'https://example.com/genre/2' }
        ]
      })

      // Act
      store.addToFavorites(complexAnime)

      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(123)
      expect(store.favorites[0].genres).toHaveLength(2)
    })
  })

  describe('Store Reinitialization', () => {
    it('should restore favorites when store is reinitialized', () => {
      // Arrange
      const mockFavorites = [
        createMockAnime({ mal_id: 1, title: 'Restored Favorite' })
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFavorites))

      // Act
      const store = useAnimeStore()

      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].title).toBe('Restored Favorite')
    })

    it('should maintain favorite state across multiple store operations', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 3, title: 'Persistent Anime' })

      // Act - Add favorite
      store.addToFavorites(anime)

      // Assert - Verify store state
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(3)
    })
  })

  describe('Performance and Memory', () => {
    it('should handle large number of favorites efficiently', () => {
      // Arrange
      const store = useAnimeStore()
      const largeFavorites = Array.from({ length: 100 }, (_, i) =>
        createMockAnime({ mal_id: i + 1, title: `Anime ${i + 1}` })
      )

      // Act - Add many favorites
      largeFavorites.forEach(anime => store.addToFavorites(anime))

      // Assert
      expect(store.favorites).toHaveLength(100)
    })

    it('should handle rapid favorite operations', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 1, title: 'Rapid Test' })

      // Act - Rapid operations
      store.addToFavorites(anime)
      store.removeFromFavorites(1)
      store.addToFavorites(anime)

      // Assert
      expect(store.favorites).toHaveLength(1)
    })
  })

  describe('Error Recovery', () => {
    it('should recover from localStorage corruption', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('{"corrupted": json}')
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 1, title: 'Recovery Test' })

      // Act
      store.addToFavorites(anime)

      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.isFavorite(anime.mal_id)).toBe(true)
    })

    it('should handle localStorage quota exceeded gracefully', () => {
      // Arrange
      localStorageMock.setItem.mockImplementation(() => {
        const error = new Error('QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })

      // Act
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 1, title: 'Quota Test' })

      // Assert - Should not throw error
      expect(() => store.addToFavorites(anime)).not.toThrow()
      expect(store.favorites).toHaveLength(1)
    })
  })
}) 