/**
 * Errores específicos del módulo de anime
 * Mapeo de reasons a mensajes de usuario
 */

export type ErrorAnime =
  | 'ANIME_NOT_FOUND'
  | 'ANIME_SEARCH_FAILED'
  | 'ANIME_DETAILS_FAILED'
  | 'AUTHENTICATION_FAILED_ATTEMPT_ONE'
  | 'AUTHENTICATION_FAILED_ATTEMPT_TWO'
  | 'RATE_LIMIT_EXCEEDED'
  | 'DEFAULT'

export const ErrorAnime: Record<ErrorAnime, string> = {
  ANIME_NOT_FOUND: 'El anime no fue encontrado',
  ANIME_SEARCH_FAILED: 'Error al buscar animes',
  ANIME_DETAILS_FAILED: 'Error al cargar los detalles del anime',
  AUTHENTICATION_FAILED_ATTEMPT_ONE: 'Error de autenticación. Intenta de nuevo',
  AUTHENTICATION_FAILED_ATTEMPT_TWO: 'Error de autenticación. Verifica tus credenciales',
  RATE_LIMIT_EXCEEDED: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos',
  DEFAULT: 'Error en el módulo de anime'
} 