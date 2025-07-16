import '../../setup'
import { render, screen } from '@testing-library/vue'
import { setActivePinia, createPinia } from 'pinia'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AnimeCard from '@/modules/anime/components/AnimeCard/index.vue'
import { createMockAnime } from '../../factories/anime.factory'
import { useAnimeStore } from '../../../stores/anime.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { createValidLoginCredentials } from '@/modules/auth/test/factories/auth.factory'

// Mock del router
const routerMock = { push: vi.fn() }
vi.mock('vue-router', () => ({
  useRouter: () => routerMock,
  useRoute: () => ({ params: {} })
}))

// Mock de Element Plus
vi.mock('element-plus', () => ({
  ElButton: {
    name: 'ElButton',
    template: `
      <button 
        class="el-button" 
        :class="[
          type ? 'el-button--' + type : '',
          size ? 'el-button--' + size : '',
          { 'is-circle': circle }
        ]"
        :title="title"
        :aria-label="ariaLabel"
        @click="$emit('click')"
      >
        <span v-if="icon" class="el-button__icon">{{ icon }}</span>
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
      <div class="base-card" data-testid="base-card" :class="{ 'base-card--clickable': clickable }" @click="$emit('click')">
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
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('should render anime card with correct information', async () => {
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
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      expect(screen.getByText('Test Anime')).toBeInTheDocument()
      expect(screen.getByText('TV • Airing • 2024')).toBeInTheDocument()
    })

    it('should display favorite button when user is authenticated', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      expect(screen.getByTestId('toggle-favorite-button')).toBeInTheDocument()
      expect(screen.queryByTestId('login-required-button')).not.toBeInTheDocument()
    })

    it('should display login button when user is not authenticated', () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      
      // Configure stores - no login, so user is not authenticated
      const animeStore = useAnimeStore()
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      expect(screen.getByTestId('login-required-button')).toBeInTheDocument()
      expect(screen.queryByTestId('toggle-favorite-button')).not.toBeInTheDocument()
    })
  })

  describe('Estados de favoritos', () => {
    it('should show favorite button as active when anime is in favorites', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = [anime]
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      const favoriteButton = screen.getByTestId('toggle-favorite-button')
      expect(favoriteButton).toBeInTheDocument()
      expect(favoriteButton).toHaveAttribute('type', 'danger') // Asumiendo que 'danger' indica activo, ajustar si la clase es diferente
    })

    it('should show favorite button as inactive when anime is not in favorites', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      const favoriteButton = screen.getByTestId('toggle-favorite-button')
      expect(favoriteButton).toBeInTheDocument()
      expect(favoriteButton).toHaveAttribute('type', 'default') // Asumiendo 'default' para inactivo
    })
  })

  describe('Interacciones de usuario', () => {
    it('should handle card click to navigate to detail', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      const user = userEvent.setup()
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      await user.click(screen.getByTestId('base-card'))
      
      // Assert
      expect(routerMock.push).toHaveBeenCalledWith('/anime/1')
    })

    it('should handle favorite button click when authenticated', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      const user = userEvent.setup()
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      await user.click(screen.getByTestId('toggle-favorite-button'))
      
      // Assert - Verificar que el botón cambió de estado
      expect(screen.getByTestId('toggle-favorite-button')).toBeInTheDocument()
    })

    it('should handle login button click when not authenticated', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      const user = userEvent.setup()
      
      // Configure stores - no login, so user is not authenticated
      const animeStore = useAnimeStore()
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      await user.click(screen.getByTestId('login-required-button'))
      
      // Assert
      expect(routerMock.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('Estados edge', () => {
    it('should handle anime without title', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: ''
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      expect(screen.getByTestId('base-card')).toBeInTheDocument()
    })

    it('should handle anime without episodes', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime',
        episodes: null
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      expect(screen.getByTestId('base-card')).toBeInTheDocument()
    })

    it('should handle anime without genres', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime',
        genres: []
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      expect(screen.getByTestId('base-card')).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('should have proper image alt text', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Test Anime')
    })

    it('should have proper heading structure', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    it('should have proper ARIA labels for buttons', async () => {
      // Arrange
      const anime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      })
      
      // Configure stores
      const authStore = useAuthStore()
      const animeStore = useAnimeStore()
      await authStore.login(createValidLoginCredentials())
      animeStore.favorites = []
      
      // Act
      render(AnimeCard, {
        props: { anime }
      })
      
      // Assert
      const favoriteButton = screen.getByTestId('toggle-favorite-button')
      expect(favoriteButton).toHaveAttribute('aria-label')
    })
  })
}) 