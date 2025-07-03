import { ApiInstance as http } from '@core/api'
import { executeRequest } from '@core/either'
import type { 
  AnimeDetailResponse, 
  AnimeSearchParams,
  AnimeStats,
  AnimeCharactersResponse,
  Anime,
  AnimeRecommendation
} from '../types'
import type { ApiResult } from '@core/either'
import type { PaginatedResponse } from '@shared/common/types'

/**
 * Cliente de API para el módulo de anime
 * Implementa el patrón Either para manejo de errores
 */
export const animeApi = {
  /**
   * Obtiene lista de animes con filtros opcionales
   * @param params - Parámetros de búsqueda y paginación
   * @returns Promise con Either que contiene la lista de animes o un error
   */
  getAnimeList(params: AnimeSearchParams = {}): Promise<ApiResult<PaginatedResponse<Anime>>> {
    return executeRequest(() => 
      http.get<PaginatedResponse<Anime>>('/anime', { params })
    )
  },

  /**
   * Obtiene detalles de un anime específico
   * @param id - ID del anime
   * @returns Promise con Either que contiene los detalles del anime o un error
   */
  getAnimeById(id: number): Promise<ApiResult<AnimeDetailResponse>> {
    return executeRequest(() => 
      http.get<AnimeDetailResponse>(`/anime/${id}`)
    )
  },

  /**
   * Obtiene animes populares
   * @param page - Número de página
   * @param limit - Límite de resultados por página
   * @returns Promise con Either que contiene la lista de animes populares o un error
   */
  getTopAnime(page: number = 1, limit: number = 20): Promise<ApiResult<PaginatedResponse<Anime>>> {
    return executeRequest(() => 
      http.get<PaginatedResponse<Anime>>('/top/anime', {
        params: { page, limit }
      })
    )
  },

  /**
   * Obtiene animes del season actual
   * @param page - Número de página
   * @param limit - Límite de resultados por página
   * @returns Promise con Either que contiene la lista de animes de la temporada o un error
   */
  getSeasonalAnime(page: number = 1, limit: number = 20): Promise<ApiResult<PaginatedResponse<Anime>>> {
    return executeRequest(() => 
      http.get<PaginatedResponse<Anime>>('/seasons/now', {
        params: { page, limit }
      })
    )
  },

  /**
   * Obtiene recomendaciones para un anime específico
   * @param id - ID del anime
   * @returns Promise con Either que contiene las recomendaciones o un error
   */
  getAnimeRecommendations(id: number): Promise<ApiResult<PaginatedResponse<AnimeRecommendation>>> {
    return executeRequest(() => 
      http.get<PaginatedResponse<AnimeRecommendation>>(`/anime/${id}/recommendations`)
    )
  },

  /**
   * Obtiene estadísticas de un anime
   * @param id - ID del anime
   * @returns Promise con Either que contiene las estadísticas o un error
   */
  getAnimeStats(id: number): Promise<ApiResult<AnimeStats>> {
    return executeRequest(async () => {
      const response = await http.get<AnimeStats>(`/anime/${id}/statistics`)
      return response
    })
  },

  /**
   * Busca animes por título
   * @param query - Término de búsqueda
   * @param page - Número de página
   * @param limit - Límite de resultados por página
   * @returns Promise con Either que contiene los resultados de búsqueda o un error
   */
  searchAnime(query: string, page: number = 1, limit: number = 20): Promise<ApiResult<PaginatedResponse<Anime>>> {
    return executeRequest(() => 
      http.get<PaginatedResponse<Anime>>('/anime', {
        params: { q: query, page, limit }
      })
    )
  },

  /**
   * Obtiene animes por género
   * @param genreId - ID del género
   * @param page - Número de página
   * @param limit - Límite de resultados por página
   * @returns Promise con Either que contiene la lista de animes del género o un error
   */
  getAnimeByGenre(genreId: number, page: number = 1, limit: number = 20): Promise<ApiResult<PaginatedResponse<Anime>>> {
    return executeRequest(() => 
      http.get<PaginatedResponse<Anime>>('/anime', {
        params: { genres: genreId, page, limit }
      })
    )
  },

  /**
   * Obtiene los personajes de un anime específico
   * @param id - ID del anime
   * @returns Promise con Either que contiene la lista de personajes o un error
   */
  getAnimeCharacters(id: number): Promise<ApiResult<AnimeCharactersResponse>> {
    return executeRequest(async () => {
      const response = await http.get<AnimeCharactersResponse>(`/anime/${id}/characters`)
      return response
    })
  }
} 