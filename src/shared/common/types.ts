// Tipos comunes de la aplicación

export interface BaseEntity {
  id: string | number
}

export interface PaginationMeta {
  current_page: number
  last_visible_page: number
  has_next_page: boolean
  has_previous_page: boolean
  items: {
    count: number
    total: number
    per_page: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
} 