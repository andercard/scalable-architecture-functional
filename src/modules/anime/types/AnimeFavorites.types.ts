export interface AnimeFavoritesProps {
  // Props específicas para la página de favoritos
}

export interface AnimeFavoritesEmits {
  retry: []
  'favorite-removed': [animeId: number]
  'favorite-added': [animeId: number]
} 