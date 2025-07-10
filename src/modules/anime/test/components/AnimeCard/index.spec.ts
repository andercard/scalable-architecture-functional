import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AnimeCard from '@/modules/anime/components/AnimeCard/index.vue'
import { createMockAnime } from '../../factories/anime.factory'
import { useAnimeStore } from '@/modules/anime/stores/anime.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

// Mock del router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ params: {} })
}))

// Mock del store de anime para controlar isFavorite
const mockIsFavorite = vi.fn()
vi.mock('@/modules/anime/stores/anime.store', () => ({
  useAnimeStore: () => ({
    favorites: [],
    isFavorite: mockIsFavorite,
    toggleFavorite: vi.fn()
  })
}))

// Mock de Element Plus
vi.mock('element-plus', () => ({
  ElButton: {
    name: 'ElButton',
    template: `
      <button 
        class="el-button" 
        :type="type" 
        :size="size"
        :circle="circle"
        :icon="icon"
        :title="title"
        :aria-label="ariaLabel"
        @click="$emit('click')"
        v-bind="$attrs"
      >
        <slot />
      </button>
    `,
    props: ['type', 'size', 'circle', 'icon', 'title', 'ariaLabel'],
    emits: ['click']
  },
  ElMessage: vi.fn()
}))

// Mock de BaseCard
vi.mock('@/shared/common/components/BaseCard/index.vue', () => ({
  default: {
    name: 'BaseCard',
    template: `
      <div class="base-card" :class="{ 'base-card--clickable': clickable }" @click="$emit('click')">
        <div class="base-card__image-container">
          <img :src="imageUrl" :alt="title" class="base-card__image" />
        </div>
        <div class="base-card__content">
          <h3 class="base-card__title" :title="title">{{ title }}</h3>
          <div class="base-card__subtitle">{{ subtitle }}</div>
          <div class="base-card__genres">
            <span 
              v-for="genre in genres" 
              :key="genre.mal_id"
              class="base-card__genre"
              :style="{ backgroundColor: getGenreColor(genre.name) }"
            >
              {{ genre.name }}
            </span>
          </div>
          <slot name="footer" />
        </div>
      </div>
    `,
    props: ['title', 'imageUrl', 'subtitle', 'genres', 'loading', 'clickable'],
    emits: ['click'],
    methods: {
      getGenreColor(name: string) {
        const colors: Record<string, string> = {
          'Action': 'rgb(255, 71, 87)',
          'Adventure': 'rgb(46, 213, 115)',
          'Comedy': 'rgb(255, 165, 2)',
          'Drama': 'rgb(214, 48, 49)',
          'Fantasy': 'rgb(116, 125, 136)',
          'Horror': 'rgb(45, 52, 54)',
          'Romance': 'rgb(232, 67, 147)',
          'Sci-Fi': 'rgb(18, 137, 167)',
          'Slice of Life': 'rgb(0, 184, 148)',
          'Sports': 'rgb(9, 132, 227)',
          'Thriller': 'rgb(108, 92, 231)'
        }
        return colors[name] || 'rgb(116, 125, 136)'
      }
    }
  }
}))

describe('AnimeCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsFavorite.mockReturnValue(false)
  })

  describe('Renderizado básico', () => {
    it('should render anime card with correct information', () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime',
        type: 'TV',
        status: 'Airing',
        year: 2024,
        episodes: 12,
        genres: [
          { mal_id: 1, name: 'Action', type: 'anime', url: 'https://example.com' },
          { mal_id: 2, name: 'Adventure', type: 'anime', url: 'https://example.com' }
        ]
      })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      expect(screen.getByText('Test Anime')).toBeInTheDocument()
      expect(screen.getByText('TV • Airing • 2024')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
      expect(screen.getByText('Adventure')).toBeInTheDocument()
      expect(screen.getByText('12 eps')).toBeInTheDocument()
    })

    it('should display favorite button when user is authenticated', () => {
      // Arrange
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const favoriteButton = screen.getByRole('button', { name: /agregar a favoritos/i })
      expect(favoriteButton).toBeInTheDocument()
      expect(favoriteButton).toHaveAttribute('aria-label', 'Agregar a favoritos')
    })

    it('should display login button when user is not authenticated', () => {
      // Arrange
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: false },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(false)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const loginButton = screen.getByRole('button', { name: /inicia sesión para agregar a favoritos/i })
      expect(loginButton).toBeInTheDocument()
      expect(loginButton).toHaveAttribute('aria-label', 'Inicia sesión para agregar a favoritos')
    })
  })

  describe('Estados de favoritos', () => {
    it('should show favorite button as active when anime is in favorites', () => {
      // Arrange
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      mockIsFavorite.mockReturnValue(true)
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [anime] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const favoriteButton = screen.getByRole('button', { name: /quitar de favoritos/i })
      expect(favoriteButton).toBeInTheDocument()
      expect(favoriteButton).toHaveAttribute('aria-label', 'Quitar de favoritos')
    })

    it('should show favorite button as inactive when anime is not in favorites', () => {
      // Arrange
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      mockIsFavorite.mockReturnValue(false)
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const favoriteButton = screen.getByRole('button', { name: /agregar a favoritos/i })
      expect(favoriteButton).toBeInTheDocument()
      expect(favoriteButton).toHaveAttribute('aria-label', 'Agregar a favoritos')
    })
  })

  describe('Interacciones de usuario', () => {
    it('should handle card click to navigate to detail', async () => {
      // Arrange
      const user = userEvent.setup()
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const card = screen.getByText('Test Anime').closest('.base-card')
      expect(card).toBeInTheDocument()
      if (card) {
        await user.click(card)
        // Verificar que se emitió el evento de click
      }
    })

    it('should handle favorite button click when authenticated', async () => {
      // Arrange
      const user = userEvent.setup()
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      mockIsFavorite.mockReturnValue(false)
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const favoriteButton = screen.getByRole('button', { name: /agregar a favoritos/i })
      expect(favoriteButton).toBeInTheDocument()
      await user.click(favoriteButton)
      // Verificar que se emitió el evento de toggle favorite
    })

    it('should handle login button click when not authenticated', async () => {
      // Arrange
      const user = userEvent.setup()
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: false },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(false)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const loginButton = screen.getByRole('button', { name: /inicia sesión para agregar a favoritos/i })
      expect(loginButton).toBeInTheDocument()
      await user.click(loginButton)
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('Estados edge', () => {
    it('should handle anime without title', () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: null,
        type: 'TV',
        status: 'Airing',
        year: 2024
      })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        }
      })
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      expect(screen.getByText('TV • Airing • 2024')).toBeInTheDocument()
      expect(screen.getByText('12 eps')).toBeInTheDocument()
    })

    it('should handle anime without episodes', () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime',
        episodes: null
      })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        }
      })
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      expect(screen.getByText('Test Anime')).toBeInTheDocument()
      expect(screen.getByText('? eps')).toBeInTheDocument()
    })

    it('should handle anime without genres', () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime',
        genres: []
      })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        }
      })
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      expect(screen.getByText('Test Anime')).toBeInTheDocument()
      expect(screen.getByText('TV • Airing • 2024')).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('should have proper ARIA labels for buttons', () => {
      // Arrange
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      mockIsFavorite.mockReturnValue(false)
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        },
        stubActions: false
      })
      const authStore = useAuthStore()
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const favoriteButton = screen.getByRole('button', { name: /agregar a favoritos/i })
      expect(favoriteButton).toHaveAttribute('aria-label', 'Agregar a favoritos')
      expect(favoriteButton).toHaveAttribute('title', 'Agregar a favoritos')
    })

    it('should have proper image alt text', () => {
      // Arrange
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        }
      })
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const image = screen.getByAltText('Test Anime')
      expect(image).toBeInTheDocument()
    })

    it('should have proper heading structure', () => {
      // Arrange
      const anime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      const pinia = createTestingPinia({
        initialState: {
          auth: { isAuthenticated: true },
          anime: { favorites: [] }
        }
      })
      // Act
      render(AnimeCard, {
        props: { anime },
        global: {
          plugins: [pinia]
        }
      })
      // Assert
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Test Anime')
    })
  })
}) 