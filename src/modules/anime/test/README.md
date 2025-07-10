# Testing del Módulo Anime

Este directorio contiene todos los tests del módulo anime, siguiendo los lineamientos de testing del proyecto.

## Estructura de Tests

```
test/
├── components/           # Tests de componentes Vue
│   ├── AnimeCard/       # Tests del componente AnimeCard
│   │   ├── index.spec.ts        # Tests de componente (template)
│   │   └── useAnimeCard.spec.ts # Tests unitarios (composable)
│   └── AnimeGrid/       # Tests del componente AnimeGrid
│       ├── index.spec.ts        # Tests de componente (template)
│       └── useAnimeGrid.spec.ts # Tests unitarios (composable)
├── pages/               # Tests de páginas
│   ├── AnimeList/       # Tests de la página AnimeList
│   │   ├── index.spec.ts        # Tests de componente (template)
│   │   └── useAnimeList.spec.ts # Tests unitarios (composable)
│   ├── AnimeDetail/     # Tests de la página AnimeDetail
│   │   ├── index.spec.ts        # Tests de componente (template)
│   │   └── useAnimeDetail.spec.ts # Tests unitarios (composable)
│   └── AnimeFavorites/  # Tests de la página AnimeFavorites
│       ├── index.spec.ts        # Tests de componente (template)
│       └── useAnimeFavorites.spec.ts # Tests unitarios (composable)
├── stores/              # Tests de stores Pinia
│   └── anime.store.spec.ts      # Tests del store de anime
├── services/            # Tests de servicios
│   └── anime.services.spec.ts   # Tests de servicios de API
├── routes/              # Tests de rutas y guards
│   ├── index.spec.ts            # Tests de configuración de rutas
│   └── anime.guards.spec.ts     # Tests de guards de navegación
├── integration/         # Tests de integración
│   └── localStorage.integration.spec.ts # Tests de localStorage
├── factories/           # Factories para datos de prueba
│   ├── index.ts                 # Exportaciones centralizadas
│   ├── anime.factory.ts         # Factories de datos de anime
│   └── store.factory.ts         # Factories de stores
├── utils/               # Utilidades de testing
│   └── test-utils.ts            # Utilidades específicas del módulo
├── setup.ts             # Configuración específica del módulo
└── README.md            # Este archivo
```

## Tipos de Tests

### 1. Tests Unitarios (Composables)

**Ubicación**: `components/*/use*.spec.ts`, `pages/*/use*.spec.ts`

**Propósito**: Probar lógica pura sin DOM, enfocados en el desarrollador.

**Ejemplos**:
- `useAnimeCard.spec.ts` - Lógica del composable AnimeCard
- `useAnimeList.spec.ts` - Lógica de la página AnimeList
- `useAnimeDetail.spec.ts` - Lógica de la página AnimeDetail

**Características**:
- Sin renderizado de componentes
- Prueban funciones puras y lógica de negocio
- Rápidos (< 1ms por test)
- Aislados y determinísticos

### 2. Tests de Componentes (Templates)

**Ubicación**: `components/*/index.spec.ts`, `pages/*/index.spec.ts`

**Propósito**: Probar interacciones de usuario y comportamiento observable.

**Ejemplos**:
- `AnimeCard/index.spec.ts` - Interacciones del usuario con tarjetas
- `AnimeGrid/index.spec.ts` - Estados de carga, error y contenido
- `AnimeList/index.spec.ts` - Búsqueda, filtros y navegación

**Características**:
- Con renderizado de componentes reales
- Simulan interacciones reales del usuario
- Verifican comportamiento observable
- Centrados en la experiencia del usuario

### 3. Tests de Stores

**Ubicación**: `stores/anime.store.spec.ts`

**Propósito**: Probar gestión de estado y lógica de negocio.

**Características**:
- Testing de estado inicial
- Testing de getters computados
- Testing de acciones síncronas y asíncronas
- Testing de manejo de errores
- Testing de integración con localStorage

### 4. Tests de Servicios

**Ubicación**: `services/anime.services.spec.ts`

**Propósito**: Probar lógica de servicios y manejo de errores.

**Características**:
- Testing de llamadas a API
- Testing de manejo de respuestas Either
- Testing de casos edge y errores
- Testing de transformación de datos

### 5. Tests de Rutas y Guards

**Ubicación**: `routes/`

**Propósito**: Probar configuración de rutas y lógica de navegación.

**Ejemplos**:
- `index.spec.ts` - Configuración y estructura de rutas
- `anime.guards.spec.ts` - Guards de autenticación y validación

### 6. Tests de Integración

**Ubicación**: `integration/`

**Propósito**: Probar integración entre diferentes partes del sistema.

**Ejemplos**:
- `localStorage.integration.spec.ts` - Persistencia de favoritos

## Factories y Utilidades

### Factories de Datos

**Ubicación**: `factories/`

**Propósito**: Crear datos de prueba consistentes y reutilizables.

**Ejemplos**:
```typescript
import { createMockAnime, createMockAnimeList } from '../factories'

// Crear un anime básico
const anime = createMockAnime()

// Crear un anime con propiedades específicas
const customAnime = createMockAnime({ 
  title: 'Custom Anime', 
  score: 9.5 
})

// Crear una lista de animes
const animeList = createMockAnimeList(5)
```

### Utilidades de Testing

**Ubicación**: `utils/test-utils.ts`

**Propósito**: Funciones helper para facilitar el testing.

**Ejemplos**:
```typescript
import { renderWithAnimeConfig, animeTestConfigs } from '../utils/test-utils'

// Renderizar con configuración específica
const { screen } = renderWithAnimeConfig(Component, {
  favorites: mockFavorites,
  isLoading: false
})

// Usar configuraciones predefinidas
const { screen } = renderWithAnimeConfig(Component, animeTestConfigs.loading)
```

## Patrones de Testing

### Patrón AAA (Arrange, Act, Assert)

Todos los tests siguen el patrón AAA:

```typescript
describe('useAnimeCard', () => {
  it('should compute anime subtitle correctly', () => {
    // Arrange - Preparar datos de prueba
    const props = { anime: createMockAnime({ type: 'TV', status: 'Airing' }) }
    const emit = vi.fn()
    
    // Act - Ejecutar la función
    const { result } = renderComposable(() => useAnimeCard(props, emit))
    
    // Assert - Verificar resultado
    expect(result.current.animeSubtitle).toBe('TV • Airing')
  })
})
```

### Testing de Estados

Los tests cubren todos los estados posibles:

- **Loading**: Cuando se están cargando datos
- **Error**: Cuando hay errores de API
- **Empty**: Cuando no hay datos
- **Success**: Cuando los datos se cargan correctamente

### Testing de Interacciones

Los tests de componentes simulan interacciones reales:

```typescript
// Simular click del usuario
await user.click(screen.getByRole('button', { name: 'Agregar a favoritos' }))
    
// Simular entrada de texto
await user.type(screen.getByPlaceholderText('Buscar...'), 'anime')

// Simular navegación
await user.click(screen.getByRole('link', { name: 'Detalle' }))
```

## Cobertura de Testing

### Objetivos de Cobertura

- **Stores**: 80-90% (Lógica de negocio crítica)
- **Composables**: 70-80% (Lógica de UI y transformaciones)
- **Componentes**: 50-70% (Interacciones de usuario)
- **Servicios**: 30-50% (Casos edge y validaciones)

### Métricas de Calidad

- **Tests unitarios**: Rápidos y aislados
- **Tests de componentes**: Centrados en el usuario
- **Tests de integración**: Validan flujos completos
- **Factories**: Datos consistentes y reutilizables

## Comandos de Testing

### Ejecutar todos los tests del módulo
```bash
yarn test src/modules/anime/test/
```

### Ejecutar tests específicos
```bash
# Solo tests de componentes
yarn test src/modules/anime/test/components/

# Solo tests de stores
yarn test src/modules/anime/test/stores/

# Solo tests de páginas
yarn test src/modules/anime/test/pages/

# Solo tests de servicios
yarn test src/modules/anime/test/services/
```

### Ejecutar tests con coverage
```bash
yarn test src/modules/anime/test/ --coverage
```

### Ejecutar tests en modo watch
```bash
yarn test src/modules/anime/test/ --watch
```

## Mejores Prácticas

### 1. Nomenclatura de Tests

- **Descriptiva**: El nombre del test debe describir el comportamiento
- **Específica**: Un test por comportamiento específico
- **Legible**: Fácil de entender qué se está probando

```typescript
// ✅ Bueno
it('should display favorite button when user is authenticated', () => {
  // test implementation
})

// ❌ Malo
it('should work', () => {
  // test implementation
})
```

### 2. Organización de Tests

- **Agrupar por funcionalidad**: Usar `describe` para agrupar tests relacionados
- **Orden lógico**: Arrange, Act, Assert en cada test
- **Cleanup**: Limpiar estado entre tests

### 3. Uso de Factories

- **Reutilizar**: Usar factories en lugar de crear datos inline
- **Personalizar**: Usar overrides para casos específicos
- **Consistencia**: Mantener datos consistentes entre tests

### 4. Testing de Estados

- **Cubrir todos los estados**: Loading, error, empty, success
- **Transiciones**: Probar cambios entre estados
- **Edge cases**: Probar casos límite y errores

### 5. Testing de Interacciones

- **Simular usuario real**: Usar `userEvent` para interacciones
- **Verificar resultados**: Comprobar cambios en la UI
- **Accesibilidad**: Usar selectores accesibles

## Troubleshooting

### Problemas Comunes

1. **Tests lentos**: Usar mocks para operaciones costosas
2. **Tests frágiles**: Evitar dependencias de implementación
3. **Falsos positivos**: Verificar comportamiento real, no implementación
4. **Falsos negativos**: Asegurar que los tests reflejan la funcionalidad

### Debugging

- Usar `console.log` temporalmente para debug
- Usar `--reporter=verbose` para más detalles
- Usar `--ui` para interfaz visual de debugging

## Recursos Adicionales

- [Guía de Testing del Proyecto](../../../TESTING_GUIDELINES.md)
- [Documentación de Vitest](https://vitest.dev/)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
- [Pinia Testing](https://pinia.vuejs.org/cookbook/testing.html) 