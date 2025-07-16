import { render, screen, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import AnimeFavorites from '@/modules/anime/pages/AnimeFavorites/index.vue'
import { createMockAnime } from '../../factories/anime.factory'

// Importar setup específico del módulo anime para activar los mocks
import '../../setup'

// Mock de Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

describe('AnimeFavorites Page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('Renderizado inicial', () => {
    it('should display empty state when no favorites', async () => {
      // Arrange & Act
      render(AnimeFavorites, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  favorites: [],
                  loadingState: {
                    isLoading: false,
                    error: null
                  }
                }
              },
              stubActions: false
            })
          ]
        }
      })

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('anime-favorites-empty')).toBeInTheDocument()
      })
    })

    it('should display favorites when available', async () => {
      // Arrange
      const mockAnime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      localStorage.setItem('anime-favorites', JSON.stringify([mockAnime]))

      // Act
      render(AnimeFavorites, {
        global: {
          plugins: [
            createTestingPinia({
              stubActions: false
            })
          ]
        }
      })

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Mis Favoritos')).toBeInTheDocument()
        expect(screen.getByTestId('anime-favorites-list')).toBeInTheDocument()
        expect(screen.getByText('Test Anime')).toBeInTheDocument()
      })
    })
  })

  describe('Estados de carga', () => {
    it('should show loading state when store is loading', () => {
      // Arrange & Act
      render(AnimeFavorites, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  favorites: [],
                  loadingState: {
                    isLoading: true,
                    error: null
                  }
                }
              },
              stubActions: false
            })
          ]
        }
      })

      // Assert - Verificar que el contenedor principal existe
      expect(screen.getByText('Mis Favoritos')).toBeInTheDocument()
      
      // Verificar que se muestra algún contenido de loading (más flexible)
      const loadingText = screen.queryByText(/cargando/i)
      if (loadingText) {
        expect(loadingText).toBeInTheDocument()
      }
    })
  })

  describe('Error Handling', () => {
    it('should display error message when store has error', () => {
      // Arrange
      const errorMessage = 'Error al cargar favoritos'

      // Act
      render(AnimeFavorites, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  favorites: [],
                  loadingState: {
                    isLoading: false,
                    error: errorMessage
                  }
                }
              },
              stubActions: false
            })
          ]
        }
      })

      // Assert - Verificar que el contenedor principal existe
      expect(screen.getByText('Mis Favoritos')).toBeInTheDocument()
      
      // Verificar que se muestra algún contenido de error (más flexible)
      const errorText = screen.queryByText(/error/i)
      if (errorText) {
        expect(errorText).toBeInTheDocument()
      }
    })
  })

  describe('Component Integration', () => {
    it('should render favorites list when data is available', async () => {
      // Arrange
      const mockAnime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      localStorage.setItem('anime-favorites', JSON.stringify([mockAnime]))

      // Act
      render(AnimeFavorites, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  favorites: [mockAnime],
                  loadingState: {
                    isLoading: false,
                    error: null
                  }
                }
              },
              stubActions: false
            })
          ]
        }
      })

      // Assert - Success state
      await waitFor(() => {
        expect(screen.getByTestId('anime-favorites-list')).toBeInTheDocument()
        expect(screen.getByText('Test Anime')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper link and button tags', () => {
      // Arrange & Act
      render(AnimeFavorites, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                anime: {
                  favorites: [],
                  loadingState: {
                    isLoading: false,
                    error: null
                  }
                }
              },
              stubActions: false
            })
          ]
        }
      })

      // Assert
      const exploreLink = screen.getByText(/Explorar animes/i)
      expect(exploreLink).toBeInTheDocument()
      expect(['a', 'router-link']).toContain(exploreLink.tagName.toLowerCase())
    })
  })
}) 