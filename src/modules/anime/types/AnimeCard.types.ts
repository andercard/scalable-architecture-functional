import type { Anime } from './index'

export interface AnimeCardProps {
  anime: Anime
  loading?: boolean
  showFavoriteButton?: boolean
  showStats?: boolean
  clickable?: boolean
}

// Usar sobrecarga de función para compatibilidad con defineEmits y composables
type AnimeCardEmits = {
  (event: 'click', eventObj: MouseEvent): void
  (event: 'favorite', animeId: number, isFavorite: boolean): void
}

export type { AnimeCardEmits } 