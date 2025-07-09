// Exportar stores
export { useAnimeStore } from './stores/anime.store'

// Exportar tipos principales
export type { 
  Anime, 
  AnimeDetailResponse, 
  AnimeSearchParams,
  AnimeStats,
  AnimeCharactersResponse,
  AnimeRecommendation
} from './types'

// Exportar rutas
export { animeRoutes, animePublicRoutes } from './routes'

// Exportar servicios (solo si es necesario para otros módulos)
export { animeApi } from './services/anime.services' 