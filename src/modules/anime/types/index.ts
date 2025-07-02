import type { BaseEntity, PaginatedResponse } from '@shared/common/types'

// Re-exportar tipos específicos de páginas
export type { AnimeFavoritesProps, AnimeFavoritesEmits } from './AnimeFavorites.types'

// Tipos específicos del módulo de anime
export interface Anime extends BaseEntity {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
    webp?: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  type: string
  source: string
  episodes: number | null
  status: string
  airing: boolean
  duration: string
  rating: string
  score: number
  scored_by: number
  rank: number
  popularity: number
  members: number
  favorites: number
  synopsis: string
  season: string
  year: number
  broadcast: {
    day: string
    time: string
    timezone: string
    string: string
  }
  producers: Producer[]
  licensors: Producer[]
  studios: Producer[]
  genres: Genre[]
  explicit_genres: Genre[]
  themes: Genre[]
  demographics: Genre[]
  trailer?: {
    youtube_id?: string
    url?: string
    embed_url?: string
  }
}

export interface Producer {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Genre {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface AnimeSearchParams {
  q?: string
  page?: number
  limit?: number
  type?: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music'
  score?: number
  min_score?: number
  max_score?: number
  status?: 'airing' | 'complete' | 'upcoming'
  rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx'
  sfw?: boolean
  genres?: string
  genres_exclude?: string
  order_by?: 'mal_id' | 'title' | 'type' | 'rating' | 'start_date' | 'end_date' | 'episodes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites'
  sort?: 'desc' | 'asc'
  letter?: string
  producers?: string
  start_date?: string
  end_date?: string
}

export interface AnimeListResponse extends PaginatedResponse<Anime> {}

export interface AnimeDetailResponse {
  data: Anime
}

export interface AnimeRecommendationsResponse extends PaginatedResponse<AnimeRecommendation> {}

export interface AnimeRecommendation {
  mal_id: string
  entry: Anime[]
  content: string
  user: {
    url: string
    username: string
  }
}

export interface AnimeStats {
  watching: number
  completed: number
  on_hold: number
  dropped: number
  plan_to_watch: number
  total: number
  scores: {
    [key: string]: {
      votes: number
      percentage: number
    }
  }
} 

export * from './AnimeCharacter.types' 