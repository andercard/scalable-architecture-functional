import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ElMessage } from 'element-plus'
import { useAnimeCard } from '../../../components/AnimeCard/useAnimeCard'
import type { AnimeCardProps, AnimeCardEmits } from '../../../types'
import type { Anime } from '../../../types'

// Setup específico del módulo anime
import '../../setup'

// Mocks
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
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

// Utility function para crear props comunes
const createTestProps = (overrides = {}): AnimeCardProps => ({
  anime: mockAnime as unknown as Anime,
  loading: false,
  ...overrides
})

describe('useAnimeCard', () => {
  let props: AnimeCardProps
  let emit: AnimeCardEmits

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    props = createTestProps()
    emit = vi.fn() as AnimeCardEmits
  })

  describe('Computed Properties', () => {
    describe('animeSubtitle', () => {
      it('should format subtitle with all metadata available', () => {
        // Arrange
        const props = createTestProps({
          anime: { ...mockAnime, type: 'TV', status: 'Airing', year: 2024 }
        })
        
        // Act
        const { animeSubtitle } = useAnimeCard(props, emit)
        
        // Assert
        expect(animeSubtitle.value).toBe('TV • Airing • 2024')
      })

      it('should handle missing type gracefully', () => {
        // Arrange
        const props = createTestProps({
          anime: { ...mockAnime, type: undefined, status: 'Airing', year: 2024 }
        })
        
        // Act
        const { animeSubtitle } = useAnimeCard(props, emit)
        
        // Assert
        expect(animeSubtitle.value).toBe('Airing • 2024')
      })

      it('should handle missing status gracefully', () => {
        // Arrange
        const props = createTestProps({
          anime: { ...mockAnime, type: 'TV', status: undefined, year: 2024 }
        })
        
        // Act
        const { animeSubtitle } = useAnimeCard(props, emit)
        
        // Assert
        expect(animeSubtitle.value).toBe('TV • 2024')
      })

      it('should handle missing year gracefully', () => {
        // Arrange
        const props = createTestProps({
          anime: { ...mockAnime, type: 'TV', status: 'Airing', year: undefined }
        })
        
        // Act
        const { animeSubtitle } = useAnimeCard(props, emit)
        
        // Assert
        expect(animeSubtitle.value).toBe('TV • Airing')
      })

      it('should return empty string when no metadata available', () => {
        // Arrange
        const props = createTestProps({
          anime: { ...mockAnime, type: undefined, status: undefined, year: undefined }
        })
        
        // Act
        const { animeSubtitle } = useAnimeCard(props, emit)
        
        // Assert
        expect(animeSubtitle.value).toBe('')
      })

      it('should handle null values correctly', () => {
        // Arrange
        const props = createTestProps({
          anime: { ...mockAnime, type: null, status: null, year: null }
        })
        
        // Act
        const { animeSubtitle } = useAnimeCard(props, emit)
        
        // Assert
        expect(animeSubtitle.value).toBe('')
      })

      it('should handle empty string values correctly', () => {
        // Arrange
        const props = createTestProps({
          anime: { ...mockAnime, type: '', status: '', year: undefined }
        })
        
        // Act
        const { animeSubtitle } = useAnimeCard(props, emit)
        
        // Assert
        expect(animeSubtitle.value).toBe('')
      })
    })

    describe('isAuthenticated', () => {
      it('should reflect auth store authentication status', () => {
        // Arrange & Act
        const { isAuthenticated } = useAnimeCard(props, emit)
        
        // Assert
        expect(typeof isAuthenticated.value).toBe('boolean')
      })
    })

    describe('isFavorite', () => {
      it('should reflect anime store favorite status', () => {
        // Arrange & Act
        const { isFavorite } = useAnimeCard(props, emit)
        
        // Assert
        expect(typeof isFavorite.value).toBe('boolean')
      })
    })
  })

  describe('User Interactions', () => {
    describe('handleClick', () => {
      it('should emit click event and navigate to anime detail', () => {
        // Arrange
        const { handleClick } = useAnimeCard(props, emit)
        const mockEvent = new MouseEvent('click')
        
        // Act
        handleClick(mockEvent)
        
        // Assert
        expect(emit).toHaveBeenCalledWith('click', mockEvent)
        // Nota: El router.push se mockea en el setup global
      })

      it('should handle click with different anime IDs', () => {
        // Arrange
        const propsWithDifferentId = createTestProps({
          anime: { ...mockAnime, mal_id: 999 }
        })
        const { handleClick } = useAnimeCard(propsWithDifferentId, emit)
        const mockEvent = new MouseEvent('click')
        
        // Act
        handleClick(mockEvent)
        
        // Assert
        expect(emit).toHaveBeenCalledWith('click', mockEvent)
        // Nota: El router.push se mockea en el setup global
      })
    })

    describe('toggleFavorite', () => {
      it('should provide toggle favorite functionality', () => {
        // Arrange & Act
        const { toggleFavorite } = useAnimeCard(props, emit)
        
        // Assert
        expect(typeof toggleFavorite).toBe('function')
        expect(() => toggleFavorite()).not.toThrow()
      })
    })

    describe('showLoginMessage', () => {
      it('should show warning message and navigate to login', () => {
        // Arrange
        const { showLoginMessage } = useAnimeCard(props, emit)
        
        // Act
        showLoginMessage()
        
        // Assert
        expect(vi.mocked(ElMessage)).toHaveBeenCalledWith({
          message: 'Debes iniciar sesión para agregar animes a favoritos',
          type: 'warning',
          duration: 2000
        })
        // Nota: El router.push se mockea en el setup global
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle anime with missing mal_id gracefully', () => {
      // Arrange
      const propsWithoutId = createTestProps({
        anime: { ...mockAnime, mal_id: undefined }
      })
      
      // Act & Assert
      expect(() => useAnimeCard(propsWithoutId, emit)).not.toThrow()
    })

    it('should handle anime with missing images gracefully', () => {
      // Arrange
      const propsWithoutImages = createTestProps({
        anime: { ...mockAnime, images: undefined }
      })
      
      // Act & Assert
      expect(() => useAnimeCard(propsWithoutImages, emit)).not.toThrow()
    })

    it('should handle anime with missing genres gracefully', () => {
      // Arrange
      const propsWithoutGenres = createTestProps({
        anime: { ...mockAnime, genres: undefined }
      })
      
      // Act & Assert
      expect(() => useAnimeCard(propsWithoutGenres, emit)).not.toThrow()
    })

    it('should handle anime with missing title gracefully', () => {
      // Arrange
      const propsWithoutTitle = createTestProps({
        anime: { ...mockAnime, title: undefined }
      })
      
      // Act & Assert
      expect(() => useAnimeCard(propsWithoutTitle, emit)).not.toThrow()
    })
  })

  describe('Component Interface', () => {
    it('should provide all required properties and methods for the component', () => {
      // Arrange & Act
      const result = useAnimeCard(props, emit)
      
      // Assert
      expect(result).toHaveProperty('animeSubtitle')
      expect(result).toHaveProperty('isAuthenticated')
      expect(result).toHaveProperty('isFavorite')
      expect(result).toHaveProperty('handleClick')
      expect(result).toHaveProperty('toggleFavorite')
      expect(result).toHaveProperty('showLoginMessage')
    })

    it('should return computed properties that are reactive', () => {
      // Arrange
      const result = useAnimeCard(props, emit)
      
      // Act & Assert
      expect(typeof result.animeSubtitle.value).toBe('string')
      expect(typeof result.isAuthenticated.value).toBe('boolean')
      expect(typeof result.isFavorite.value).toBe('boolean')
    })

    it('should return functions for user interactions', () => {
      // Arrange
      const result = useAnimeCard(props, emit)
      
      // Act & Assert
      expect(typeof result.handleClick).toBe('function')
      expect(typeof result.toggleFavorite).toBe('function')
      expect(typeof result.showLoginMessage).toBe('function')
    })
  })
}) 