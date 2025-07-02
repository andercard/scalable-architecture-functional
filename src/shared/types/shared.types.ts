export interface Genre {
  mal_id: number
  name: string
}

export interface BaseCardProps {
  title: string
  imageUrl?: string
  subtitle?: string
  genres?: Genre[]
  loading?: boolean
  clickable?: boolean
  maxTitleLength?: number
  maxGenres?: number
}

export interface BaseCardEmits {
  click: [event: MouseEvent]
} 