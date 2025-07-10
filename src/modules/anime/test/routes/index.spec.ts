import { describe, it, expect } from 'vitest'
import { animeRoutes, animePublicRoutes, animePrivateRoutes } from '../../routes'

describe('Anime Routes', () => {
  describe('animeRoutes', () => {
    it('should combine public and private routes', () => {
      // Assert
      expect(animeRoutes).toHaveLength(3) // 2 public + 1 private
      expect(animeRoutes).toEqual(expect.arrayContaining(animePublicRoutes))
      expect(animeRoutes).toEqual(expect.arrayContaining(animePrivateRoutes))
    })

    it('should have correct structure for all routes', () => {
      // Assert
      animeRoutes.forEach(route => {
        expect(route).toHaveProperty('path')
        expect(route).toHaveProperty('name')
        expect(route).toHaveProperty('component')
        expect(route).toHaveProperty('meta')
      })
    })
  })

  describe('animePublicRoutes', () => {
    it('should have 2 public routes', () => {
      // Assert
      expect(animePublicRoutes).toHaveLength(2)
    })

    it('should have AnimeList route with correct configuration', () => {
      // Arrange
      const animeListRoute = animePublicRoutes.find(route => route.name === 'AnimeList')
      
      // Assert
      expect(animeListRoute).toBeDefined()
      expect(animeListRoute?.path).toBe('/')
      expect(animeListRoute?.meta?.title).toBe('Explorar Animes')
      expect(animeListRoute?.meta?.description).toBe('Descubre y explora animes populares')
    })

    it('should have AnimeDetail route with correct configuration', () => {
      // Arrange
      const animeDetailRoute = animePublicRoutes.find(route => route.name === 'AnimeDetail')
      
      // Assert
      expect(animeDetailRoute).toBeDefined()
      expect(animeDetailRoute?.path).toBe('/anime/:id')
      expect(animeDetailRoute?.props).toBe(true)
      expect(animeDetailRoute?.meta?.title).toBe('Detalle de Anime')
      expect(animeDetailRoute?.meta?.description).toBe('Información detallada del anime')
      expect(animeDetailRoute?.meta?.guards).toContain('animeLimitGuard')
    })

    it('should have lazy-loaded components', () => {
      // Assert
      animePublicRoutes.forEach(route => {
        expect(typeof route.component).toBe('function')
      })
    })
  })

  describe('animePrivateRoutes', () => {
    it('should have 1 private route', () => {
      // Assert
      expect(animePrivateRoutes).toHaveLength(1)
    })

    it('should have AnimeFavorites route with correct configuration', () => {
      // Arrange
      const animeFavoritesRoute = animePrivateRoutes.find(route => route.name === 'AnimeFavorites')
      
      // Assert
      expect(animeFavoritesRoute).toBeDefined()
      expect(animeFavoritesRoute?.path).toBe('/anime/favorites')
      expect(animeFavoritesRoute?.meta?.requiresAuth).toBe(true)
      expect(animeFavoritesRoute?.meta?.title).toBe('Mis Favoritos')
      expect(animeFavoritesRoute?.meta?.description).toBe('Gestiona tus animes favoritos')
      expect(animeFavoritesRoute?.meta?.guards).toContain('animeFavoritesGuard')
    })

    it('should have lazy-loaded components', () => {
      // Assert
      animePrivateRoutes.forEach(route => {
        expect(typeof route.component).toBe('function')
      })
    })
  })

  describe('Route Meta Properties', () => {
    it('should have consistent meta structure across all routes', () => {
      // Assert
      animeRoutes.forEach(route => {
        expect(route.meta).toHaveProperty('title')
        expect(route.meta).toHaveProperty('description')
        expect(typeof route.meta?.title).toBe('string')
        expect(typeof route.meta?.description).toBe('string')
      })
    })

    it('should have appropriate guards for protected routes', () => {
      // Arrange
      const privateRoutes = animeRoutes.filter(route => route.meta?.requiresAuth)
      
      // Assert
      privateRoutes.forEach(route => {
        expect(route.meta?.guards).toBeDefined()
        expect(Array.isArray(route.meta?.guards)).toBe(true)
      })
    })
  })
}) 