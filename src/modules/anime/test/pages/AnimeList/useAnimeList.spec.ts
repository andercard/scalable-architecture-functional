import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'
import { useAnimeList } from '../../../pages/AnimeList/useAnimeList'

// Mocks
vi.mock('@vueuse/core', () => ({
  useDebounceFn: vi.fn(() => vi.fn())
}))

vi.mock('../../../stores/anime.store', () => ({
  useAnimeStore: () => ({
    animes: ref([]),
    isLoading: computed(() => false),
    error: computed(() => null),
    currentPage: ref(1),
    totalAnimes: computed(() => 0),
    searchAnimes: vi.fn(),
    loadTopAnime: vi.fn(),
    loadSeasonalAnime: vi.fn(),
    loadAnimeList: vi.fn(),
    changePage: vi.fn()
  })
}))

describe('useAnimeList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('initializes with default values', () => {
      const result = useAnimeList()
      
      expect(result).toHaveProperty('searchQuery')
      expect(result).toHaveProperty('activeFilter')
      expect(result).toHaveProperty('animes')
      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('error')
      expect(result).toHaveProperty('currentPage')
      expect(result).toHaveProperty('totalItems')
      expect(result).toHaveProperty('handleSearch')
      expect(result).toHaveProperty('clearSearch')
      expect(result).toHaveProperty('loadTopAnime')
      expect(result).toHaveProperty('loadSeasonalAnime')
      expect(result).toHaveProperty('loadAllAnime')
      expect(result).toHaveProperty('retry')
      expect(result).toHaveProperty('handlePageChange')
    })

    it('initializes search query as empty string', () => {
      const result = useAnimeList()
      
      expect(result.searchQuery.value).toBe('')
    })

    it('initializes active filter as top', () => {
      const result = useAnimeList()
      
      expect(result.activeFilter.value).toBe('top')
    })
  })

  describe('search functionality', () => {
    it('updates search query', () => {
      const result = useAnimeList()
      
      result.searchQuery.value = 'test query'
      
      expect(result.searchQuery.value).toBe('test query')
    })

    it('has search handler function', () => {
      const result = useAnimeList()
      
      expect(typeof result.handleSearch).toBe('function')
    })

    it('has clear search function', () => {
      const result = useAnimeList()
      
      expect(typeof result.clearSearch).toBe('function')
    })
  })

  describe('pagination', () => {
    it('has page change handler', () => {
      const result = useAnimeList()
      
      expect(typeof result.handlePageChange).toBe('function')
    })
  })

  describe('data loading', () => {
    it('has load top anime function', () => {
      const result = useAnimeList()
      
      expect(typeof result.loadTopAnime).toBe('function')
    })

    it('has load seasonal anime function', () => {
      const result = useAnimeList()
      
      expect(typeof result.loadSeasonalAnime).toBe('function')
    })

    it('has load all anime function', () => {
      const result = useAnimeList()
      
      expect(typeof result.loadAllAnime).toBe('function')
    })

    it('has retry function', () => {
      const result = useAnimeList()
      
      expect(typeof result.retry).toBe('function')
    })
  })

  describe('returned values', () => {
    it('returns all expected properties and methods', () => {
      const result = useAnimeList()
      
      expect(result).toHaveProperty('searchQuery')
      expect(result).toHaveProperty('activeFilter')
      expect(result).toHaveProperty('animes')
      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('error')
      expect(result).toHaveProperty('currentPage')
      expect(result).toHaveProperty('totalItems')
      expect(result).toHaveProperty('handleSearch')
      expect(result).toHaveProperty('clearSearch')
      expect(result).toHaveProperty('loadTopAnime')
      expect(result).toHaveProperty('loadSeasonalAnime')
      expect(result).toHaveProperty('loadAllAnime')
      expect(result).toHaveProperty('retry')
      expect(result).toHaveProperty('handlePageChange')
    })

    it('returns reactive search query', () => {
      const result = useAnimeList()
      
      expect(typeof result.searchQuery.value).toBe('string')
    })

    it('returns functions for all methods', () => {
      const result = useAnimeList()
      
      expect(typeof result.handleSearch).toBe('function')
      expect(typeof result.clearSearch).toBe('function')
      expect(typeof result.handlePageChange).toBe('function')
      expect(typeof result.loadTopAnime).toBe('function')
      expect(typeof result.loadSeasonalAnime).toBe('function')
      expect(typeof result.loadAllAnime).toBe('function')
      expect(typeof result.retry).toBe('function')
    })
  })
}) 