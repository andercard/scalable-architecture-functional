import { vi } from 'vitest'
import { right, left } from '@/core/either'

/**
 * SETUP ESPECÍFICO PARA TESTS DEL MÓDULO ANIME
 * 
 * Basado en las mejores prácticas de testing:
 * - Solo mocks específicos del módulo
 * - Uso de Either real (no mockeado)
 * - Configuración limpia y mantenible
 * 
 * PRINCIPIOS:
 * - Mockeo selectivo de servicios
 * - Factories para datos de prueba
 * - Utilidades reutilizables
 */

/**
 * MOCKS DE SERVICIOS ESPECÍFICOS DEL MÓDULO
 * 
 * Los servicios retornan Either real, no mocks del Either
 */

// Mock de servicios específicos del módulo anime
vi.mock('@/modules/anime/services/anime.services', () => ({
  animeApi: {
    getAnimeList: vi.fn(() => Promise.resolve(right({ 
      data: [], 
      pagination: { items: { total: 0 } } 
    }))),
    getAnimeById: vi.fn(() => Promise.resolve(right({ data: {} }))),
    searchAnime: vi.fn(() => Promise.resolve(right({ 
      data: [], 
      pagination: { items: { total: 0 } } 
    }))),
    getTopAnime: vi.fn(() => Promise.resolve(right({ 
      data: [], 
      pagination: { items: { total: 0 } } 
    }))),
    getSeasonalAnime: vi.fn(() => Promise.resolve(right({ 
      data: [], 
      pagination: { items: { total: 0 } } 
    }))),
    getAnimeCharacters: vi.fn(() => Promise.resolve(right({ 
      data: { data: [] },
      status: 200
    }))),
    getAnimeRecommendations: vi.fn(() => Promise.resolve(right({ data: [] }))),
    getAnimeStats: vi.fn(() => Promise.resolve(right({ data: {} }))),
    getAnimeByGenre: vi.fn(() => Promise.resolve(right({ 
      data: [], 
      pagination: { items: { total: 0 } } 
    })))
  }
}))

/**
 * UTILIDADES PARA TESTING
 * 
 * Factories y helpers específicos del módulo anime
 */

// Helper para crear mocks de respuesta exitosa
export const createSuccessMock = <T>(data: T) => right(data)

// Helper para crear mocks de respuesta fallida
export const createFailureMock = (message: string) => left({ 
  code: 'API_ERROR', 
  reason: 'NETWORK_ERROR', 
  status: 500, 
  message 
})

// Helper para crear mocks de respuesta fallida específica
export const createFailureMockWithCode = (
  code: string,
  reason: string,
  status: number,
  message: string
) => left({ code, reason, status, message })

/**
 * UTILIDADES DE LIMPIEZA
 */

// Helper para limpiar mocks entre tests
export const clearAnimeMocks = () => {
  vi.clearAllMocks()
}

// Helper para limpiar localStorage entre tests
export const clearAnimeStorage = () => {
  localStorage.clear()
}

/**
 * CONFIGURACIÓN DE TESTING
 */

// Configuración específica para tests del módulo anime
export const animeTestConfig = {
  // Timeouts específicos para operaciones de anime
  timeouts: {
    apiCall: 5000,
    animation: 1000,
    loading: 2000
  },
  
  // Datos de prueba por defecto
  defaults: {
    animeId: 1,
    page: 1,
    limit: 20,
    searchQuery: 'test anime'
  }
} 