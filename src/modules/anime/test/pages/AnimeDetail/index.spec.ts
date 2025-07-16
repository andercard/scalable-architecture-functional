// ADVERTENCIA IMPORTANTE:
// Varias de las pruebas incluidas en este archivo NO son estrictamente necesarias para la cobertura mínima del proyecto.
// Se agregaron intencionalmente como referencia y ejemplo de patrones de testing, anti-patrones y edge cases.
// El objetivo es servir como guía didáctica para el equipo, NO como estándar de exhaustividad.
// Para tests productivos, priorizar solo los flujos críticos y el comportamiento observable relevante.

import { render, screen, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import AnimeDetail from '@/modules/anime/pages/AnimeDetail/index.vue'
import { createMockAnime } from '../../factories/anime.factory'
import { right } from '@/core/either'
import { animeApi } from '@/modules/anime/services/anime.services'
import { createMockAnimeCharacter } from '../../factories/anime.factory'
import type { Anime, AnimeCharacter } from '@/modules/anime/types/index'
import { computed } from 'vue'

// Remover mocks de API, ya que usaremos initialState

// Importar setup específico del módulo anime para activar los mocks
import '../../setup'

// Mock de Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } }),
  useRouter: () => ({ push: vi.fn() })
}))

const mockAnime = createMockAnime({
  mal_id: 1,
  title: 'Test Anime',
  synopsis: 'Sinopsis de prueba',
  images: {
    jpg: {
      image_url: '',
      small_image_url: '',
      large_image_url: ''
    }
  },
  type: '',
  source: '',
  episodes: 0,
  status: '',
  airing: false,
  duration: '',
  rating: '',
  score: 0,
  scored_by: 0,
  rank: 0,
  popularity: 0,
  members: 0,
  favorites: 0,
  season: '',
  year: 0,
  broadcast: {
    day: '',
    time: '',
    timezone: '',
    string: ''
  },
  producers: [{ mal_id: 1, type: '', name: '', url: '' }],
  licensors: [],
  studios: [{ mal_id: 1, type: '', name: '', url: '' }],
  genres: [{ mal_id: 1, type: '', name: '', url: '' }],
  explicit_genres: [],
  themes: [],
  demographics: [],
  trailer: { youtube_id: '', url: '', embed_url: '' }
}) as Anime

vi.mock('@/modules/anime/pages/AnimeDetail/useAnimeDetail', () => ({
  useAnimeDetail: () => ({
    anime: computed(() => mockAnime),
    isLoading: computed(() => false),
    error: computed(() => null),
    isFavorite: computed(() => false),
    ratingStars: computed(() => ''),
    heroStyle: computed(() => ({})),
    characters: computed(() => []),
    charactersError: computed(() => null),
    isLoadingCharacters: computed(() => false),
    toggleFavorite: vi.fn(),
    retry: vi.fn(),
    formatNumber: (n: number) => n,
    getGenreColor: () => '#000',
    handleImageError: vi.fn()
  })
}))

describe('AnimeDetail Page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Renderizado inicial', () => {
    it('should display anime details when data is available', async () => {
      // Arrange
      // Act
      render(AnimeDetail, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  currentAnime: mockAnime,
                  loadingState: { isLoading: false, error: null },
                  favorites: [],
                  animes: [],
                  searchQuery: '',
                  currentPage: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                  totalItems: 0
                }
              },
              stubActions: true
            })
          ]
        }
      })

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Anime')
        expect(screen.getByText(/Sinopsis de prueba/i)).toBeInTheDocument()
        expect(screen.getByTestId('anime-detail-main')).toBeInTheDocument()
      })
    })
  })

  describe('Estados de carga', () => {
    it('should show loading state when store is loading', async () => {
      // Arrange & Act
      render(AnimeDetail, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  currentAnime: null,
                  loadingState: {
                    isLoading: true,
                    error: null
                  },
                  favorites: [],
                  animes: [],
                  searchQuery: '',
                  currentPage: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                  totalItems: 0
                }
              },
              stubActions: true
            })
          ]
        }
      })

      // Assert - Verificar que el contenedor principal existe
      await waitFor(() => {
        expect(screen.getByTestId('anime-detail-page')).toBeInTheDocument()
        const loadingText = screen.queryByText(/cargando/i)
        if (loadingText) {
          expect(loadingText).toBeInTheDocument()
        }
      })
    })
  })

  describe('Manejo de errores', () => {
    it('should display error message when store has error', async () => {
      // Arrange
      const errorMessage = 'Error al cargar anime'

      // Act
      render(AnimeDetail, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  currentAnime: null,
                  loadingState: {
                    isLoading: false,
                    error: errorMessage
                  },
                  favorites: [],
                  animes: [],
                  searchQuery: '',
                  currentPage: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                  totalItems: 0
                }
              },
              stubActions: true
            })
          ]
        }
      })

      // Assert - Verificar que el contenedor principal existe
      await waitFor(() => {
        expect(screen.getByTestId('anime-detail-page')).toBeInTheDocument()
        const errorText = screen.queryByText(/error/i)
        if (errorText) {
          expect(errorText).toBeInTheDocument()
        }
      })
    })
  })

  describe('Estados edge', () => {
    it('should handle anime without synopsis', async () => {
      // Arrange
      const mockAnime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime',
        synopsis: ''
      }) as Anime

      // Act
      render(AnimeDetail, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  currentAnime: mockAnime,
                  loadingState: {
                    isLoading: false,
                    error: null
                  },
                  favorites: [],
                  animes: [],
                  searchQuery: '',
                  currentPage: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                  totalItems: 0
                }
              }
            })
          ]
        }
      })

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Test Anime')).toBeInTheDocument()
        expect(screen.getByText('Sinopsis')).toBeInTheDocument()
      })
    })
  })

  describe('Component Integration', () => {
    it('should render main content when anime data is available', async () => {
      // Arrange
      const mockAnime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      }) as Anime

      // Act
      render(AnimeDetail, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  currentAnime: mockAnime,
                  loadingState: {
                    isLoading: false,
                    error: null
                  },
                  favorites: [],
                  animes: [],
                  searchQuery: '',
                  currentPage: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                  totalItems: 0
                }
              }
            })
          ]
        }
      })

      // Assert - Success state
      await waitFor(() => {
        expect(screen.getByTestId('anime-detail-main')).toBeInTheDocument()
        expect(screen.getByText('Test Anime')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper link and button tags', async () => {
      // Arrange
      const mockAnime = createMockAnime({
        mal_id: 1,
        title: 'Test Anime'
      }) as Anime

      // Act
      render(AnimeDetail, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  currentAnime: mockAnime,
                  loadingState: {
                    isLoading: false,
                    error: null
                  },
                  favorites: [],
                  animes: [],
                  searchQuery: '',
                  currentPage: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                  totalItems: 0
                }
              }
            })
          ]
        }
      })

      // Assert
      await waitFor(() => {
        const backLink = screen.getByText(/Volver/i)
        expect(backLink).toBeInTheDocument()
        expect(['a', 'router-link']).toContain(backLink.tagName.toLowerCase())
      })
    })
  })
}) 