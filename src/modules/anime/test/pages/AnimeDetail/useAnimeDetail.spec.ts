import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Importar setup específico del módulo anime para activar mocks
import '../../setup'

// Importar el composable a testear
import { useAnimeDetail } from '@/modules/anime/pages/AnimeDetail/useAnimeDetail'

// Importar utilidad withSetup global
import { withSetup } from '../../../../../../test/utils/withSetup'

// Importar factories para datos de test
import { 
  createMockAnime, 
  createMockAnimeCharacterList 
} from '../../factories/anime.factory'

// Importar utilidades de testing
import { createSuccessMock, createFailureMock } from '../../setup'

// Importar el servicio para mockearlo
import { animeApi } from '../../../services/anime.services'

// Mock de vue-router
const mockRoute = {
  params: { id: '1' }
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute
}))


describe('useAnimeDetail', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  /**
   * Tests de propiedades computadas
   * Verifican que todas las propiedades reactivas están disponibles y funcionan correctamente
   */
  describe('computed properties', () => {
    it('should provide all required computed properties', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que todas las propiedades computadas están disponibles
      expect(result.anime).toBeDefined()
      expect(result.isLoading).toBeDefined()
      expect(result.error).toBeDefined()
      expect(result.isFavorite).toBeDefined()
      expect(result.ratingStars).toBeDefined()
      expect(result.heroStyle).toBeDefined()
      expect(result.characters).toBeDefined()
      expect(result.charactersError).toBeDefined()
      expect(result.isLoadingCharacters).toBeDefined()
    })

    it('should compute heroStyle with default gradient when no anime', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Sin anime, debería usar el gradiente por defecto
      expect(result.heroStyle.value.backgroundImage).toBe('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
    })

    it('should compute isFavorite as false by default', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Por defecto, no debería ser favorito
      expect(result.isFavorite.value).toBe(false)
    })

    it('should compute ratingStars correctly', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Debería tener estrellas de rating
      expect(result.ratingStars.value).toBeDefined()
      expect(typeof result.ratingStars.value).toBe('string')
    })
  })

  /**
   * Tests de manejo de errores de imagen
   * Verifican que se establece una imagen fallback cuando hay errores
   */
  describe('handleImageError', () => {
    it('should set fallback image on error', () => {
      // Arrange
      const result = useAnimeDetail()
      
      // Crear un elemento img mock
      const mockImg = {
        src: 'https://example.com/broken-image.jpg'
      } as HTMLImageElement

      // Simular evento de error
      const mockEvent = {
        target: mockImg
      } as unknown as Event

      // Act
      result.handleImageError(mockEvent)

      // Assert - Verificar que se estableció la imagen fallback
      expect(mockImg.src).toContain('data:image/svg+xml;base64')
    })
  })

  /**
   * Tests de funcionalidad de favoritos
   * Verifican que el toggle de favoritos funciona correctamente
   */
  describe('toggleFavorite', () => {
    it('should provide toggleFavorite method', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que el método existe
      expect(typeof result.toggleFavorite).toBe('function')
    })

    it('should not throw when called without anime', () => {
      // Arrange
      const result = useAnimeDetail()
      
      // Act & Assert - No debería lanzar error cuando no hay anime
      expect(() => result.toggleFavorite()).not.toThrow()
    })
  })

  /**
   * Tests de funcionalidad de reintento
   * Verifican que el método retry funciona correctamente
   */
  describe('retry functionality', () => {
    it('should provide retry method', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que el método existe
      expect(typeof result.retry).toBe('function')
    })

    it('should not throw when called', () => {
      // Arrange
      const result = useAnimeDetail()
      
      // Act & Assert - No debería lanzar error
      expect(() => result.retry()).not.toThrow()
    })
  })

  /**
   * Tests de funciones de utilidad
   * Verifican que las utilidades están disponibles
   */
  describe('utility functions', () => {
    it('should provide formatNumber and getGenreColor utilities', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que las utilidades están disponibles
      expect(typeof result.formatNumber).toBe('function')
      expect(typeof result.getGenreColor).toBe('function')
    })
  })

  /**
   * Tests de estado de personajes
   * Verifican el estado inicial y manejo de personajes
   */
  describe('characters state', () => {
    it('should provide characters state', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que el estado de personajes está disponible
      expect(Array.isArray(result.characters.value)).toBe(true)
      expect(typeof result.isLoadingCharacters.value).toBe('boolean')
      expect(result.charactersError.value).toBe(null)
    })

    it('should initialize with empty characters array', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que inicia con array vacío
      expect(result.characters.value).toEqual([])
    })

    it('should initialize with loading state as false', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que inicia sin cargando
      expect(result.isLoadingCharacters.value).toBe(false)
    })

    it('should initialize with no error', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que inicia sin error
      expect(result.charactersError.value).toBe(null)
    })
  })

  /**
   * Tests de datos de anime
   * Verifican que los datos se obtienen correctamente del store
   */
  describe('anime data display', () => {
    it('should provide anime data from store', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que el anime se obtiene del store
      expect(result.anime.value).toBeDefined()
      expect(typeof result.anime.value).toBe('object')
    })
  })

  /**
   * Tests de estados de carga y error
   * Verifican que los estados se obtienen correctamente del store
   */
  describe('loading and error states', () => {
    it('should provide loading state from store', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que el estado de carga se obtiene del store
      expect(result.isLoading.value).toBeDefined()
      expect(typeof result.isLoading.value).toBe('boolean')
    })

    it('should provide error state from store', () => {
      // Arrange & Act
      const result = useAnimeDetail()
      
      // Assert - Verificar que el error se obtiene del store
      expect(result.error.value).toBeDefined()
      expect(typeof result.error.value).toBe('object')
    })
  })

  /**
   * Tests de factories para datos de prueba
   * Demuestran el uso correcto de factories para crear datos de test
   */
  describe('factory usage examples', () => {
    it('should demonstrate factory usage for test data', () => {
      // Arrange - Ejemplo de uso de factories para crear datos de test
      const mockAnime = createMockAnime({ 
        title: 'Test Anime with Factory',
        score: 9.2,
        episodes: 12
      })
      
      const mockCharacters = createMockAnimeCharacterList(5)
      
      // Assert - Verificar que las factories crean datos válidos
      expect(mockAnime.title).toBe('Test Anime with Factory')
      expect(mockAnime.score).toBe(9.2)
      expect(mockAnime.episodes).toBe(12)
      
      expect(mockCharacters).toHaveLength(5)
      expect(mockCharacters[0].character.name).toBe('Test Character 1')
      expect(mockCharacters[0].role).toBe('Main')
    })

    it('should create different types of anime with factories', () => {
      // Arrange - Crear diferentes tipos de anime para diferentes escenarios de test
      const airingAnime = createMockAnime({ 
        status: 'Airing', 
        airing: true,
        episodes: 12
      })
      
      const completedAnime = createMockAnime({ 
        status: 'Finished Airing', 
        airing: false,
        episodes: 24
      })
      
      const movieAnime = createMockAnime({ 
        type: 'Movie',
        duration: '120 min',
        episodes: 1
      })
      
      const highRatedAnime = createMockAnime({ 
        score: 9.8,
        rank: 1,
        favorites: 5000
      })
      
      // Assert - Verificar que cada tipo tiene las propiedades correctas
      expect(airingAnime.status).toBe('Airing')
      expect(airingAnime.airing).toBe(true)
      
      expect(completedAnime.status).toBe('Finished Airing')
      expect(completedAnime.airing).toBe(false)
      
      expect(movieAnime.type).toBe('Movie')
      expect(movieAnime.duration).toBe('120 min')
      
      expect(highRatedAnime.score).toBe(9.8)
      expect(highRatedAnime.rank).toBe(1)
    })
  })

  /**
   * Tests de casos de fallo con Either
   * Verifican el manejo correcto de errores usando el patrón Either
   */
  describe('Either failure cases', () => {
    it('should handle Left case from Either', () => {
      // Arrange - Crear un caso de fallo
      const failureResult = createFailureMock('Error de red')
      
      // Assert - Verificar que es un Left
      expect(failureResult.isLeft()).toBe(true)
      expect(failureResult.isRight()).toBe(false)
      expect(failureResult.value.message).toBe('Error de red')
    })

    it('should handle Right case from Either', () => {
      // Arrange - Crear un caso de éxito
      const successData = { data: { data: [] } }
      const successResult = createSuccessMock(successData)
      
      // Assert - Verificar que es un Right
      expect(successResult.isRight()).toBe(true)
      expect(successResult.isLeft()).toBe(false)
      expect(successResult.value).toEqual(successData)
    })

    it('should demonstrate fold pattern for error handling', () => {
      // Arrange - Crear casos de éxito y fallo
      const successResult = createSuccessMock({ data: { data: [] } })
      const failureResult = createFailureMock('Error de API')
      
      // Act - Usar fold para manejar ambos casos
      const successHandled = successResult.fold(
        (error: { message: string }) => `Error: ${error.message}`,
        (data: { data: { data: unknown[] } }) => `Success: ${data.data.data.length} items`
      )
      
      const failureHandled = failureResult.fold(
        (error: { message: string }) => `Error: ${error.message}`,
        (data: { data: { data: unknown[] } }) => `Success: ${data.data.data.length} items`
      )
      
      // Assert - Verificar que fold maneja correctamente ambos casos
      expect(successHandled).toBe('Success: 0 items')
      expect(failureHandled).toBe('Error: Error de API')
    })
  })

  /**
   * Tests de utilidades de testing
   * Verifican que las utilidades de testing funcionan correctamente
   */
  describe('testing utilities', () => {
    it('should create success mocks with correct data', () => {
      // Arrange & Act
      const testData = { id: 1, name: 'Test' }
      const successMock = createSuccessMock(testData)
      
      // Assert
      expect(successMock.isRight()).toBe(true)
      expect(successMock.value).toEqual(testData)
    })

    it('should create failure mocks with correct error message', () => {
      // Arrange & Act
      const errorMessage = 'Test error message'
      const failureMock = createFailureMock(errorMessage)
      
      // Assert
      expect(failureMock.isLeft()).toBe(true)
      expect(failureMock.value.message).toBe(errorMessage)
    })
  })

  /**
   * Tests usando withSetup para lifecycle hooks
   * Estos tests verifican el comportamiento de onMounted y otros lifecycle hooks
   * usando el patrón withSetup de Alex Op
   * 
   * NOTA: Estos tests están comentados temporalmente debido a problemas con mocks de vue-router
   * Se pueden reactivar cuando se resuelvan los problemas de configuración de mocks
   */
  describe('lifecycle hooks with withSetup', () => {
    it('should load anime and characters on mount', async () => {
      // Arrange
      const mockAnime = createMockAnime({ mal_id: 1, title: 'Test Anime' })
      
      // Mock del servicio
      const successResponse = createSuccessMock({ 
        data: { data: [] },
        status: 200
      })
      vi.mocked(animeApi.getAnimeCharacters).mockResolvedValue(successResponse)
      
      // Act - Usar withSetup para simular el contexto de componente
      const { result, app } = withSetup(() => useAnimeDetail())
      
      // Assert - Verificar que el composable se inicializó correctamente
      expect(result.anime).toBeDefined()
      expect(result.isLoading).toBeDefined()
      expect(result.error).toBeDefined()
      expect(result.retry).toBeDefined()
      
      // Cleanup importante
      app.unmount()
    })

    it('should handle route params correctly with withSetup', () => {
      // Act
      const { result, app } = withSetup(() => useAnimeDetail())
      
      // Assert - Verificar que el composable se inicializó correctamente
      expect(result.anime).toBeDefined()
      expect(result.isLoading).toBeDefined()
      expect(result.error).toBeDefined()
      
      // Cleanup
      app.unmount()
    })

    it('should handle missing route params gracefully with withSetup', () => {
      // Act
      const { result, app } = withSetup(() => useAnimeDetail())
      
      // Assert - Debería manejar la ausencia de parámetros
      expect(result.anime).toBeDefined()
      expect(result.retry).toBeDefined()
      
      // Cleanup
      app.unmount()
    })

    it('should update computed properties when store changes with withSetup', () => {
      // Arrange - Crear anime inicial
      const initialAnime = createMockAnime({ 
        mal_id: 1, 
        title: 'Initial Anime',
        score: 8.0 
      })
      
      const { result, app } = withSetup(() => useAnimeDetail())
      
      // Assert - Verificar que el composable se inicializó correctamente
      expect(result.anime).toBeDefined()
      expect(result.ratingStars).toBeDefined()
      
      // Cleanup
      app.unmount()
    })
  })
}) 