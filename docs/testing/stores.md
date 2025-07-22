[⬅️ Volver al índice](./README.md)

## Testing de Stores Pinia

El proyecto utiliza dos enfoques principales para testing con Pinia, según el tipo de test y el nivel de control necesario. Basándonos en las mejores prácticas de [Fotis Adamakis sobre Unit Testing a Pinia Component](https://fadamakis.com/unit-testing-a-pinia-component-37d045582aed?gi=644ecb388b0a), hemos optimizado nuestros patrones de testing.

#### 1. Enfoque con createTestingPinia

Cuándo usar createTestingPinia:
- Tests unitarios de stores Pinia.
- Tests de componentes individuales que dependen de stores (por ejemplo, AnimeCard, AnimeGrid).
- Cuando necesitas controlar el estado inicial del store y probar acciones/getters en aislamiento.
- Cuando el ciclo de vida del componente no dispara acciones asíncronas que sobrescriban el estado inicial.

Cuándo NO usar createTestingPinia:
- Tests de integración de páginas donde el composable ejecuta lógica asíncrona en el ciclo de vida (onMounted, watch) y puede sobrescribir el estado inicial del store.
- Cuando necesitas forzar un estado específico (éxito, error, loading) en la página sin depender de la lógica real del store o del composable.
- Cuando el test depende de mocks completos de composables para evitar efectos secundarios.

```typescript
import { render, screen } from '@testing-library/vue'
import { createTestPinia } from '@/test/setup'
import AnimeCard from '@/modules/anime/components/AnimeCard'
import { createMockAnime } from '../factories/anime.factory'

describe('AnimeCard con Testing Pinia', () => {
  it('should show favorite button when user is authenticated', () => {
    // Arrange
    const anime = createMockAnime()
    
    // Act
    render(AnimeCard, {
      props: { anime },
      global: {
        plugins: [
          createTestPinia({
            // Estado inicial controlado
            initialState: {
              auth: { isAuthenticated: true },
              anime: { favorites: [] }
            }
          })
        ]
      }
    })
    
    // Assert
    expect(screen.getByTestId('toggle-favorite-button')).toBeInTheDocument()
    expect(screen.queryByTestId('login-required-button')).not.toBeInTheDocument()
  })

  it('should show login button when user is not authenticated', () => {
    // Arrange
    const anime = createMockAnime()
    
    // Act
    render(AnimeCard, {
      props: { anime },
      global: {
        plugins: [
          createTestPinia({
            initialState: {
              auth: { isAuthenticated: false },
              anime: { favorites: [] }
            }
          })
        ]
      }
    })
    
    // Assert
    expect(screen.getByTestId('login-required-button')).toBeInTheDocument()
    expect(screen.queryByTestId('toggle-favorite-button')).not.toBeInTheDocument()
  })
})
```

### Ejemplo de uso

Puedes ver cómo se testean stores Pinia en:

- [`src/modules/anime/test/stores/anime.store.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/stores/anime.store.spec.ts) 