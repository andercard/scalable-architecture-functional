[⬅️ Volver al índice](./README.md)

## Mockeo de Composables en Tests de Integración de Páginas

Cuando una página utiliza un composable que ejecuta un efecto asíncrono en el ciclo de vida (por ejemplo, onMounted dispara acciones del store), es recomendable mockear el composable en los tests de integración de página. Esto evita que el ciclo de vida sobrescriba el estado inicial del store y permite forzar estados de éxito, error o loading de forma controlada.

¿Cuando mockear un composable?
- Cuando el composable ejecuta acciones asíncronas en onMounted o watch y no quieres depender de la lógica real del store/API en el test de integración.
- Cuando necesitas forzar un estado específico (éxito, error, loading) para probar el renderizado de la página.

¿Cómo mockear un composable?
1. Declara los mocks de datos (por ejemplo, un mockAnime completo).
2. Usa `vi.mock` para mockear el composable después de declarar los mocks:

```typescript
vi.mock('@/modules/anime/pages/AnimeList/useAnimeList', () => ({
  useAnimeList: () => ({
    searchQuery: ref(''),
    activeFilter: ref('top'),
    animes: computed(() => [mockAnime]),
    isLoading: computed(() => false),
    error: computed(() => null),
    currentPage: computed(() => 1),
    totalItems: computed(() => 1),
    handleSearch: vi.fn(),
    clearSearch: vi.fn(),
    loadTopAnime: vi.fn(),
    loadSeasonalAnime: vi.fn(),
    loadAllAnime: vi.fn(),
    retry: vi.fn(),
    handlePageChange: vi.fn()
  })
}))
```

Ventajas:
- Los tests no dependen de la lógica real del ciclo de vida ni de la API.
- Puedes forzar cualquier estado y probar el renderizado de la página de forma aislada.
- El test es más rápido y predecible.

### Ejemplo de uso

- Ver los archivos de este proyecto [`src/modules/anime/test/pages/AnimeList/index.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/pages/AnimeList/index.spec.ts) y [`src/modules/anime/test/pages/AnimeDetail/index.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/pages/AnimeDetail/index.spec.ts) para ejemplos prácticos en el contexto de [`scalable-architecture-functional`](https://github.com/andercard/scalable-architecture-functional). 