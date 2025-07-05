import { describe, it, expect, beforeEach, vi } from 'vitest'
import { computed } from 'vue'
import { useAnimeCard } from '../../../components/AnimeCard/useAnimeCard'
import type { AnimeCardProps, AnimeCardEmits } from '../../../components/AnimeCard/animeCard.types'
import type { Anime } from '../../../types'

// Mocks
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

vi.mock('../../../stores/anime.store', () => ({
  useAnimeStore: () => ({
    isFavorite: () => false,
    toggleFavorite: vi.fn()
  })
}))

vi.mock('../../../auth/stores/auth.store', () => ({
  useAuthStore: () => ({
    isAuthenticated: false
  })
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
  anime: mockAnime as unknown as Anime, // Convertir a unknown primero como sugiere el linter
  loading: false,
  ...overrides
})

describe('useAnimeCard', () => {
  let props: AnimeCardProps
  let emit: AnimeCardEmits

  beforeEach(() => {
    vi.clearAllMocks()
    props = createTestProps()
    emit = vi.fn() as AnimeCardEmits
  })

  describe('Anime Information Display', () => {
    it('should display anime subtitle with type, status and year when all data is available', () => {
      // Arrange
      const { animeSubtitle } = useAnimeCard(props, emit)
      
      // Assert
      expect(animeSubtitle.value).toBe('TV • Airing • 2024')
    })

    it('should display subtitle without type when type is missing', () => {
      // Arrange
      const animeWithoutType = { ...mockAnime, type: undefined } as unknown as Anime
      const { animeSubtitle } = useAnimeCard({ ...props, anime: animeWithoutType }, emit)
      
      // Assert
      expect(animeSubtitle.value).toBe('Airing • 2024')
    })

    it('should display subtitle without status when status is missing', () => {
      // Arrange
      const animeWithoutStatus = { ...mockAnime, status: undefined } as unknown as Anime
      const { animeSubtitle } = useAnimeCard({ ...props, anime: animeWithoutStatus }, emit)
      
      // Assert
      expect(animeSubtitle.value).toBe('TV • 2024')
    })

    it('should display subtitle without year when year is missing', () => {
      // Arrange
      const animeWithoutYear = { ...mockAnime, year: undefined } as unknown as Anime
      const { animeSubtitle } = useAnimeCard({ ...props, anime: animeWithoutYear }, emit)
      
      // Assert
      expect(animeSubtitle.value).toBe('TV • Airing')
    })

    it('should display only type when status and year are missing', () => {
      // Arrange
      const animeOnlyType = { ...mockAnime, status: undefined, year: undefined } as unknown as Anime
      const { animeSubtitle } = useAnimeCard({ ...props, anime: animeOnlyType }, emit)
      
      // Assert
      expect(animeSubtitle.value).toBe('TV')
    })

    it('should display empty subtitle when no metadata is available', () => {
      // Arrange
      const animeNoMetadata = { ...mockAnime, type: undefined, status: undefined, year: undefined } as unknown as Anime
      const { animeSubtitle } = useAnimeCard({ ...props, anime: animeNoMetadata }, emit)
      
      // Assert
      expect(animeSubtitle.value).toBe('')
    })
  })

  describe('Authentication State', () => {
    it('should provide authentication status for conditional UI rendering', () => {
      // Arrange & Act
      const { isAuthenticated } = useAnimeCard(props, emit)
      
      // Assert
      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('Favorite Management', () => {
    it('should provide favorite status for UI display', () => {
      // Arrange & Act
      const { isFavorite } = useAnimeCard(props, emit)
      
      // Assert
      expect(typeof isFavorite.value).toBe('boolean')
    })

    it('should provide boolean value for favorite status display', () => {
      // Arrange & Act
      const { isFavorite } = useAnimeCard(props, emit)
      
      // Assert
      expect(typeof isFavorite.value).toBe('boolean')
    })
  })

  describe('User Interactions', () => {
    it('should emit click event when user clicks on the anime card', () => {
      // Arrange
      const { handleClick } = useAnimeCard(props, emit)
      const mockEvent = new MouseEvent('click')
      
      // Act
      handleClick(mockEvent)
      
      // Assert
      expect(emit).toHaveBeenCalledWith('click', mockEvent)
    })

    it('should provide toggle favorite functionality for user interaction', () => {
      // Arrange & Act
      const { toggleFavorite } = useAnimeCard(props, emit)
      
      // Assert
      expect(typeof toggleFavorite).toBe('function')
    })

    it('should provide login message functionality for unauthenticated users', () => {
      // Arrange & Act
      const { showLoginMessage } = useAnimeCard(props, emit)
      
      // Assert
      expect(typeof showLoginMessage).toBe('function')
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

    it('should provide reactive computed properties for UI updates', () => {
      // Arrange & Act
      const result = useAnimeCard(props, emit)
      
      // Assert
      expect(typeof result.animeSubtitle.value).toBe('string')
      expect(typeof result.isAuthenticated.value).toBe('boolean')
      expect(typeof result.isFavorite.value).toBe('boolean')
    })

    it('should provide all required methods for user interactions', () => {
      // Arrange & Act
      const result = useAnimeCard(props, emit)
      
      // Assert
      expect(typeof result.handleClick).toBe('function')
      expect(typeof result.toggleFavorite).toBe('function')
      expect(typeof result.showLoginMessage).toBe('function')
    })
  })
}) 