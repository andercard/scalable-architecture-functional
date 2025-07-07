# Testing Guidelines - Módulo Anime

> **_"Our documentation is our product's UI for developers."_** - Netflix Engineering Team

## 📋 Resumen Ejecutivo

Este documento establece las mejores prácticas para testing en el módulo anime, basadas en el enfoque de **pruebas unitarias con integración ligera** para aplicaciones Vue 3 + TypeScript. Nuestro enfoque se basa en las mejores prácticas de la comunidad Vue y el enfoque de Netflix para documentación que los desarrolladores realmente leen.

## 🎯 Filosofía de Testing

### **Enfoque: "Write tests. Not too many. Mostly integration."**

Basándonos en las mejores prácticas de [Kent C. Dodds](https://kentcdodds.com/blog/write-tests) y la [guía oficial de Vue](https://vuejs.org/guide/scaling-up/testing), nuestro enfoque es:

- ✅ **Pruebas unitarias** para lógica de negocio compleja
- ✅ **Pruebas de integración ligera** para composables y stores
- ✅ **Pruebas de comportamiento observable** para interacciones de usuario
- ❌ **Evitar** pruebas unitarias excesivas de servicios simples
- ❌ **Evitar** pruebas de detalles de implementación
- ❌ **Evitar** pruebas end-to-end complejas

### **Principios Fundamentales**

1. **Test Behavior, Not Implementation** - Probar comportamiento observable, no detalles internos
2. **AAA Pattern** - Arrange, Act, Assert para estructura clara
3. **Factory Pattern** - Datos consistentes y reutilizables
4. **Black Box Testing** - Enfocarse en inputs/outputs, no en cómo se logran

## 🧪 Testing Vue: Guía Práctica

### **¿Por qué Testing en Vue es Diferente?**

Según la [guía oficial de Vue](https://vuejs.org/guide/scaling-up/testing#component-testing), Vue tiene características únicas que requieren un enfoque específico:

- **Reactivity System**: Los tests deben manejar la reactividad de Vue
- **Composition API**: Los composables requieren testing especializado
- **Component Lifecycle**: Los hooks de ciclo de vida necesitan testing específico
- **Template Rendering**: El renderizado de templates requiere herramientas especiales

### **Testing de Composables**

Basándonos en [Testing Vue Composables with Lifecycle](https://dylanbritz.dev/writing/testing-vue-composables-lifecycle/):

#### **✅ Enfoque Correcto**
```typescript
// ✅ Testing composables con lifecycle
describe('useAnimeDetail', () => {
  it('should load anime on mount', async () => {
    // Arrange
    const mockAnime = createMockAnime({ mal_id: 1 })
    vi.mocked(animeApi.getAnimeById).mockResolvedValue(createSuccessMock(mockAnime))
    
    // Act
    const { anime, isLoading } = useAnimeDetail()
    
    // Assert - Initial state
    expect(isLoading.value).toBe(true)
    
    // Wait for async operations
    await flushPromises()
    
    // Assert - Final state
    expect(anime.value).toEqual(mockAnime)
    expect(isLoading.value).toBe(false)
  })
})
```

#### **❌ Enfoque Incorrecto**
```typescript
// ❌ NO hacer esto - Testing implementation details
it('should call loadAnimeById on mount', () => {
  const spy = vi.spyOn(animeStore, 'loadAnimeById')
  useAnimeDetail()
  expect(spy).toHaveBeenCalled()
})
```

### **Testing de Componentes**

Basándonos en [Testing Vue Components with Vitest](https://dev.to/jacobandrewsky/testing-vue-components-with-vitest-5c21):

#### **✅ Testing de Interacciones de Usuario**
```typescript
// ✅ Testing comportamiento observable
describe('AnimeDetail Component', () => {
  it('should toggle favorite when button is clicked', async () => {
    // Arrange
    const wrapper = mount(AnimeDetail, {
      global: {
        plugins: [createTestPinia()]
      }
    })
    
    // Wait for component to load
    await flushPromises()
    
    // Act
    const favoriteBtn = wrapper.find('.favorite-btn')
    await favoriteBtn.trigger('click')
    
    // Assert
    expect(favoriteBtn.classes()).toContain('favorite-btn--active')
  })
})
```

#### **✅ Testing de Props y Events**
```typescript
// ✅ Testing props y eventos
describe('AnimeCard Component', () => {
  it('should emit click event when card is clicked', async () => {
    // Arrange
    const anime = createMockAnime()
    const wrapper = mount(AnimeCard, {
      props: { anime }
    })
    
    // Act
    await wrapper.trigger('click')
    
    // Assert
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual([anime])
  })
})
```

### **Testing de Stores con Pinia**

Basándonos en [Good Practices for Vue Composables](https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk):

#### **✅ Testing de Stores**
```typescript
// ✅ Testing stores con Pinia
describe('Anime Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should manage favorites state', () => {
    // Arrange
    const store = useAnimeStore()
    const anime = createMockAnime({ mal_id: 1 })
    
    // Act
    store.addToFavorites(anime)
    
    // Assert
    expect(store.favorites).toContainEqual(anime)
    expect(store.isFavorite(1)).toBe(true)
    
    // Act - Remove
    store.removeFromFavorites(1)
    
    // Assert
    expect(store.favorites).not.toContainEqual(anime)
    expect(store.isFavorite(1)).toBe(false)
  })
})
```

### **Testing de Servicios**

Basándonos en [How I Started Writing Unit Tests for Vue Components](https://www.byteminds.co.uk/blog/how-i-started-writing-unit-tests-for-vue-components):

#### **✅ Testing de Integración de Servicios**
```typescript
// ✅ Testing manejo de errores en servicios
describe('Anime Services', () => {
  it('should handle API errors gracefully', async () => {
    // Arrange
    vi.mocked(apiInstance.get).mockRejectedValue(new Error('Network error'))
    
    // Act
    const result = await animeApi.getAnimeList({ page: 1 })
    
    // Assert
    expect(result.isLeft()).toBe(true)
    expect(result.value).toContain('Network error')
  })
})
```

## 🏗️ Estructura de Testing

### **Estructura que Replica la Lógica del Código**

```
src/modules/anime/
├── components/                    # Componentes Vue
│   ├── AnimeCard/
│   │   ├── index.vue
│   │   ├── useAnimeCard.ts
│   │   └── animeCard.types.ts
│   └── AnimeGrid/
│       ├── index.vue
│       ├── useAnimeGrid.ts
│       └── animeGrid.types.ts
├── pages/                        # Páginas de la aplicación
│   ├── AnimeDetail/
│   │   ├── index.vue
│   │   ├── useAnimeDetail.ts
│   │   └── animeDetail.types.ts
│   ├── AnimeList/
│   │   ├── index.vue
│   │   ├── useAnimeList.ts
│   │   └── animeList.types.ts
│   └── AnimeFavorites/
│       ├── index.vue
│       └── useAnimeFavorites.ts
├── services/                     # Servicios de API
│   └── anime.services.ts
├── stores/                       # Stores de estado
│   └── anime.store.ts
├── types/                        # Tipos TypeScript
│   └── index.ts
└── test/                         # Tests (replica la estructura)
    ├── components/               # Tests de composables de componentes
    │   ├── AnimeCard/
    │   │   └── useAnimeCard.spec.ts
    │   └── AnimeGrid/
    │       └── useAnimeGrid.spec.ts
    ├── pages/                    # Tests de composables de páginas
    │   ├── AnimeDetail/
    │   │   └── useAnimeDetail.spec.ts
    │   ├── AnimeList/
    │   │   └── useAnimeList.spec.ts
    │   └── AnimeFavorites/
    │       └── useAnimeFavorites.spec.ts
    ├── services/                 # Tests de integración de servicios
    │   └── anime.services.spec.ts
    ├── stores/                   # Tests de stores (lógica de negocio)
    │   └── anime.store.spec.ts
    ├── factories/                # Factories para datos de prueba
    │   └── anime.factory.ts
    ├── utils/                    # Utilidades de testing
    │   └── test-utils.ts
    ├── setup.ts                  # Configuración específica del módulo
    └── README.md                 # Esta documentación
```

### **Configuración de Testing**

#### **Setup Global (test/setup.ts)**
```typescript
import { vi } from 'vitest'
import { createTestPinia } from '@pinia/testing'

// Mocks globales para toda la aplicación
vi.mock('vue-router')
vi.mock('@/core/api/instance')
vi.mock('element-plus')

// Configuración de Pinia para testing
export const createTestStore = () => createTestPinia({
  stubActions: false,
  createSpy: vi.fn
})

// Mocks de DOM y APIs del navegador
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})
```

#### **Setup por Módulo (src/modules/anime/test/setup.ts)**
```typescript
import { vi } from 'vitest'

// Mocks específicos del módulo anime
vi.mock('@/modules/anime/services/anime.services')
vi.mock('@/modules/anime/stores/anime.store')

// Configuración específica para tests del módulo anime
export const setupAnimeTest = () => {
  // Setup específico del módulo
}
```

## 📝 Qué Probar y Qué NO Probar

### ✅ **SÍ Probar (Pruebas Unitarias)**

#### **1. Stores (Lógica de Negocio Crítica)**
```typescript
// ✅ Ejemplo: anime.store.spec.ts
describe('Anime Store', () => {
  it('should add anime to favorites', () => {
    // Arrange
    const store = useAnimeStore()
    const anime = createMockAnime({ mal_id: 1 })
    
    // Act
    store.addToFavorites(anime)
    
    // Assert
    expect(store.favorites).toContainEqual(anime)
    expect(store.isFavorite(1)).toBe(true)
  })
})
```

#### **2. Composables (Lógica de UI)**
```typescript
// ✅ Ejemplo: useAnimeCard.spec.ts
describe('useAnimeCard', () => {
  it('should format anime subtitle correctly', () => {
    // Arrange
    const anime = createMockAnime({ 
      type: 'TV', 
      status: 'Airing', 
      year: 2024 
    })
    
    // Act
    const { animeSubtitle } = useAnimeCard({ anime }, vi.fn())
    
    // Assert
    expect(animeSubtitle.value).toBe('TV • Airing • 2024')
  })
})
```

#### **3. Utils (Transformaciones)**
```typescript
// ✅ Ejemplo: format.spec.ts
describe('formatAnimeScore', () => {
  it('should format score with 2 decimal places', () => {
    // Arrange & Act
    const result = formatAnimeScore(8.567)
    
    // Assert
    expect(result).toBe('8.57')
  })
})
```

### ❌ **NO Probar (Evitar)**

#### **1. Servicios API (Solo Wrappers)**
```typescript
// ❌ NO hacer esto - Son solo wrappers de HTTP
describe('animeApi', () => {
  it('should call getAnimeList with correct params', () => {
    // Demasiados mocks, poco valor real
  })
})
```

#### **2. Lógica Trivial**
```typescript
// ❌ NO hacer esto - Lógica demasiado simple
describe('getter', () => {
  it('should return the value', () => {
    const value = getValue()
    expect(value).toBe('expected')
  })
})
```

#### **3. Detalles de Implementación**
```typescript
// ❌ NO hacer esto - Testing implementation details
it('should call setState with correct params', () => {
  const spy = vi.spyOn(component, 'setState')
  component.updateData()
  expect(spy).toHaveBeenCalledWith({ data: 'value' })
})
```

## 🧪 Patrones de Testing

### **1. Patrón AAA (Arrange, Act, Assert)**

```typescript
describe('Anime Store', () => {
  it('should handle API errors gracefully', () => {
    // Arrange - Preparar el estado inicial
    const store = useAnimeStore()
    const errorMessage = 'API Error'
    
    // Act - Ejecutar la acción
    store.handleApiError(errorMessage)
    
    // Assert - Verificar el resultado
    expect(store.error).toBe(errorMessage)
    expect(store.isLoading).toBe(false)
  })
})
```

### **2. Factory Pattern**

```typescript
// ✅ Usar factories para datos consistentes
const anime = createMockAnime({ 
  score: 9.5, 
  status: 'Airing' 
})

// ✅ Personalizar solo lo necesario
const highRatingAnime = createMockAnime({ score: 9.5 })
const airingAnime = createMockAnime({ status: 'Airing' })
const movieAnime = createMockAnime({ type: 'Movie', duration: '120 min' })
```

### **3. Black Box Testing**

```typescript
// ✅ Probar comportamiento observable
it('should toggle favorite when user clicks button', async () => {
  const wrapper = mount(AnimeDetail)
  await wrapper.find('.favorite-btn').trigger('click')
  expect(wrapper.find('.favorite-btn').classes()).toContain('favorite-btn--active')
})

// ❌ NO probar detalles internos
it('should call toggleFavorite method', () => {
  const spy = vi.spyOn(component, 'toggleFavorite')
  component.toggleFavorite()
  expect(spy).toHaveBeenCalled()
})
```

## 🎯 Métricas de Cobertura por Empresas

### **Estándares de Grandes Empresas**

Basándonos en las métricas de empresas líderes como Google, Microsoft, Netflix, y Meta:

#### **Google (Testing Blog)**
- **Lógica de negocio crítica**: 90-95%
- **Componentes de UI**: 70-80%
- **Servicios de integración**: 60-70%
- **Utils y helpers**: 85-90%

#### **Microsoft (Azure DevOps)**
- **Core business logic**: 85-90%
- **UI components**: 65-75%
- **API services**: 50-60%
- **Utility functions**: 80-85%

#### **Netflix (Engineering Blog)**
- **Critical paths**: 90-95%
- **Feature components**: 70-80%
- **Infrastructure code**: 60-70%
- **Helper functions**: 80-85%

### **Nuestras Métricas Objetivo**

| Tipo de Código | Cobertura Mínima | Cobertura Objetivo | Justificación |
|----------------|------------------|-------------------|---------------|
| **Stores** | 80% | 90% | Lógica de negocio crítica |
| **Composables** | 70% | 80% | Lógica de UI compleja |
| **Utils** | 80% | 90% | Transformaciones y validaciones |
| **Services** | 30% | 50% | Solo manejo de errores |
| **Components** | 50% | 70% | Interacciones de usuario |

### **Lo que NO contar para cobertura**
- Archivos de configuración
- Factories de testing
- Archivos de tipos (.d.ts)
- Setup de tests
- Mocks y stubs
- Archivos de documentación

## 🚀 Comandos de Testing

### **Ejecución de Tests**
```bash
# Ejecutar todos los tests del módulo anime
yarn test src/modules/anime/test/

# Ejecutar tests con coverage
yarn test --coverage

# Ejecutar tests en modo watch
yarn test --watch

# Ejecutar tests específicos
yarn test useAnimeCard.spec.ts

# Ejecutar tests con UI
yarn test --ui

# Ejecutar tests con reporte HTML
yarn test --coverage --reporter=html
```

### **Análisis de Coverage**
```bash
# Ver reporte de coverage en consola
yarn test --coverage --reporter=text

# Generar reporte HTML de coverage
yarn test --coverage --reporter=html

# Ver coverage específico del módulo anime
yarn test src/modules/anime/test/ --coverage
```

## 📚 Recursos y Referencias

### **Artículos Fundamentales**
- [Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests) - Kent C. Dodds
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) - Kent C. Dodds
- [The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy) - Kent C. Dodds
- [Vue Testing Best Practices](https://github.com/tomosterlund/vue-testing-best-practices) - Tom Osterlund

### **Guías de Empresas**
- [Google Testing Blog](https://testing.googleblog.com/) - Mejores prácticas de Google
- [Microsoft Testing Guidelines](https://docs.microsoft.com/en-us/azure/devops/test/overview) - Estándares de Microsoft
- [Netflix Engineering Blog](https://netflixtechblog.com/) - Testing en Netflix

### **Patrones de Testing**
- **AAA Pattern**: Arrange, Act, Assert
- **Factory Pattern**: Para datos de prueba consistentes
- **Mock Pattern**: Para aislar dependencias externas
- **Black Box Testing**: Enfocarse en comportamiento observable

## 🎯 Checklist de Calidad

### **Antes de Crear un Test**
- [ ] ¿El código tiene lógica de negocio compleja?
- [ ] ¿El test valida comportamiento observable?
- [ ] ¿El test es independiente de otros tests?
- [ ] ¿El test es rápido (< 100ms)?
- [ ] ¿El test agrega valor real?

### **Después de Crear un Test**
- [ ] ¿El test sigue el patrón AAA?
- [ ] ¿El test usa factories para datos?
- [ ] ¿El test tiene mocks apropiados?
- [ ] ¿El test es legible y mantenible?
- [ ] ¿El test no se rompe con refactoring?

## 🚨 Anti-Patrones a Evitar

### **1. Testing Implementation Details**
```typescript
// ❌ NO hacer esto
it('should call setState with correct params', () => {
  const setState = vi.fn()
  component.setState = setState
  
  component.updateData()
  
  expect(setState).toHaveBeenCalledWith({ data: 'value' })
})
```

### **2. Mocks Excesivos**
```typescript
// ❌ NO hacer esto - Demasiados mocks
vi.mock('@/api/userService')
vi.mock('@/api/emailService')
vi.mock('@/api/notificationService')
vi.mock('@/api/auditService')
vi.mock('@/api/analyticsService')
```

### **3. Tests Frágiles**
```typescript
// ❌ NO hacer esto - Depende de valores específicos
it('should return correct data', () => {
  const result = service.getData()
  expect(result).toEqual({
    id: 1,
    name: 'Specific Name',
    timestamp: '2024-01-01T00:00:00Z'
  })
})
```

### **4. Coverage Obsesivo**
```typescript
// ❌ NO hacer esto - Testear getters/setters simples
it('should return the value', () => {
  const value = getValue()
  expect(value).toBe('expected')
})
```

## 📈 Métricas de Éxito

### **Indicadores de Calidad**
- **Tiempo de ejecución**: < 10 segundos para todo el módulo
- **Cobertura efectiva**: > 70% en lógica de negocio
- **Tests fallando**: < 5% en builds
- **Mantenibilidad**: Tests que no se rompen con refactoring
- **Velocidad de desarrollo**: Tests que aceleran el desarrollo

### **Señales de Alerta**
- Tests que tardan > 1 segundo cada uno
- Mocks que representan > 50% del código de test
- Tests que se rompen con cambios menores
- Cobertura < 50% en componentes críticos
- Tests que no agregan valor real

## 🔄 Proceso de Desarrollo

### **Workflow de Testing**
1. **Desarrollo**: Escribir código con tests en mente
2. **Testing**: Crear tests para lógica de negocio
3. **Refactoring**: Mejorar código manteniendo tests
4. **Mantenimiento**: Actualizar tests cuando sea necesario

### **Revisión de Tests**
- **Code Review**: Incluir revisión de tests
- **Pair Programming**: Escribir tests en conjunto
- **Retrospectivas**: Evaluar efectividad de tests

## 🤝 Contribución

### **Cómo Contribuir**
1. Lee esta guía completa
2. Sigue los patrones establecidos
3. Usa las herramientas configuradas
4. Documenta casos especiales
5. Revisa tests de otros desarrolladores

### **Reportar Problemas**
- Crear issue en el repositorio
- Incluir contexto del problema
- Proponer solución si es posible
- Seguir el proceso de revisión

---

## 📋 Información del Documento

**Última actualización**: Enero 2025  
**Responsable**: Equipo de Desarrollo Frontend - Book Explorer  
**Revisión**: Cada sprint (2 semanas)  
**Próxima revisión**: 15 de Febrero 2025  
**Versión**: 2.0.0  
**Estado**: Activo  

### **Historial de Cambios**
- **v2.0.0** (Enero 2025): Reescritura completa con mejores prácticas de empresas
- **v1.0.0** (Diciembre 2024): Versión inicial

### **Contacto**
- **Lead Developer**: [Nombre del Lead]
- **QA Lead**: [Nombre del QA Lead]
- **Tech Lead**: [Nombre del Tech Lead]

### **Aprobaciones**
- [ ] **Lead Developer**: [Fecha]
- [ ] **QA Lead**: [Fecha]
- [ ] **Tech Lead**: [Fecha] 

# Testing de Composables en el Módulo Anime

## Patrón `withSetup` para Testing de Composables

### **¿Qué es `withSetup`?**

`withSetup` es un patrón de testing desarrollado por Alex Op [[1]](https://alexop.dev/posts/how-to-test-vue-composables/) que permite testear composables que dependen de **lifecycle hooks** y **contexto de componente Vue**.

### **¿Cuándo usar `withSetup`?**

Según el artículo, existen dos tipos de composables:

#### **1. Independent Composables** 🔓
- ✅ Se pueden testear directamente
- 🛠️ Usan solo Reactivity APIs (ref, computed, watch)
- **Ejemplos en nuestro proyecto**: `useAnimeCard`, `useAnimeFavorites`

```typescript
// ✅ Testing directo - No necesita withSetup
describe('useAnimeCard', () => {
  it('should compute anime subtitle', () => {
    const props = { anime: createMockAnime() }
    const emit = vi.fn()
    const result = useAnimeCard(props, emit)
    
    expect(result.animeSubtitle.value).toBe('TV • Airing • 2024')
  })
})
```

#### **2. Dependent Composables** 🔗
- 🧪 Necesitan contexto de componente para testear
- 🔄 Usan Lifecycle hooks (onMounted, onUnmounted, watch) o Provide/Inject
- **Ejemplos en nuestro proyecto**: `useAnimeDetail`, `useAnimeList`

```typescript
// ✅ Usar withSetup para lifecycle hooks
describe('useAnimeDetail', () => {
  it('should load data on mount', () => {
    const [result, app] = withSetup(() => useAnimeDetail())
    
    // onMounted se ejecuta automáticamente
    expect(store.loadAnimeById).toHaveBeenCalled()
    
    app.unmount() // Cleanup importante
  })
})
```

### **Implementación en Nuestro Proyecto**

#### **Utilidad `withSetup` (Global)**

```typescript
// test/utils/withSetup.ts (GLOBAL - Reutilizable en todo el proyecto)
export function withSetup<T>(composable: () => T): [T, App] {
  let result!: T
  
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })
  
  app.mount(document.createElement('div'))
  return [result, app]
}
```

#### **Helpers Adicionales**

```typescript
// Mock de route params
export function createMockRoute(params: Record<string, string> = {}) {
  return {
    params,
    query: {},
    path: '/test',
    // ... otros props de route
  }
}

// Mock de router
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    // ... otros métodos
  }
}
```

### **Ejemplos de Uso**

#### **Testing de `useAnimeDetail` con `withSetup`**

```typescript
// En useAnimeDetail.spec.ts - Integrado en el archivo existente
describe('lifecycle hooks with withSetup', () => {
  it('should load anime and characters on mount', async () => {
    // Arrange
    vi.mock('vue-router', () => ({
      useRoute: () => createMockRoute({ id: '1' })
    }))
    
    // Act - withSetup ejecuta onMounted automáticamente
    const [result, app] = withSetup(() => useAnimeDetail())
    
    // Assert - Verificar que se llamaron los métodos en onMounted
    expect(store.loadAnimeById).toHaveBeenCalledWith(1)
    expect(animeApi.getAnimeCharacters).toHaveBeenCalledWith(1)
    
    // Cleanup importante
    app.unmount()
  })
})
```

#### **Testing de `useAnimeList`**

```typescript
describe('useAnimeList with withSetup', () => {
  it('should load top anime on mount', () => {
    // Arrange
    const [result, app] = withSetup(() => useAnimeList())
    
    // Assert - onMounted ejecuta loadTopAnime
    expect(store.loadTopAnime).toHaveBeenCalled()
    
    app.unmount()
  })
  
  it('should watch search query changes', async () => {
    // Arrange
    const [result, app] = withSetup(() => useAnimeList())
    
    // Act - Cambiar searchQuery activa el watcher
    result.searchQuery.value = 'naruto'
    await nextTick()
    
    // Assert - El watcher debería reaccionar
    expect(store.searchAnimes).toHaveBeenCalledWith('naruto')
    
    app.unmount()
  })
})
```

### **Ventajas del Patrón `withSetup`**

1. **Testing Realista**: Simula el contexto real de un componente Vue
2. **Lifecycle Hooks**: Ejecuta automáticamente `onMounted`, `onUnmounted`, etc.
3. **Reactivity**: Mantiene la reactividad de Vue en los tests
4. **Cleanup**: Proporciona función `unmount()` para limpieza
5. **Tipado**: Soporte completo de TypeScript

### **Mejores Prácticas**

#### **1. Siempre hacer Cleanup**

```typescript
// ✅ Correcto
const [result, app] = withSetup(() => useAnimeDetail())
// ... tests ...
app.unmount()

// ❌ Incorrecto - Memory leaks
const [result] = withSetup(() => useAnimeDetail())
// ... tests sin cleanup ...
```

#### **2. Mockear Dependencias Externas**

```typescript
// ✅ Mockear vue-router antes de withSetup
vi.mock('vue-router', () => ({
  useRoute: () => createMockRoute({ id: '1' })
}))

const [result, app] = withSetup(() => useAnimeDetail())
```

#### **3. Testing de Reactivity**

```typescript
// ✅ Testing de cambios reactivos
const [result, app] = withSetup(() => useAnimeDetail())

// Cambiar estado del store
store.currentAnime = newAnime

// Verificar que las computed se actualizan
expect(result.anime.value?.title).toBe('New Title')
```

### **Comparación con Testing Directo**

| Aspecto | Testing Directo | withSetup |
|---------|----------------|-----------|
| **Lifecycle Hooks** | ❌ No se ejecutan | ✅ Se ejecutan automáticamente |
| **Reactivity** | ✅ Funciona | ✅ Funciona |
| **Contexto** | ❌ Sin contexto de componente | ✅ Con contexto completo |
| **Complejidad** | ✅ Simple | ⚠️ Más complejo |
| **Performance** | ✅ Rápido | ⚠️ Más lento |

### **Cuándo NO usar `withSetup`**

- Composables que solo usan `ref`, `computed`, `watch`
- Testing de lógica pura sin lifecycle hooks
- Cuando el testing directo es suficiente

### **Referencias**

- [How to Test Vue Composables](https://alexop.dev/posts/how-to-test-vue-composables/) - Alex Op
- [Vue Testing Guide](https://vuejs.org/guide/scaling-up/testing) - Documentación oficial
- [Testing Vue Composables](https://www.telerik.com/blogs/how-manage-composition-api-refs-vue-3-unit-testing) - Telerik

### **Conclusión**

El patrón `withSetup` es especialmente útil para nuestros composables que usan `onMounted` y `watch`. Proporciona testing más realista y completo, aunque requiere más setup que el testing directo.

**Recomendación**: Usar `withSetup` para composables con lifecycle hooks, y testing directo para composables independientes. 