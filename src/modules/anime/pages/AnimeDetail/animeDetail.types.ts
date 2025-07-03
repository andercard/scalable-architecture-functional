export interface AnimeDetailState {
  isLoading: boolean
  error: string | null
  isFavorite: boolean
}

export interface AnimeDetailActions {
  toggleFavorite: () => void
  retry: () => void
} 