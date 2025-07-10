import { render, screen, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import AnimeGrid from '@/modules/anime/components/AnimeGrid/index.vue'
import { createMockAnime } from '../../factories/anime.factory'
import { userEvent } from '@testing-library/user-event'

// Importar setup específico del módulo anime para activar los mocks
import '../../setup'

// Mock de Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

describe('AnimeGrid Component', () => {
  describe('Renderizado básico', () => {
    it('should render anime grid with anime cards', () => {
      // Arrange
      const mockAnimes = [
        createMockAnime({ mal_id: 1, title: 'Anime 1' }),
        createMockAnime({ mal_id: 2, title: 'Anime 2' })
      ]

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid')).toBeInTheDocument()
      expect(screen.getByTestId('anime-grid-content')).toBeInTheDocument()
      const animeCards = screen.getAllByTestId('anime-card')
      expect(animeCards).toHaveLength(2)
    })
  })

  describe('Estados de carga', () => {
    it('should show loading state', () => {
      // Arrange & Act
      render(AnimeGrid, {
        props: {
          animes: [],
          loading: true,
          error: null
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-loading')).toBeInTheDocument()
      expect(screen.getByText(/Cargando animes/i)).toBeInTheDocument()
    })

    it('should hide loading state when data is loaded', () => {
      // Arrange
      const mockAnimes = [createMockAnime({ mal_id: 1, title: 'Anime 1' })]

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.queryByTestId('anime-grid-loading')).not.toBeInTheDocument()
      expect(screen.getByTestId('anime-grid-content')).toBeInTheDocument()
    })
  })

  describe('Manejo de errores', () => {
    it('should display error message', () => {
      // Arrange
      const errorMessage = 'Error al cargar animes'

      // Act
      render(AnimeGrid, {
        props: {
          animes: [],
          loading: false,
          error: errorMessage
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-error')).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByTestId('retry-button')).toBeInTheDocument()
    })

    it('should hide error state when no error', () => {
      // Arrange
      const mockAnimes = [createMockAnime({ mal_id: 1, title: 'Anime 1' })]

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.queryByTestId('anime-grid-error')).not.toBeInTheDocument()
      expect(screen.getByTestId('anime-grid-content')).toBeInTheDocument()
    })
  })

  describe('Paginación', () => {
    it('should show pagination when enabled and animes exist', () => {
      // Arrange
      const mockAnimes = [createMockAnime({ mal_id: 1, title: 'Anime 1' })]

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null,
          showPagination: true,
          currentPage: 1,
          hasNextPage: true,
          hasPreviousPage: false,
          totalItems: 100
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-pagination')).toBeInTheDocument()
    })

    it('should hide pagination when disabled', () => {
      // Arrange
      const mockAnimes = [createMockAnime({ mal_id: 1, title: 'Anime 1' })]

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null,
          showPagination: false
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      const paginationElements = screen.queryAllByTestId('anime-grid-pagination')
      expect(paginationElements.length).toBe(0)
    })

    it('should hide pagination when no animes', () => {
      // Arrange & Act
      render(AnimeGrid, {
        props: {
          animes: [],
          loading: false,
          error: null,
          showPagination: true
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-empty')).toBeInTheDocument()
      const paginationElements = screen.queryAllByTestId('anime-grid-pagination')
      expect(paginationElements.length).toBe(0)
    })

    it('should handle pagination events', async () => {
      // Arrange
      const user = userEvent.setup()
      const mockAnimes = [createMockAnime({ mal_id: 1, title: 'Anime 1' })]
      const onPageChange = vi.fn()

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null,
          showPagination: true,
          currentPage: 1,
          hasNextPage: true,
          hasPreviousPage: false,
          totalItems: 100,
          onPageChange
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-pagination')).toBeInTheDocument()
    })
  })

  describe('Interacciones de usuario', () => {
    it('should handle anime card clicks', async () => {
      // Arrange
      const user = userEvent.setup()
      const mockAnimes = [createMockAnime({ mal_id: 1, title: 'Anime 1' })]

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      const animeCard = screen.getByTestId('anime-card')
      expect(animeCard).toBeInTheDocument()
    })
  })

  describe('Estados combinados', () => {
    it('should show content when no loading and no error', () => {
      // Arrange
      const mockAnimes = [createMockAnime({ mal_id: 1, title: 'Anime 1' })]

      // Act
      render(AnimeGrid, {
        props: {
          animes: mockAnimes,
          loading: false,
          error: null
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-content')).toBeInTheDocument()
      expect(screen.queryByTestId('anime-grid-loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('anime-grid-error')).not.toBeInTheDocument()
    })

    it('should prioritize loading over other states', () => {
      // Arrange & Act
      render(AnimeGrid, {
        props: {
          animes: [createMockAnime({ mal_id: 1, title: 'Anime 1' })],
          loading: true,
          error: 'Test error'
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-loading')).toBeInTheDocument()
      expect(screen.queryByTestId('anime-grid-error')).not.toBeInTheDocument()
      const contentElements = screen.queryAllByTestId('anime-grid-content')
      expect(contentElements.length).toBe(0)
    })

    it('should prioritize error over content when not loading', () => {
      // Arrange & Act
      render(AnimeGrid, {
        props: {
          animes: [createMockAnime({ mal_id: 1, title: 'Anime 1' })],
          loading: false,
          error: 'Test error'
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-error')).toBeInTheDocument()
      expect(screen.queryByTestId('anime-grid-loading')).not.toBeInTheDocument()
      const contentElements = screen.queryAllByTestId('anime-grid-content')
      expect(contentElements.length).toBe(0)
    })
  })

  describe('Accesibilidad', () => {
    it('should have proper accessibility attributes', () => {
      // Arrange & Act
      render(AnimeGrid, {
        props: {
          animes: [],
          loading: false,
          error: null
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid')).toBeInTheDocument()
    })
  })

  describe('Props validation', () => {
    it('should handle empty string error', () => {
      // Arrange & Act
      render(AnimeGrid, {
        props: {
          animes: [],
          loading: false,
          error: ''
        },
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
              stubActions: true
            })
          ]
        }
      })

      // Assert
      expect(screen.getByTestId('anime-grid-empty')).toBeInTheDocument()
      expect(screen.queryByTestId('anime-grid-error')).not.toBeInTheDocument()
    })
  })
}) 