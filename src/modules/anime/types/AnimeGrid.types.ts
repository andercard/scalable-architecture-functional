import type { Anime } from './index'

export interface AnimeGridProps {
  animes: Anime[]
  loading?: boolean
  error?: string | null
  currentPage?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  showPagination?: boolean
  totalItems?: number
}

// Usar sobrecarga de función para compatibilidad con defineEmits y composables
type AnimeGridEmits = {
  (event: 'retry'): void
  (event: 'pageChange', page: number): void
}

export type { AnimeGridEmits } 