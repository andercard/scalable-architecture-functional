import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAnimeGrid } from '../../../components/AnimeGrid/useAnimeGrid'
import type { AnimeGridProps, AnimeGridEmits } from '../../../components/AnimeGrid/animeGrid.types'

describe('useAnimeGrid', () => {
  let props: AnimeGridProps
  let emit: AnimeGridEmits

  beforeEach(() => {
    vi.clearAllMocks()
    
    props = {
      animes: [],
      loading: false,
      error: null,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      showPagination: true,
      totalItems: 0
    }
    
    emit = vi.fn() as any
  })

  describe('retry', () => {
    it('emits retry event', () => {
      const { retry } = useAnimeGrid(props, emit)
      
      retry()
      
      expect(emit).toHaveBeenCalledWith('retry')
    })
  })

  describe('handlePageChange', () => {
    it('emits pageChange event with correct page number', () => {
      const { handlePageChange } = useAnimeGrid(props, emit)
      
      handlePageChange(3)
      
      expect(emit).toHaveBeenCalledWith('pageChange', 3)
    })

    it('emits pageChange event with page 1', () => {
      const { handlePageChange } = useAnimeGrid(props, emit)
      
      handlePageChange(1)
      
      expect(emit).toHaveBeenCalledWith('pageChange', 1)
    })

    it('emits pageChange event with high page number', () => {
      const { handlePageChange } = useAnimeGrid(props, emit)
      
      handlePageChange(100)
      
      expect(emit).toHaveBeenCalledWith('pageChange', 100)
    })
  })

  describe('returned values', () => {
    it('returns retry and handlePageChange functions', () => {
      const result = useAnimeGrid(props, emit)
      
      expect(result).toHaveProperty('retry')
      expect(result).toHaveProperty('handlePageChange')
      
      expect(typeof result.retry).toBe('function')
      expect(typeof result.handlePageChange).toBe('function')
    })
  })

  describe('function behavior', () => {
    it('calls emit function correctly for retry', () => {
      const { retry } = useAnimeGrid(props, emit)
      
      retry()
      
      expect(emit).toHaveBeenCalledTimes(1)
      expect(emit).toHaveBeenCalledWith('retry')
    })

    it('calls emit function correctly for pageChange', () => {
      const { handlePageChange } = useAnimeGrid(props, emit)
      
      handlePageChange(5)
      
      expect(emit).toHaveBeenCalledTimes(1)
      expect(emit).toHaveBeenCalledWith('pageChange', 5)
    })

    it('can call both functions multiple times', () => {
      const { retry, handlePageChange } = useAnimeGrid(props, emit)
      
      retry()
      handlePageChange(2)
      retry()
      handlePageChange(3)
      
      expect(emit).toHaveBeenCalledTimes(4)
      expect(emit).toHaveBeenNthCalledWith(1, 'retry')
      expect(emit).toHaveBeenNthCalledWith(2, 'pageChange', 2)
      expect(emit).toHaveBeenNthCalledWith(3, 'retry')
      expect(emit).toHaveBeenNthCalledWith(4, 'pageChange', 3)
    })
  })
}) 