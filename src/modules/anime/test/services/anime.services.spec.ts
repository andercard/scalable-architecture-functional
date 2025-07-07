import { describe, it, expect, beforeEach, vi } from 'vitest'
import { animeApi } from '../../services/anime.services'

// Mock de la API base
vi.mock('@/core/api', () => ({
  ApiInstance: {
    get: vi.fn()
  }
}))

// Mock de executeRequest
vi.mock('../../../core/either', () => ({
  executeRequest: vi.fn()
}))

describe('Anime Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API functions existence', () => {
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

    it('has getAnimeRecommendations function', () => {
      expect(typeof animeApi.getAnimeRecommendations).toBe('function')
    })

    it('has getAnimeStats function', () => {
      expect(typeof animeApi.getAnimeStats).toBe('function')
    })

    it('has getAnimeByGenre function', () => {
      expect(typeof animeApi.getAnimeByGenre).toBe('function')
    })
  })

  describe('Function signatures', () => {
    it('should accept correct parameters for getAnimeList', () => {
      // Arrange
      const params = { page: 1, limit: 20 }
      
      // Act & Assert - Verificar que la función existe y es callable
      expect(() => {
        animeApi.getAnimeList(params)
      }).not.toThrow()
    })

    it('should accept correct parameters for getAnimeById', () => {
      // Arrange
      const id = 123
      
      // Act & Assert
      expect(() => {
        animeApi.getAnimeById(id)
      }).not.toThrow()
    })

    it('should accept correct parameters for getTopAnime', () => {
      // Arrange
      const page = 1
      const limit = 20
      
      // Act & Assert
      expect(() => {
        animeApi.getTopAnime(page, limit)
      }).not.toThrow()
    })

    it('should accept correct parameters for searchAnime', () => {
      // Arrange
      const query = 'Naruto'
      const page = 1
      const limit = 20
      
      // Act & Assert
      expect(() => {
        animeApi.searchAnime(query, page, limit)
      }).not.toThrow()
    })

    it('should accept correct parameters for getAnimeCharacters', () => {
      // Arrange
      const id = 456
      
      // Act & Assert
      expect(() => {
        animeApi.getAnimeCharacters(id)
      }).not.toThrow()
    })

    it('should accept correct parameters for getAnimeRecommendations', () => {
      // Arrange
      const id = 789
      
      // Act & Assert
      expect(() => {
        animeApi.getAnimeRecommendations(id)
      }).not.toThrow()
    })

    it('should accept correct parameters for getAnimeStats', () => {
      // Arrange
      const id = 101
      
      // Act & Assert
      expect(() => {
        animeApi.getAnimeStats(id)
      }).not.toThrow()
    })

    it('should accept correct parameters for getAnimeByGenre', () => {
      // Arrange
      const genreId = 1
      const page = 1
      const limit = 20
      
      // Act & Assert
      expect(() => {
        animeApi.getAnimeByGenre(genreId, page, limit)
      }).not.toThrow()
    })
  })

  describe('Returned values', () => {
    it('returns all expected API functions', () => {
      const expectedFunctions = [
        'getAnimeList',
        'getAnimeById', 
        'getTopAnime',
        'getSeasonalAnime',
        'searchAnime',
        'getAnimeCharacters',
        'getAnimeRecommendations',
        'getAnimeStats',
        'getAnimeByGenre'
      ]

      expectedFunctions.forEach(funcName => {
        expect(animeApi).toHaveProperty(funcName)
        expect(typeof animeApi[funcName as keyof typeof animeApi]).toBe('function')
      })
    })

    it('returns functions for all API methods', () => {
      Object.values(animeApi).forEach(method => {
        expect(typeof method).toBe('function')
      })
    })

    it('should return Promise for all API methods', () => {
      const testParams = {
        getAnimeList: [{}],
        getAnimeById: [123],
        getTopAnime: [1, 20],
        getSeasonalAnime: [1, 20],
        searchAnime: ['test', 1, 20],
        getAnimeCharacters: [123],
        getAnimeRecommendations: [123],
        getAnimeStats: [123],
        getAnimeByGenre: [1, 1, 20]
      }

      Object.entries(testParams).forEach(([methodName, params]) => {
        const method = animeApi[methodName as keyof typeof animeApi] as (...args: unknown[]) => Promise<unknown>
        const result = method(...params)
        expect(result).toBeInstanceOf(Promise)
      })
    })
  })

  describe('API object structure', () => {
    it('should be a non-null object', () => {
      expect(animeApi).toBeDefined()
      expect(typeof animeApi).toBe('object')
      expect(animeApi).not.toBeNull()
    })

    it('should have the correct number of methods', () => {
      const methodCount = Object.keys(animeApi).length
      expect(methodCount).toBe(9) // getAnimeList, getAnimeById, getTopAnime, getSeasonalAnime, searchAnime, getAnimeCharacters, getAnimeRecommendations, getAnimeStats, getAnimeByGenre
    })

    it('should not have any non-function properties', () => {
      Object.values(animeApi).forEach(value => {
        expect(typeof value).toBe('function')
      })
    })
  })
}) 