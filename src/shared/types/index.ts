// Tipos globales compartidos en toda la aplicación

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

export interface BaseEntity {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  url: string
} 

 