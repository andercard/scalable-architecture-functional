import { render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import type { RenderOptions } from '@testing-library/vue'
import type { Anime } from '../../types'

/**
 * Utilidades de testing específicas para el módulo anime
 * 
 * Estas utilidades facilitan la creación de tests consistentes y mantenibles
 * para componentes y páginas del módulo anime.
 */

/**
 * Opciones para renderizar componentes con configuración de anime
 */
interface AnimeRenderOptions extends Omit<RenderOptions<any>, 'global'> {
  favorites?: Anime[]
  animes?: Anime[]
  currentAnime?: Anime | null
  isLoading?: boolean
  error?: string | null
  searchQuery?: string
  currentPage?: number
  totalItems?: number
}

/**
 * Renderiza un componente con configuración específica del módulo anime
 * 
 * @param component - Componente Vue a renderizar
 * @param options - Opciones de configuración
 * @returns Resultado del render con configuración de anime
 */
export function renderWithAnimeConfig(
  component: any,
  options: AnimeRenderOptions = {}
) {
  const {
    favorites = [],
    animes = [],
    currentAnime = null,
    isLoading = false,
    error = null,
    searchQuery = '',
    currentPage = 1,
    totalItems = 0,
    ...renderOptions
  } = options

  const pinia = createTestingPinia({
    initialState: {
      anime: {
        favorites,
        animes,
        currentAnime,
        isLoading,
        error,
        searchQuery,
        currentPage,
        totalItems
      }
    }
  })

  return render(component, {
    global: {
      plugins: [pinia]
    },
    ...renderOptions
  })
}

/**
 * Configuración de testing para diferentes estados del módulo anime
 */
export const animeTestConfigs = {
  // Estado de carga
  loading: {
    favorites: [],
    animes: [],
    currentAnime: null,
    isLoading: true,
    error: null
  },

  // Estado de error
  error: (message: string = 'Error de prueba') => ({
    favorites: [],
    animes: [],
    currentAnime: null,
    isLoading: false,
    error: message
  }),

  // Estado con favoritos
  withFavorites: (favorites: Anime[]) => ({
    favorites,
    animes: [],
    currentAnime: null,
    isLoading: false,
    error: null
  }),

  // Estado con lista de animes
  withAnimeList: (animes: Anime[]) => ({
    favorites: [],
    animes,
    currentAnime: null,
    isLoading: false,
    error: null
  }),

  // Estado con anime actual
  withCurrentAnime: (anime: Anime) => ({
    favorites: [],
    animes: [],
    currentAnime: anime,
    isLoading: false,
    error: null
  }),

  // Estado vacío
  empty: {
    favorites: [],
    animes: [],
    currentAnime: null,
    isLoading: false,
    error: null
  }
}

/**
 * Helper para crear mocks de respuestas de API exitosas
 */
export const createApiSuccessResponse = <T>(data: T) => ({
  _tag: 'Right',
  value: { data },
  isLeft: false,
  isRight: true,
  fold: (onFailure: (error: string) => void, onSuccess: (data: T) => void) => {
    onSuccess(data)
    return data
  }
})

/**
 * Helper para crear mocks de respuestas de API fallidas
 */
export const createApiFailureResponse = (error: string) => ({
  _tag: 'Left',
  value: { message: error },
  isLeft: true,
  isRight: false,
  fold: (onFailure: (error: string) => void, onSuccess?: (data: any) => void) => {
    onFailure(error)
    return error
  }
})

/**
 * Helper para limpiar localStorage y mocks entre tests
 */
export const cleanupAnimeTests = () => {
  localStorage.clear()
  // Limpiar mocks específicos del módulo anime si es necesario
}

/**
 * Helper para simular operaciones asíncronas
 */
export const waitForAsync = (ms: number = 100) => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Helper para verificar que un elemento está en el DOM
 */
export const expectElementToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument()
}

/**
 * Helper para verificar que un elemento no está en el DOM
 */
export const expectElementNotToBeInDocument = (element: HTMLElement | null) => {
  expect(element).not.toBeInTheDocument()
}

/**
 * Helper para verificar el estado del store
 */
export const expectStoreState = (store: any, expectedState: Partial<any>) => {
  Object.entries(expectedState).forEach(([key, value]) => {
    expect(store[key]).toEqual(value)
  })
}

/**
 * Helper para verificar que se emitió un evento
 */
export const expectEventEmitted = (emitted: any, eventName: string, times: number = 1) => {
  expect(emitted()).toHaveProperty(eventName)
  expect(emitted()[eventName]).toHaveLength(times)
}

/**
 * Helper para verificar que no se emitió un evento
 */
export const expectEventNotEmitted = (emitted: any, eventName: string) => {
  expect(emitted()).not.toHaveProperty(eventName)
} 