import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock completo de axios para evitar errores
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }))
  }
}))

// Mocks
vi.mock('../../../core/api', () => ({
  ApiInstance: {
    get: vi.fn()
  }
}))

vi.mock('../../../core/either', () => ({
  executeRequest: vi.fn()
}))

// Importar después de los mocks
import { animeApi } from '../../services/anime.services'

describe('Anime Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API functions', () => {
    it('has getAnimeList function', () => {
      expect(typeof animeApi.getAnimeList).toBe('function')
    })

    it('has getAnimeById function', () => {
      expect(typeof animeApi.getAnimeById).toBe('function')
    })

    it('has getTopAnime function', () => {
      expect(typeof animeApi.getTopAnime).toBe('function')
    })

    it('has getSeasonalAnime function', () => {
      expect(typeof animeApi.getSeasonalAnime).toBe('function')
    })

    it('has searchAnime function', () => {
      expect(typeof animeApi.searchAnime).toBe('function')
    })

    it('has getAnimeCharacters function', () => {
      expect(typeof animeApi.getAnimeCharacters).toBe('function')
    })
  })

  describe('returned values', () => {
    it('returns all expected API functions', () => {
      expect(animeApi).toHaveProperty('getAnimeList')
      expect(animeApi).toHaveProperty('getAnimeById')
      expect(animeApi).toHaveProperty('getTopAnime')
      expect(animeApi).toHaveProperty('getSeasonalAnime')
      expect(animeApi).toHaveProperty('searchAnime')
      expect(animeApi).toHaveProperty('getAnimeCharacters')
    })

    it('returns functions for all API methods', () => {
      expect(typeof animeApi.getAnimeList).toBe('function')
      expect(typeof animeApi.getAnimeById).toBe('function')
      expect(typeof animeApi.getTopAnime).toBe('function')
      expect(typeof animeApi.getSeasonalAnime).toBe('function')
      expect(typeof animeApi.searchAnime).toBe('function')
      expect(typeof animeApi.getAnimeCharacters).toBe('function')
    })
  })
}) 