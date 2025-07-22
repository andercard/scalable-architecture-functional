[⬅️ Volver al índice](./README.md)

## Patrones y Mejores Prácticas

### Patrón AAA (Arrange, Act, Assert)

**Estructura recomendada para todos los tests:**
- **Arrange**: Preparar datos, mocks y estado inicial
- **Act**: Ejecutar la acción que se está probando
- **Assert**: Verificar que el resultado es el esperado

```typescript
describe('useAnimeCard', () => {
  it('should compute anime subtitle correctly', () => {
    // Arrange - Preparar datos de prueba
    const props = { anime: createMockAnime({ type: 'TV', status: 'Airing' }) }
    const emit = vi.fn()
    
    // Act - Ejecutar la función
    const { result, app } = withSetup(() => useAnimeCard(props, emit))
    
    // Assert - Verificar resultado
    expect(result.animeSubtitle.value).toBe('TV • Airing')
    app.unmount()
  })

  it('should handle favorite toggle interaction', async () => {
    // Arrange
    const props = { anime: createMockAnime({ mal_id: 1 }) }
    const emit = vi.fn()
    const { result, app } = withSetup(() => useAnimeCard(props, emit))
    
    // Act
    await result.toggleFavorite()
    
    // Assert
    expect(result.isFavorite.value).toBe(true)
    expect(emit).toHaveBeenCalledWith('toggle-favorite', props.anime)
    app.unmount()
  })
})
```

### Setup de Mocks

**Tipos de mocks en el proyecto:**
- **Mocks globales**: Definidos en `test/setup.ts` - disponibles en todos los tests
- **Mocks locales**: Definidos en archivos específicos de test - solo para ese test

**¿Cómo funcionan juntos?**
Los mocks locales se **combinan** con los globales, no los reemplazan. Si defines un mock local para algo que ya tiene mock global, el local tiene prioridad.

**Ejemplo práctico:**
```typescript
// test/setup.ts (mock global)
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {} }),
  useRouter: () => ({ push: vi.fn() })
}))

// mi-test.spec.ts (mock local)
// Importar setup específico del módulo para combinar mocks
import '../setup' // Combina mocks globales + locales del módulo

// Mock local que extiende el global
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: () => ({ params: { id: '123' } }) // Sobrescribe solo useRoute
  }
})
```

**Regla importante:**
Siempre importa `import '../setup'` al inicio de tus tests para que los mocks se combinen correctamente. 