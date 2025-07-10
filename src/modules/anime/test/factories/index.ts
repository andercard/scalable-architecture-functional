/**
 * Factories de testing para el módulo anime
 * 
 * Este archivo centraliza todas las factories disponibles para testing,
 * facilitando las importaciones y manteniendo consistencia en el proyecto.
 */

// Factories de datos de anime
export {
  createMockAnime,
  createMockAnimeList,
  createMockAnimeCharacter,
  createMockAnimeCharacterList
} from './anime.factory'

// Factories de stores
export {
  createMockAnimeStore,
  createMockStoreWithAnime,
  createMockStoreWithFavorites,
  createMockStoreWithError,
  createMockStoreWithLoading,
  createMockStoreWithAnimeList,
  type StoreOverrides
} from './store.factory'

// Re-exportar tipos útiles para testing
export type { Anime, AnimeCharacter } from '../../types' 