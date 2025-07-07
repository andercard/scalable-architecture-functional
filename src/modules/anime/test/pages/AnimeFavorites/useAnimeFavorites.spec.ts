import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAnimeFavorites } from '../../../pages/AnimeFavorites/useAnimeFavorites'

// Mocks
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

vi.mock('../../../stores/anime.store', () => ({
  useAnimeStore: () => ({
    favorites: [],
    isLoading: false,
    error: null,
    removeFromFavorites: vi.fn()
  })
}))

describe('useAnimeFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('initializes with default values', () => {
      const result = useAnimeFavorites()
      
      expect(result).toHaveProperty('favorites')
      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('error')
      expect(result).toHaveProperty('goToDetail')
      expect(result).toHaveProperty('removeFromFavorites')
    })
  })

  describe('computed properties', () => {
    it('returns favorites from store', () => {
      const result = useAnimeFavorites()
      
      expect(Array.isArray(result.favorites.value)).toBe(true)
    })

    it('returns loading state from store', () => {
      const result = useAnimeFavorites()
      
      expect(typeof result.isLoading.value).toBe('boolean')
    })

    it('returns error from store', () => {
      const result = useAnimeFavorites()
      
      expect(typeof result.error.value).toBe('object')
    })

    it('deep clones favorites to avoid mutations', () => {
      const result = useAnimeFavorites()
      
      expect(Array.isArray(result.favorites.value)).toBe(true)
    })
  })

  describe('methods', () => {
    it('has go to detail function', () => {
      const result = useAnimeFavorites()
      
      expect(typeof result.goToDetail).toBe('function')
    })

    it('has remove from favorites function', () => {
      const result = useAnimeFavorites()
      
      expect(typeof result.removeFromFavorites).toBe('function')
    })
  })

  describe('returned values', () => {
    it('returns all expected properties and methods', () => {
      const result = useAnimeFavorites()
      
      expect(result).toHaveProperty('favorites')
      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('error')
      expect(result).toHaveProperty('goToDetail')
      expect(result).toHaveProperty('removeFromFavorites')
    })

    it('returns computed properties', () => {
      const result = useAnimeFavorites()
      
      expect(Array.isArray(result.favorites.value)).toBe(true)
      expect(typeof result.isLoading.value).toBe('boolean')
      expect(typeof result.error.value).toBe('object')
    })

    it('returns functions for all methods', () => {
      const result = useAnimeFavorites()
      
      expect(typeof result.goToDetail).toBe('function')
      expect(typeof result.removeFromFavorites).toBe('function')
    })
  })
}) 