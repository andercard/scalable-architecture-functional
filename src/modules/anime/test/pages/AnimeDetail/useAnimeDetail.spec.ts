import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'
import { useAnimeDetail } from '../../../pages/AnimeDetail/useAnimeDetail'

// Mocks
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '123' }
  })
}))

vi.mock('@shared/common/utils/format', () => ({
  formatRating: vi.fn(() => '★★★★☆'),
  formatNumber: vi.fn(),
  getGenreColor: vi.fn()
}))

vi.mock('../../../services/anime.services', () => ({
  animeApi: {
    getAnimeCharacters: vi.fn()
  }
}))

// Mock anime con score válido
const mockAnime = {
  mal_id: 123,
  title: 'Test Anime',
  score: 8.5,
  images: {
    jpg: {
      image_url: 'test.jpg'
    }
  }
}

vi.mock('../../../stores/anime.store', () => ({
  useAnimeStore: () => ({
    currentAnime: ref(mockAnime),
    isLoading: false,
    error: null,
    isFavorite: () => false,
    toggleFavorite: vi.fn(),
    loadAnimeById: vi.fn()
  })
}))

describe('useAnimeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Interface', () => {
    it('should provide all required properties and methods for the component', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result).toHaveProperty('anime')
      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('error')
      expect(result).toHaveProperty('isFavorite')
      expect(result).toHaveProperty('ratingStars')
      expect(result).toHaveProperty('heroStyle')
      expect(result).toHaveProperty('characters')
      expect(result).toHaveProperty('charactersError')
      expect(result).toHaveProperty('isLoadingCharacters')
      expect(result).toHaveProperty('toggleFavorite')
      expect(result).toHaveProperty('retry')
    })
  })

  describe('Anime Data Display', () => {
    it('should provide anime data for display in the component', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.anime.value).toBeDefined()
      expect(typeof result.anime.value).toBe('object')
    })

    it('should provide rating stars for display based on anime score', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.ratingStars.value).toBeDefined()
      expect(typeof result.ratingStars.value).toBe('string')
    })

    it('should provide hero style for background display', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.heroStyle.value).toBeDefined()
      expect(typeof result.heroStyle.value).toBe('object')
    })
  })

  describe('Loading and Error States', () => {
    it('should provide loading state for UI feedback', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.isLoading.value).toBeDefined()
      expect(typeof result.isLoading.value).toBe('boolean')
    })

    it('should provide error state for error handling in UI', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.error.value).toBeDefined()
      expect(typeof result.error.value).toBe('object')
    })

    it('should provide characters loading state for UI feedback', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.isLoadingCharacters.value).toBeDefined()
      expect(typeof result.isLoadingCharacters.value).toBe('boolean')
    })

    it('should provide characters error state for error handling', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.charactersError.value).toBeDefined()
      expect(typeof result.charactersError.value).toBe('object')
    })
  })

  describe('Characters Data', () => {
    it('should provide characters data for display in the component', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(Array.isArray(result.characters.value)).toBe(true)
    })
  })

  describe('Favorite Management', () => {
    it('should provide favorite status for UI display', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(result.isFavorite.value).toBeDefined()
      expect(typeof result.isFavorite.value).toBe('boolean')
    })

    it('should provide toggle favorite functionality for user interaction', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(typeof result.toggleFavorite).toBe('function')
    })
  })

  describe('User Actions', () => {
    it('should provide retry functionality for error recovery', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(typeof result.retry).toBe('function')
    })
  })

  describe('Computed Properties Behavior', () => {
    it('should provide reactive computed properties for UI updates', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(typeof result.anime.value).toBe('object')
      expect(typeof result.isLoading.value).toBe('boolean')
      expect(typeof result.error.value).toBe('object')
      expect(typeof result.isFavorite.value).toBe('boolean')
      expect(typeof result.ratingStars.value).toBe('string')
      expect(typeof result.heroStyle.value).toBe('object')
      expect(Array.isArray(result.characters.value)).toBe(true)
      expect(typeof result.charactersError.value).toBe('object')
      expect(typeof result.isLoadingCharacters.value).toBe('boolean')
    })
  })

  describe('Method Availability', () => {
    it('should provide all required methods for user interactions', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert
      expect(typeof result.toggleFavorite).toBe('function')
      expect(typeof result.retry).toBe('function')
    })
  })
}) 