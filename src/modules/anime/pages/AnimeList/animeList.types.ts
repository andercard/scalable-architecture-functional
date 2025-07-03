import type { Anime } from '../../types'

export interface AnimeListFilters {
  searchQuery: string
  activeFilter: 'top' | 'seasonal' | 'all'
}

export interface AnimeListState {
  isLoading: boolean
  error: string | null
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalAnimes: number
} 