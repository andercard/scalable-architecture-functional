[⬅️ Volver al índice](./README.md)

## Testing de localStorage

**Enfoque recomendado: localStorage real de jsdom**

Basándonos en las mejores prácticas de [RunThatLine](https://runthatline.com/vitest-mock-localstorage/) y [Medium](https://medium.com/@criszamcham/test-cases-with-jest-local-storage-and-dom-mock-f9144ae9c63c), **jsdom proporciona localStorage real** y es mejor usarlo que mockearlo.

**¿Cuándo usar jsdom?**
- **Componentes con Testing Library**: Siempre requerido para `render()`
- **Composables que usan DOM**: Cuando acceden a `localStorage`, `sessionStorage`, `window`, `document`, etc.
- **Composables puros**: No necesario para lógica que no usa APIs del navegador

**Configuración en vitest.config.ts:**
```typescript
export default defineConfig({
  test: {
    environment: 'jsdom' // Requerido para Testing Library y localStorage
  }
})
```
**¿Por qué usar localStorage real?**
- **Más realista**: Simula el comportamiento real del navegador
- **Menos mantenimiento**: No necesitas mantener mocks complejos
- **Mejor testing**: Pruebas el código real, no mocks
- **Aislamiento simple**: Solo necesitas `localStorage.clear()` en `beforeEach`

**Patrón recomendado para composables:**
```typescript
describe('useFavorites composable', () => {
  beforeEach(() => {
    localStorage.clear() // Limpiar antes de cada test
  })

  it('should store and retrieve favorites', () => {
    // Arrange
    const favorites = [{ id: 1, title: 'Anime 1' }]
    
    // Act
    localStorage.setItem('favorites', JSON.stringify(favorites))
    const retrieved = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    // Assert
    expect(retrieved).toHaveLength(1)
    expect(retrieved[0].id).toBe(1)
  })

  it('should handle empty localStorage gracefully', () => {
    // Act
    const result = localStorage.getItem('nonexistent')
    
    // Assert
    expect(result).toBeNull()
  })
})
```

**Spying en localStorage (para verificar llamadas):**
```typescript
describe('useFavorites with spying', () => {
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

  beforeEach(() => {
    localStorage.clear()
    getItemSpy.mockClear()
    setItemSpy.mockClear()
  })

  it('should call localStorage methods with correct parameters', () => {
    // Act
    localStorage.setItem('anime-favorites', JSON.stringify([]))
    localStorage.getItem('anime-favorites')
    
    // Assert
    expect(setItemSpy).toHaveBeenCalledWith('anime-favorites', '[]')
    expect(getItemSpy).toHaveBeenCalledWith('anime-favorites')
  })
})
```

**¿Cuándo sí mockear localStorage?**
Solo en casos específicos:
- Simular errores de cuota excedida
- Testing de comportamiento cuando localStorage falla
- Control total sobre respuestas en casos edge 

### Ejemplo de uso

Puedes ver ejemplos de testing de localStorage en:

- [`src/modules/anime/test/integration/localStorage.integration.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/integration/localStorage.integration.spec.ts) 