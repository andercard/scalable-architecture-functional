import type { Anime, AnimeCharacter } from '../../types'

/**
 * Factory para crear datos de test consistentes para el módulo anime
 * Permite crear objetos anime con datos por defecto y opciones de personalización
 * 
 * Ejemplos de uso:
 * - createMockAnime() // Anime básico con valores por defecto
 * - createMockAnime({ score: 9.5, rank: 1 }) // Anime con alta calificación
 * - createMockAnime({ status: 'Airing', airing: true }) // Anime en emisión
 * - createMockAnime({ status: 'Complete', episodes: 24 }) // Anime completado
 * - createMockAnime({ status: 'Not yet aired', year: 2025 }) // Anime próximo
 * - createMockAnime({ score: 3.0, rank: 1000, favorites: 100 }) // Anime con baja calificación
 * - createMockAnime({ type: 'Movie', duration: '120 min' }) // Película
 * - createMockAnime({ genres: [{ mal_id: 1, name: 'Horror', type: 'anime', url: '...' }] }) // Género específico
 * 
 * Casos de uso comunes:
 * - Test de favoritos: createMockAnime({ id: 1, title: 'Favorite Anime' })
 * - Test de búsqueda: createMockAnime({ title: 'Search Result Anime' })
 * - Test de paginación: createMockAnimeList(10) // Lista de 10 animes
 * - Test de errores: createMockAnime({ id: 999, title: 'Error Test Anime' })
 */
export const createMockAnime = (overrides: Partial<Anime> = {}): Anime => ({
  id: 1,
  mal_id: 1,
  title: 'Test Anime',
  type: 'TV',
  status: 'Airing',
  year: 2024,
  episodes: 12,
  score: 8.5,
  source: 'Manga',
  airing: true,
  duration: '24 min',
  rating: 'PG-13',
  scored_by: 1000,
  rank: 1,
  popularity: 1,
  members: 50000,
  favorites: 1000,
  synopsis: 'Test synopsis for a mock anime series',
  season: 'Winter',
  images: {
    jpg: {
      image_url: 'https://example.com/test.jpg',
      small_image_url: 'https://example.com/test_small.jpg',
      large_image_url: 'https://example.com/test_large.jpg'
    },
    webp: {
      image_url: 'https://example.com/test.webp',
      small_image_url: 'https://example.com/test_small.webp',
      large_image_url: 'https://example.com/test_large.webp'
    }
  },
  broadcast: {
    day: 'Monday',
    time: '00:00',
    timezone: 'Asia/Tokyo',
    string: 'Mondays at 00:00 (JST)'
  },
  genres: [
    { mal_id: 1, name: 'Action', type: 'anime', url: 'https://myanimelist.net/anime/genre/1/Action' },
    { mal_id: 2, name: 'Adventure', type: 'anime', url: 'https://myanimelist.net/anime/genre/2/Adventure' }
  ],
  producers: [
    { mal_id: 1, name: 'Test Studio', type: 'anime', url: 'https://myanimelist.net/anime/producer/1/Test_Studio' }
  ],
  licensors: [],
  studios: [
    { mal_id: 1, name: 'Test Animation', type: 'anime', url: 'https://myanimelist.net/anime/producer/1/Test_Animation' }
  ],
  explicit_genres: [],
  themes: [],
  demographics: [],
  ...overrides
})

export const createMockAnimeList = (count: number = 5, overrides: Partial<Anime> = {}): Anime[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockAnime({
      id: index + 1,
      mal_id: index + 1,
      title: `Test Anime ${index + 1}`,
      ...overrides
    })
  )
}

export const createMockAnimeCharacter = (overrides: Partial<AnimeCharacter> = {}): AnimeCharacter => ({
  character: {
    mal_id: 1,
    url: 'https://myanimelist.net/character/1/Test_Character',
    images: {
      jpg: {
        image_url: 'https://example.com/character.jpg'
      },
      webp: {
        image_url: 'https://example.com/character.webp'
      }
    },
    name: 'Test Character'
  },
  role: 'Main',
  voice_actors: [
    {
      person: {
        mal_id: 1,
        url: 'https://myanimelist.net/people/1/Test_VA',
        images: {
          jpg: {
            image_url: 'https://example.com/va.jpg'
          }
        },
        name: 'Test Voice Actor'
      },
      language: 'Japanese'
    }
  ],
  ...overrides
})

export const createMockAnimeCharacterList = (count: number = 3): AnimeCharacter[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockAnimeCharacter({
      character: {
        mal_id: index + 1,
        url: `https://myanimelist.net/character/${index + 1}/Test_Character_${index + 1}`,
        images: {
          jpg: {
            image_url: `https://example.com/character_${index + 1}.jpg`
          },
          webp: {
            image_url: `https://example.com/character_${index + 1}.webp`
          }
        },
        name: `Test Character ${index + 1}`
      },
      role: index === 0 ? 'Main' : 'Supporting'
    })
  )
} 