# Guía de Testing

**Última actualización**: Enero 2025  
**Autor actualización**: Anderson Mesa
**Autor**: Andersson Mesa
**Responsable**: Equipo de Desarrollo  
**Versión**: 1.0.0  

## Índice

- [Introducción](#introducción)
- [Enfoque: Dos Tipos de Usuarios](#enfoque-dos-tipos-de-usuarios)
- [Patrones y Mejores Prácticas](#patrones-y-mejores-prácticas)
- [Arquitectura de Testing](#arquitectura-de-testing)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Anti-Patrones a Evitar](#anti-patrones-a-evitar)
- [Herramientas y Configuración](#herramientas-y-configuración)
- [Checklist de Calidad](#checklist-de-calidad)
- [Métricas de Éxito](#métricas-de-éxito)
- [Recursos y Referencias](#recursos-y-referencias)

---

## Introducción

Esta guía reúne las mejores prácticas, patrones y ejemplos para escribir tests efectivos y mantenibles en este proyecto. Su objetivo es facilitar la incorporación de nuevos desarrolladores, estandarizar la calidad de las pruebas y asegurar que el código sea confiable y fácil de evolucionar.

El enfoque de testing está inspirado en los principios de la comunidad Vue y en referentes como Kent C. Dodds, priorizando la experiencia del usuario final y la robustez de la lógica de negocio. Aquí encontrarás recomendaciones claras sobre cuándo y cómo testear, cómo estructurar los tests, y cómo evitar los errores más comunes.

¿A quién está dirigida esta guía?
- A cualquier desarrollador que trabaje en el proyecto, sin importar su nivel de experiencia.
- A quienes deseen entender el porqué de las decisiones de testing y cómo aplicarlas en la práctica.

¿Qué encontrarás aquí?
- Explicaciones sobre la diferencia entre tests unitarios y de componentes.
- Ejemplos prácticos y patrones para testear composables, stores, servicios y componentes Vue.
- Estrategias para mockear dependencias, usar utilidades globales y crear datos de prueba reutilizables.
- Técnicas específicas para testing de inject/provide, formularios complejos y lifecycle de componentes.
- Patrones para testing de operaciones asíncronas, watchers y reactividad.
- Métricas de cobertura recomendadas y criterios de calidad.
- Referencias a artículos y repositorios de ejemplo para profundizar.

Esta documentación es un recurso vivo: se actualiza y mejora continuamente con la experiencia del equipo y los avances de la comunidad. Si tienes sugerencias o detectas áreas de mejora, ¡no dudes en contribuir!

---

## Enfoque: Dos Tipos de Usuarios

El testing efectivo requiere entender que no todos los usuarios de tu aplicación son iguales. Esta sección explica cómo adaptar nuestras estrategias de testing a las necesidades específicas de cada tipo de usuario.

### ¿Por qué separar por tipos de usuarios?

En el desarrollo de software, tenemos dos audiencias principales con necesidades muy diferentes:

1. **El usuario final** - Quien interactúa con la interfaz de usuario
2. **El desarrollador** - Quien escribe y mantiene el código

Cada uno tiene expectativas distintas sobre qué debe funcionar y cómo debe comportarse la aplicación. Nuestro enfoque de testing reconoce esta diferencia y adapta las estrategias de prueba en consecuencia.

### Desarrollador: Testing Unitario

¿Quién es?  
El desarrollador es quien escribe, mantiene y evoluciona el código. Necesita confianza en que los cambios que hace no rompen funcionalidad existente.

¿Qué necesita?  
El desarrollador necesita tests rápidos y específicos que le ayuden a:
- Verificar que la lógica funciona correctamente
- Detectar regresiones cuando hace cambios
- Entender cómo se comporta el código en diferentes escenarios
- Refactorizar con confianza

¿Qué probamos?  
Verificamos funciones puras, composables y lógica de negocio:

- Composables con lógica compleja
- Funciones de utilidad y transformación de datos
- Stores y manejo de estado
- Validaciones y cálculos
- Manejo de errores y casos edge

Características técnicas:
- **Sin DOM**: No renderizan componentes, solo prueban lógica
- **Aisladas**: Sin dependencias externas o efectos secundarios
- **Rápidas**: < 1ms por test
- **Determinísticas**: Mismo input siempre produce el mismo output

Ejemplo práctico:
```typescript
// Test unitario - Prueba lógica pura
it('should compute anime subtitle correctly', () => {
  const props = { anime: createMockAnime({ type: 'TV', status: 'Airing' }) }
  const emit = vi.fn()
  
  const { result } = renderComposable(() => useAnimeCard(props, emit))
  
  expect(result.current.animeSubtitle).toBe('TV • Airing')
})
```

### Usuario Final: Testing de Componentes

**¿Quién es?**  
El usuario final es quien interactúa directamente con la interfaz de usuario de tu aplicación. Puede ser un cliente, un administrador, o cualquier persona que use la aplicación para realizar tareas específicas.

**¿Qué necesita?**  
El usuario final necesita que la aplicación funcione como espera. No le importa cómo está implementado el código, solo quiere poder completar sus tareas de manera eficiente y sin errores.

**¿Qué probamos?**  
Simulamos las interacciones reales que un usuario tendría con la aplicación:

- Clicks en botones, enlaces y elementos interactivos
- Llenado y envío de formularios
- Navegación entre páginas
- Verificación de que la información se muestra correctamente
- Validación de accesibilidad y usabilidad

Características técnicas:
- **Con DOM**: Renderizan componentes reales en un entorno de testing
- **Centradas en el usuario**: Simulan interacciones reales del usuario
- **Más lentas**: 10-50ms por test debido al renderizado
- **Validación de UX**: Verifican comportamiento observable en la interfaz

**Guía conceptual:**
- **Mal**: Verificar detalles internos como `store.favorites.length` o `isFavorite.value`
- **Bien**: Verificar lo que el usuario realmente ve y puede hacer:
  - Botón con texto "Agregar a favoritos" visible
  - Al hacer click, el ícono cambia a corazón lleno
  - Se muestra mensaje de confirmación
  - El contador de favoritos aumenta

### Beneficios de esta separación

- **Claridad de responsabilidades**
Cada tipo de test tiene un propósito específico y bien definido. Los tests de componentes validan la experiencia del usuario, mientras que los tests unitarios validan la lógica de negocio.
- **Mantenibilidad mejorada**
Los desarrolladores pueden refactorizar lógica interna sin romper tests de UI. Los tests unitarios siguen siendo válidos mientras la interfaz pública se mantenga consistente.
- **Confianza en la calidad**
Los usuarios finales tienen garantía de que la interfaz funciona como esperan, mientras que los desarrolladores tienen confianza en que la lógica es robusta y correcta.
- **Eficiencia en el desarrollo**
Los tests unitarios son rápidos y permiten desarrollo iterativo, mientras que los tests de componentes validan la integración completa cuando es necesario.
- **Validación completa del sistema**
Cubrimos tanto la lógica interna como la experiencia de usuario, nos ayuda a tener mas estable la aplicación.
- **Detección temprana de problemas**
Los tests de componentes detectan problemas de integración entre lógica y template que los tests unitarios no pueden identificar.

### ¿Por qué no solo pruebas unitarias?

Aunque algunos enfoques sugieren usar únicamente pruebas unitarias para maximizar la velocidad, nuestro enfoque híbrido es superior por las siguientes razones, basándonos en los principios de [Kent C. Dodds](https://kentcdodds.com/blog/testing-implementation-details):

Los tests de componentes validan UX real
Los tests unitarios pueden pasar mientras la interfaz de usuario está rota. Los tests de componentes garantizan que el usuario puede realmente usar la aplicación.

Detectan problemas de integración
Los tests de componentes prueban la funcionalidad de un componente específico y sus hijos directos (si no son complejos). Si los hijos son complejos, se mockean para enfocarse en la lógica del componente padre, pero se integra la mayor parte de la funcionalidad real.

Validan accesibilidad naturalmente
Al usar selectores como `getByRole()` y `getByLabelText()`, los tests de componentes promueven y validan la accesibilidad de la aplicación.

Evitan falsos positivos y falsos negativos
Los tests unitarios pueden generar dos tipos de errores problemáticos:

- **Falsos positivos**: El test pasa pero la funcionalidad está rota para el usuario. Por ejemplo, un test unitario puede verificar que `toggleFavorite()` se llama correctamente, pero si el botón no está visible o no responde al click, el usuario no puede usar la funcionalidad.

- **Falsos negativos**: El test falla pero la funcionalidad funciona correctamente. Esto sucede cuando testeas detalles de implementación que cambian durante el desarrollo, como nombres de variables internas o estructura de datos específica.

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
    const { result } = renderComposable(() => useAnimeCard(props, emit))
    
    // Assert - Verificar resultado
    expect(result.current.animeSubtitle).toBe('TV • Airing')
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

### Testing de localStorage

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
- Simular errores de quota excedida
- Testing de comportamiento cuando localStorage falla
- Control total sobre respuestas en casos edge

### Testing de Vue Router

**Enfoque recomendado: Router real vs Mocks selectivos**

Basándonos en las mejores prácticas de [Vue Test Utils](https://v1.test-utils.vuejs.org/guides/using-with-vue-router.html) y [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/vue-router.html), el testing de Vue Router requiere un enfoque estratégico según el tipo de test.

**¿Cuándo usar router real vs mocks?**

- **Router real**: Para tests de integración y navegación completa
- **Mocks selectivos**: Para tests unitarios de componentes que solo necesitan `$route` o `$router`

**Patrón 1: Router real para integración**
```typescript
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import NavigationMenu from '@/components/NavigationMenu.vue'
import { userEvent } from '@testing-library/user-event'

describe('NavigationMenu', () => {
  it('should navigate using router links', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/dashboard', component: { template: 'Dashboard' } },
        { path: '/settings', component: { template: 'Settings' } },
        { path: '/profile', component: { template: 'Profile' } },
        { path: '/', component: { template: 'Home' } },
      ],
    })

    render(NavigationMenu, {
      global: {
        plugins: [router],
      },
    })

    const user = userEvent.setup()
    expect(router.currentRoute.value.path).toBe('/')

    await router.isReady()
    await user.click(screen.getByText('Dashboard'))
    expect(router.currentRoute.value.path).toBe('/dashboard')

    await user.click(screen.getByText('Profile'))
    expect(router.currentRoute.value.path).toBe('/profile')
  })
})
```

**Patrón 2: Mocks selectivos para componentes**
```typescript
import { render, screen } from '@testing-library/vue'
import { useRouter, type Router } from 'vue-router'
import { describe, it, expect, vi } from 'vitest'
import NavigationMenu from '@/components/NavigationMenu.vue'
import { userEvent } from '@testing-library/user-event'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}))

describe('NavigationMenu with mocked router', () => {
  it('should handle navigation with mocked router', async () => {
    const mockRouter = {
      push: mockPush,
      currentRoute: { value: { path: '/' } },
    } as unknown as Router

    vi.mocked(useRouter).mockImplementation(() => mockRouter)

    const user = userEvent.setup()
    render(NavigationMenu)

    await user.click(screen.getByText('Profile'))
    expect(mockPush).toHaveBeenCalledWith('/profile')
  })
})
```

**Patrón 3: RouterLink Stub para testing aislado**
```typescript
// test-utils.ts
import { Component, h } from 'vue'
import { useRouter } from 'vue-router'

export const RouterLinkStub: Component = {
  name: 'RouterLinkStub',
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
    tag: {
      type: String,
      default: 'a',
    },
    exact: Boolean,
    exactPath: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    exactPathActiveClass: String,
    event: {
      type: [String, Array],
      default: 'click',
    },
  },
  setup(props) {
    const router = useRouter()
    const navigate = () => {
      router.push(props.to)
    }
    return { navigate }
  },
  render() {
    return h(
      this.tag,
      {
        onClick: () => this.navigate(),
      },
      this.$slots.default?.(),
    )
  },
}
```

**Patrón 4: Testing de navigation guards**
```typescript
import { render, screen } from '@testing-library/vue'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import RouteLeaveGuardDemo from '@/components/RouteLeaveGuardDemo.vue'

const routes = [
  { path: '/', component: RouteLeaveGuardDemo },
  { path: '/about', component: { template: '<div>About</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const App = { template: '<router-view />' }

describe('RouteLeaveGuardDemo', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    window.confirm = vi.fn()
    await router.push('/')
    await router.isReady()
  })

  it('should prompt when guard is triggered and user confirms', async () => {
    // Set window.confirm to simulate a user confirming the prompt
    window.confirm = vi.fn(() => true)

    // Render the component within a router context
    render(App, {
      global: {
        plugins: [router],
      },
    })

    const user = userEvent.setup()

    // Find the 'About' link and simulate a user click
    const aboutLink = screen.getByRole('link', { name: /About/i })
    await user.click(aboutLink)

    // Assert that the confirm dialog was shown with the correct message
    expect(window.confirm).toHaveBeenCalledWith('Do you really want to leave this page?')

    // Verify that the navigation was allowed and the route changed to '/about'
    expect(router.currentRoute.value.path).toBe('/about')
  })
})
```

**Patrón 5: Helper reutilizable para testing de router**
```typescript
// test-utils.ts
import { render } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { RenderOptions } from '@testing-library/vue'
// path of the definition of your routes
import { routes } from '../../router/index.ts'

interface RenderWithRouterOptions extends Omit<RenderOptions<any>, 'global'> {
  initialRoute?: string
  routerOptions?: {
    routes?: typeof routes
    history?: ReturnType<typeof createWebHistory>
  }
}

export function renderWithRouter(Component: any, options: RenderWithRouterOptions = {}) {
  const { initialRoute = '/', routerOptions = {}, ...renderOptions } = options

  const router = createRouter({
    history: createWebHistory(),
    // Use provided routes or import from your router file
    routes: routerOptions.routes || routes,
  })

  router.push(initialRoute)

  return {
    // Return everything from regular render, plus the router instance
    ...render(Component, {
      global: {
        plugins: [router],
      },
      ...renderOptions,
    }),
    router,
  }
}
```

**Uso del helper:**
```typescript
describe('NavigationMenu', () => {
  it('should navigate using router links', async () => {
    const { router } = renderWithRouter(NavigationMenu, {
      initialRoute: '/',
    })

    await router.isReady()
    const user = userEvent.setup()
    
    await user.click(screen.getByText('Dashboard'))
    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})
```

**Patrón 6: Testing de guards específicos del proyecto**
```typescript
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { authRequiresAuthGuard } from '@/modules/auth/routes/auth.guards'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Auth Guards Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to login when user is not authenticated', async () => {
    // Arrange
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { 
          path: '/protected', 
          component: { template: '<div>Protected</div>' },
          meta: { requiresAuth: true }
        },
        { 
          path: '/login', 
          component: { template: '<div>Login</div>' }
        }
      ]
    })

    // Mock store para usuario no autenticado
    const pinia = createTestingPinia({
      initialState: {
        auth: { isAuthenticated: false, user: null }
      }
    })

    // Act
    render({ template: '<router-view />' }, {
      global: {
        plugins: [router, pinia]
      }
    })

    await router.push('/protected')
    await router.isReady()

    // Assert
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should allow access when user is authenticated', async () => {
    // Arrange
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { 
          path: '/protected', 
          component: { template: '<div>Protected Content</div>' },
          meta: { requiresAuth: true }
        }
      ]
    })

    const pinia = createTestingPinia({
      initialState: {
        auth: { isAuthenticated: true, user: { id: 1, name: 'Test User' } }
      }
    })

    // Act
    render({ template: '<router-view />' }, {
      global: {
        plugins: [router, pinia]
      }
    })

    await router.push('/protected')
    await router.isReady()

    // Assert
    expect(router.currentRoute.value.path).toBe('/protected')
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should test specific guard function directly', async () => {
    // Arrange
    const mockRouter = {
      push: vi.fn(),
      currentRoute: { value: { path: '/protected' } }
    }

    const mockStore = {
      isAuthenticated: false,
      user: null
    }

    // Act
    const result = await authRequiresAuthGuard(
      { path: '/protected', meta: { requiresAuth: true } } as any,
      { path: '/login' } as any
    )

    // Assert
    expect(result).toBe('/login')
  })
})
```

**Patrón 7: Testing de rutas dinámicas**
```typescript
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Dynamic Routes Testing', () => {
  let router: any

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { 
          path: '/anime/:id', 
          name: 'AnimeDetail',
          component: { template: '<div>Anime Detail: {{ $route.params.id }}</div>' },
          props: true
        }
      ]
    })

    await router.isReady()
  })

  it('should handle anime detail route with dynamic id', async () => {
    // Act
    await router.push('/anime/123')

    // Assert
    expect(router.currentRoute.value.params.id).toBe('123')
    expect(router.currentRoute.value.name).toBe('AnimeDetail')
  })

  it('should render component with dynamic props', async () => {
    // Act
    await router.push('/anime/456')
    
    render({ template: '<router-view />' }, {
      global: {
        plugins: [router]
      }
    })

    // Assert
    expect(screen.getByText('Anime Detail: 456')).toBeInTheDocument()
  })

  it('should handle multiple dynamic parameters', async () => {
    // Arrange
    const routerWithMultipleParams = createRouter({
      history: createWebHistory(),
      routes: [
        { 
          path: '/anime/:category/:id', 
          name: 'AnimeCategoryDetail',
          component: { 
            template: '<div>Category: {{ $route.params.category }}, ID: {{ $route.params.id }}</div>' 
          },
          props: true
        }
      ]
    })

    await routerWithMultipleParams.isReady()

    // Act
    await routerWithMultipleParams.push('/anime/action/789')

    // Assert
    expect(routerWithMultipleParams.currentRoute.value.params.category).toBe('action')
    expect(routerWithMultipleParams.currentRoute.value.params.id).toBe('789')
  })
})
```

**Utilidades para testing de router (test/setup.ts):**
```typescript
// Helper para crear mocks de router más específicos
export const createMockRouter = (customMethods: Record<string, unknown> = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      params: {},
      query: {},
      hash: ''
    }
  },
  ...customMethods
})

// Helper para verificar navegación
export const expectNavigation = (
  routerMock: any,
  expectedPath: string,
  expectedOptions?: unknown
) => {
  expect(routerMock.push).toHaveBeenCalledWith(
    expectedPath,
    expectedOptions
  )
}
```

**Mejores prácticas:**
- **Usa router real para tests de integración** - Simula el comportamiento real del usuario
- **Usa mocks selectivos para tests unitarios** - Solo cuando necesites aislar el componente
- **Siempre espera `router.isReady()`** - Vue Router 4 es asíncrono
- **Usa `userEvent` para interacciones** - Simula interacciones reales del usuario
- **Testea comportamiento observable** - No detalles de implementación interna
- **Usa `screen.getByRole()` y `screen.getByText()`** - Promueve accesibilidad
- **Crea helpers reutilizables** - Para reducir duplicación de código
- **Limpia estado entre tests** - Usa `beforeEach` para resetear router

### Testing de Operaciones Asíncronas
Técnicas para probar código que involucra promesas, timers, y operaciones que no se completan inmediatamente, asegurando que los tests manejen correctamente la naturaleza asíncrona del código.

```typescript
// Importar Either real (no mockeado para estos tests)
import { right, left } from '@/core/either'
import { animeApi } from '@/modules/anime/services/anime.services' // Mockeado en setup.ts del anime

// Importar setup específico del módulo anime para activar los mocks
import '../setup'

describe('Async Operations', () => {
  it('should handle async data loading', async () => {
    // Arrange
    const mockResponse = createSuccessMock({ data: [] })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
    
    // Act
    await store.loadAnimeList()
    
    // Assert
    expect(store.isLoading).toBe(false)
    expect(store.animeList).toHaveLength(0)
  })

  it('should show loading state while fetching data', async () => {
    // Arrange
    const mockResponse = createSuccessMock({ data: [] })
    vi.mocked(animeApi.getAnimeList).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
    )
    
    // Act
    render(AnimeList)
    
    // Assert - Loading inicial
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
    
    // Act - Esperar que termine
    await waitForElementToBeRemoved(() => screen.getByText(/cargando/i))
    
    // Assert - Loading desaparece
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    // Arrange
    const mockError = createFailureMock('Network Error')
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockError)
    
    // Act
    render(AnimeList)
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
    })
  })

  it('should handle async composable operations', async () => {
    // Arrange
    const props = { anime: createMockAnime() }
    const emit = vi.fn()
    const { result } = renderComposable(() => useAnimeCard(props, emit))
    
    // Act
    await result.current.toggleFavorite()
    
    // Assert
    expect(result.current.isFavorite.value).toBe(true)
    expect(emit).toHaveBeenCalledWith('toggle-favorite', props.anime)
  })
})
```

### Testing con Patrón Either

**¿Por qué usar Either en testing?**
El patrón Either proporciona un manejo funcional de errores que hace los tests más predecibles y legibles. **NO necesitas mockear el Either** - usa la implementación real.

**Ventajas de usar Either real:**
- Tests más confiables y realistas
- Funcionalidad completa disponible
- Menos código de setup en tests
- Debugging más claro

#### **1. Cómo mockear servicios que retornan Either**
```typescript
import { right, left } from '@/core/either'

// Mockear el servicio
vi.mock('@/modules/anime/services/anime.services', () => ({
  animeApi: {
    getAnimeList: vi.fn(),
    getAnimeById: vi.fn()
  }
}))

// Crear respuestas mock usando Either real
const successResponse = right({ data: [createMockAnime()] })
const errorResponse = left({ 
  code: 'API_ERROR', 
  message: 'Error al cargar datos' 
})
```

#### **2. Testing en composables**
```typescript
describe('useAnimeList', () => {
  it('should handle successful API response', async () => {
    // Arrange
    const mockData = right({ data: [createMockAnime()] })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockData)
    
    // Act
    const result = useAnimeList()
    await result.loadAnimes()
    
    // Assert
    expect(result.animes.value).toHaveLength(1)
    expect(result.error.value).toBeNull()
  })

  it('should handle API error', async () => {
    // Arrange
    const mockError = left({ message: 'Error de red' })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockError)
    
    // Act
    const result = useAnimeList()
    await result.loadAnimes()
    
    // Assert
    expect(result.animes.value).toHaveLength(0)
    expect(result.error.value).toBe('Error de red')
  })
})

it('should handle Either with fold pattern like in stores', async () => {
  // Arrange
  const successResponse = right({ data: [createMockAnime()] })
  const failureResponse = left({ 
    code: 'API_ERROR', 
    reason: 'NETWORK_ERROR', 
    status: 500, 
    message: 'API Error' 
  })
  
  // Act & Assert - Success case using fold (como en stores)
  vi.mocked(animeApi.getAnimeList).mockResolvedValue(successResponse)
  const result = await animeApi.getAnimeList({})
  
  let successData = null
  let errorMessage = null
  
  result.fold(
    (error) => { errorMessage = error.message },
    (data) => { successData = data }
  )
  
  expect(successData).toEqual({ data: [createMockAnime()] })
  expect(errorMessage).toBeNull()
  
  // Act & Assert - Failure case using fold
  vi.mocked(animeApi.getAnimeList).mockResolvedValue(failureResponse)
  const errorResult = await animeApi.getAnimeList({})
  
  successData = null
  errorMessage = null
  
  errorResult.fold(
    (error) => { errorMessage = error.message },
    (data) => { successData = data }
  )
  
  expect(errorMessage).toBe('API Error')
  expect(successData).toBeNull()
})

it('should handle Either with isRight/isLeft pattern like in composables', async () => {
  // Arrange
  const successResponse = right({ data: [createMockAnime()] })
  const failureResponse = left({ 
    code: 'API_ERROR', 
    reason: 'NETWORK_ERROR', 
    status: 500, 
    message: 'API Error' 
  })
  
  // Act & Assert - Success case using isRight (como en composables)
  vi.mocked(animeApi.getAnimeCharacters).mockResolvedValue(successResponse)
  const result = await animeApi.getAnimeCharacters(1)
  
  if (result.isRight()) {
    expect(result.value.data.data).toHaveLength(1)
  } else {
    fail('Expected success but got failure')
  }
  
  // Act & Assert - Failure case using isLeft
  vi.mocked(animeApi.getAnimeCharacters).mockResolvedValue(failureResponse)
  const errorResult = await animeApi.getAnimeCharacters(1)
  
  if (result.isLeft()) {
    expect(result.value.message).toBe('API Error')
  } else {
    fail('Expected failure but got success')
  }
})

it('should handle Either with fold for error control', async () => {
  // Arrange
  const successResponse = right({ data: [createMockAnime()] })
  const failureResponse = left({ 
    code: 'NETWORK_ERROR', 
    reason: 'CONNECTION_FAILED', 
    status: 503, 
    message: 'Network Error' 
  })
  
  // Act & Assert - Success with fold
  vi.mocked(animeApi.getAnimeList).mockResolvedValue(successResponse)
  const successResult = await animeApi.getAnimeList({})
  
  let successData = null
  let errorMessage = null
  
  successResult.fold(
    (error) => { errorMessage = error.message },
    (data) => { successData = data }
  )
  
  expect(successData).toEqual({ data: [createMockAnime()] })
  expect(errorMessage).toBeNull()
  
  // Act & Assert - Failure with fold
  vi.mocked(animeApi.getAnimeList).mockResolvedValue(failureResponse)
  const failureResult = await animeApi.getAnimeList({})
  
  successData = null
  errorMessage = null
  
  failureResult.fold(
    (error) => { errorMessage = error.message },
    (data) => { successData = data }
  )
  
  expect(errorMessage).toBe('Network Error')
  expect(successData).toBeNull()
})
```

#### **3. Testing en componentes**
```typescript
import { render, screen, waitFor } from '@testing-library/vue'

describe('AnimeList Component', () => {
  it('should display anime cards when data loads successfully', async () => {
    // Arrange
    const mockData = right({ data: [createMockAnime()] })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockData)
    
    // Act
    render(AnimeList)
    
    // Assert
    await waitFor(() => {
      expect(screen.getAllByTestId('anime-card')).toHaveLength(1)
    })
    expect(screen.queryByText('error')).not.toBeInTheDocument()
  })

  it('should display error message when API fails', async () => {
    // Arrange
    const mockError = left({ message: 'Error al cargar animes' })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockError)
    
    // Act
    render(AnimeList)
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Error al cargar animes')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('anime-card')).not.toBeInTheDocument()
  })

  it('should handle Either success and failure cases', async () => {
    // Arrange
    const successResponse = right({ data: [createMockAnime()] })
    const failureResponse = left({ 
      code: 'API_ERROR', 
      reason: 'NETWORK_ERROR', 
      status: 500, 
      message: 'API Error' 
    })
    
    // Act & Assert - Success case
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(successResponse)
    const { result } = renderComposable(() => useAnimeList())
    await result.current.loadAnimeList()
    
    expect(result.current.animes.value).toHaveLength(1)
    expect(result.current.error.value).toBeNull()
    
    // Act & Assert - Failure case
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(failureResponse)
    await result.current.loadAnimeList()
    
    expect(result.current.error.value).toBe('Error en el módulo de anime')
    expect(result.current.animes.value).toHaveLength(0)
  })
})
```


### Testing de Inject/provide

**¿Cuándo usar provide/inject en testing?**
El patrón provide/inject es común en formularios complejos donde múltiples componentes necesitan compartir estado. Nuestro enfoque de testing se adapta según el tipo de test y el nivel de integración necesario.

#### **1. Testing de Composables con Provide/Inject**

**Patrón recomendado**: Usar `withSetup` para testing unitario de composables que usan provide/inject.

```typescript
import { withSetup } from '@/test/utils/withSetup'
import { useRegisterFormProvider } from '@/modules/auth/composables/useRegisterFormProvider'
import { useRegisterFormStepValidation } from '@/modules/auth/composables/useRegisterFormStepValidation'

describe('Register Form Provider/Inject Pattern', () => {
  it('should provide form data to child composables', () => {
    // Arrange
    const emit = vi.fn()
    
    // Act - Provider setup
    const { result: providerResult, app: providerApp } = withSetup(() => 
      useRegisterFormProvider(emit)
    )
    
    // Act - Inject setup (simula componente hijo)
    const { result: injectResult, app: injectApp } = withSetup(() => 
      useRegisterFormStepValidation()
    )
    
    // Assert - Verificar que el provider funciona
    expect(providerResult.provide).toBeDefined()
    expect(providerResult.form).toBeDefined()
    expect(providerResult.form.username).toBe('')
    
    // Cleanup
    providerApp.unmount()
    injectApp.unmount()
  })

  it('should validate form data through inject pattern', () => {
    // Arrange
    const emit = vi.fn()
    const { result: providerResult, app: providerApp } = withSetup(() => 
      useRegisterFormProvider(emit)
    )
    
    // Act - Simular llenado de formulario
    providerResult.form.username = 'testuser'
    providerResult.form.firstName = 'Test'
    
    // Act - Validar usando composable inyectado
    const { result: validationResult, app: validationApp } = withSetup(() => 
      useRegisterFormStepValidation()
    )
    
    // Assert - Verificar validación
    const isValid = validationResult.validateForm(providerResult.form)
    expect(isValid).toBe(true)
    
    // Cleanup
    providerApp.unmount()
    validationApp.unmount()
  })
})
```

#### **2. Testing de Componentes con Provide/Inject**

**Patrón recomendado**: Testing real entre componentes padre e hijo para validar integración completa.

```typescript
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import RegisterFormStep from '@/modules/auth/views/RegisterFormStep/index.vue'

describe('Register Form Step Component Integration', () => {
  it('should render form sections with shared state', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar que todas las secciones están presentes
    expect(screen.getByTestId('section:basic')).toBeInTheDocument()
    expect(screen.getByTestId('section:residence')).toBeInTheDocument()
    expect(screen.getByTestId('section:contact')).toBeInTheDocument()
    expect(screen.getByTestId('section:preferences')).toBeInTheDocument()
  })

  it('should display form header with correct content', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar contenido del formulario
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear Cuenta')
    expect(screen.getByText('Completa los siguientes datos para crear tu cuenta')).toBeInTheDocument()
  })
})
```

#### **3. Testing de Validación con Inject**

**Patrón recomendado**: Testing unitario de lógica de validación usando composables inyectados.

```typescript
import { useRegisterFormStepValidation } from '@/modules/auth/composables/useRegisterFormStepValidation'
import { createValidRegisterForm } from '@/modules/auth/test/factories/register.factory'

describe('Form Validation with Inject Pattern', () => {
  it('should validate complete form data', () => {
    // Arrange
    const { result } = renderComposable(() => useRegisterFormStepValidation())
    const validForm = createValidRegisterForm()
    
    // Act
    const isValid = result.validateForm(validForm)
    
    // Assert
    expect(isValid).toBe(true)
  })

  it('should reject form with missing required fields', () => {
    // Arrange
    const { result } = renderComposable(() => useRegisterFormStepValidation())
    const invalidForm = createValidRegisterForm({ username: '' }) // Username vacío
    
    // Act
    const isValid = result.validateForm(invalidForm)
    
    // Assert
    expect(isValid).toBe(false)
  })

  it('should provide validation rules for all form fields', () => {
    // Arrange
    const { result } = renderComposable(() => useRegisterFormStepValidation())
    
    // Act & Assert
    expect(result.validationRules).toBeDefined()
    expect(result.validationRules.username).toBeDefined()
    expect(result.validationRules.firstName).toBeDefined()
    expect(result.validationRules.country).toBeDefined()
  })
})
```

#### **4. Mejores Prácticas para Provide/Inject**

**SÍ hacer:**
- **Composables unitarios**: Usar `withSetup` para testing aislado
- **Integración real**: Testing entre componentes padre/hijo
- **Validación separada**: Testing unitario de lógica de validación
- **Cleanup**: Siempre hacer `app.unmount()` en tests con lifecycle

**NO hacer:**
- Mockear provide/inject en tests de integración
- Testear detalles internos de la inyección
- Ignorar cleanup en tests con `withSetup`
- Mezclar testing unitario e integración en el mismo test

### Selectores y Atributos para Testing de Componentes

**¿Por qué es crucial elegir el selector correcto en testing de componentes?**
Los selectores determinan qué tan robustos, accesibles y mantenibles serán tus tests. Testing Library proporciona múltiples métodos de consulta, cada uno con un propósito específico que se alinea con nuestro enfoque centrado en el usuario.

#### **Jerarquía de Preferencia de Selectores**

**Orden recomendado (de mejor a peor):**

1. **`getByRole()`** - Aunque el role es lo mejor para accesibilidad y semántica pero como queremos dar compatibilidad para plataformas que van usar los QA para pruebas automatizadas usaremos los otros tres para ser mas específicos con el selector
2. **`getByLabelText()`** - Para formularios y elementos con labels
3. **`getByText()`** - Para contenido visible y legible
4. **`getByTestId()`** - Último recurso para elementos sin significado semántico

#### **2. getByLabelText() - Para Formularios y Elementos con Labels**

**¿Qué hace?** Busca elementos por el texto de su label asociado.

**Funciona con:**
- Labels con `for` + `id`
- Labels que envuelven inputs
- `aria-label`
- `aria-labelledby`

```vue
<!-- Diferentes formas de label -->
<label for="email">Email</label>
<input id="email" />

<label>
  Contraseña
  <input type="password" />
</label>

<input aria-label="Usuario" />

<label id="name-label">Nombre</label>
<input aria-labelledby="name-label" />
```

```typescript
// Todos funcionan igual
screen.getByLabelText('Email')     // ✅ Label con for
screen.getByLabelText('Contraseña') // ✅ Label envolviendo  
screen.getByLabelText('Usuario')    // ✅ aria-label
screen.getByLabelText('Nombre')     // ✅ aria-labelledby
```

#### **3. getByText() - Para Contenido Visible**

**¿Qué hace?** Busca elementos por su texto visible.

```typescript
// Buscar por texto exacto
screen.getByText('Crear Cuenta')

// Buscar por regex
screen.getByText(/crear cuenta/i)

// Buscar por función
screen.getByText((content, element) => {
  return element.tagName.toLowerCase() === 'h1' && content.includes('Título')
})
```

#### **4. getByTestId() - Último Recurso**

**¿Qué hace?** Busca elementos por el atributo `data-testid`.

**Cuándo usar:**
- Elementos sin significado semántico
- Contenedores de layout
- Estados específicos
- Elementos que no tienen rol natural

```vue
<!-- Elementos sin rol semántico -->
<div data-testid="loading-skeleton">
  <div class="skeleton"></div>
</div>

<!-- Contenedores de layout -->
<div data-testid="anime-grid-container">
  <AnimeCard v-for="anime in animes" :key="anime.id" :anime="anime" />
</div>

<!-- Estados específicos -->
<div data-testid="error-message" v-if="error">
  {{ error }}
</div>
```

```typescript
// En el test
expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
```

#### **Convención de Nomenclatura para data-testid**

**Estructura recomendada: `tipo:propósito`**

```vue
<!-- Formularios -->
data-testid="form:register"
data-testid="form:login"

<!-- Secciones -->
data-testid="section:basic"
data-testid="section:contact"

<!-- Inputs -->
data-testid="input:username"
data-testid="input:email"
data-testid="input:password"

<!-- Selects -->
data-testid="select:country"
data-testid="select:city"

<!-- Botones -->
data-testid="button:submit"
data-testid="button:cancel"
data-testid="button:toggle-favorite"

<!-- Contenedores -->
data-testid="container:anime-grid"
data-testid="container:loading-skeleton"

<!-- Estados -->
data-testid="state:loading"
data-testid="state:error"
data-testid="state:empty"
```

#### **Patrón Completo de Ejemplo para Componentes**

```typescript
// Formulario de registro completo
<form role="form" aria-label="Formulario de registro de usuario">
  <fieldset>
    <legend>Información Personal</legend>
    
    <!-- Inputs básicos -->
    <label for="firstName">Nombre</label>
    <input id="firstName" type="text" required />
    
    <label for="lastName">Apellido</label>
    <input id="lastName" type="text" required />
    
    <label for="email">Correo electrónico</label>
    <input id="email" type="email" required />
    
    <!-- Select -->
    <label for="country">País</label>
    <select id="country" required>
      <option value="">Selecciona tu país</option>
      <option value="colombia">Colombia</option>
      <option value="mexico">México</option>
    </select>
    
    <!-- Checkboxes -->
    <label>
      <input type="checkbox" />
      Acepto recibir newsletter
    </label>
    
    <label>
      <input type="checkbox" required />
      Acepto los términos y condiciones
    </label>
  </fieldset>
  
  <!-- Botones -->
  <button type="submit" aria-label="Crear cuenta de usuario">
    Crear Cuenta
  </button>
  
  <button type="button" aria-label="Cancelar registro">
    Cancelar
  </button>
</form>
```

```typescript
// Testing completo del formulario
describe('RegisterForm', () => {
  it('should handle complete form submission', async () => {
    const user = userEvent.setup()
    
    render(RegisterForm)
    
    // Llenar formulario usando getByLabelText
    await user.type(screen.getByLabelText('Nombre'), 'Juan')
    await user.type(screen.getByLabelText('Apellido'), 'Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@email.com')
    await user.selectOptions(screen.getByLabelText('País'), 'colombia')
    
    // Checkboxes
    await user.click(screen.getByLabelText('Acepto recibir newsletter'))
    await user.click(screen.getByLabelText('Acepto los términos y condiciones'))
    
    // Submit usando getByRole
    await user.click(screen.getByRole('button', { name: 'Crear cuenta de usuario' }))
    
    // Verificar resultado
    expect(screen.getByText('Cuenta creada exitosamente')).toBeInTheDocument()
  })
})
```

#### **Compatibilidad con Herramientas de QA**

**Para máxima compatibilidad con herramientas de QA como Autonoma:**
No se recomería normalmente aplicar testid en los elementos con role por default pero para permitir compatibilidad con QA quedaría de la siguiente manera

```vue
<button aria-label="Enviar">Enviar</button>
o
<button data-testid="submit-button">Enviar</button>

<input data-testid="email-input" />
```

#### **Mejores Prácticas para Testing de Componentes**

**SÍ hacer:**
- **Usar `getByLabelText()` para formularios** - Más semántico
- **Usar `getByText()` para contenido visible** - Más natural
- **Usar `getByTestId()` solo cuando es necesario** - tratar de usar para siempre híbrido para que funcione también QA automatizado
- **Seguir convenciones de nomenclatura** - Consistencia
- **Testear comportamiento observable** - Lo que el usuario ve y puede hacer

**NO hacer:**
- **Usar `getByRole()` primero** - Por compatibilidad con QA
- **Usar `getByClassName()` o `getById()`** - Frágil y no accesible
- **Usar `aria-label` cuando hay texto visible** - Confunde lectores de pantalla
- **Testear detalles internos** - Estado privado, variables internas

**Regla simple:**
- **Sin texto visible** → Usar `aria-label`
- **Con texto descriptivo** → NO usar `aria-label`

### Factories testing data

**¿Por qué usar factories para testing?**
Las factories proporcionan datos de prueba consistentes, reutilizables y mantenibles. Siguiendo las mejores prácticas de [Stackademic](https://blog.stackademic.com/best-practices-for-managing-test-data-in-nestjs-with-jest-e4729769047b?gi=2dd7bb52c473), implementamos un enfoque modular que facilita la creación y mantenimiento de datos de prueba.

#### **1. Patrón Factory por Módulo**

**Estructura recomendada:**
```
src/modules/auth/test/factories/
├── register.factory.ts
├── user.factory.ts
└── index.ts
```

**Ventajas del enfoque modular:**
- **Reutilización**: Factories específicas por dominio
- **Mantenimiento**: Cambios centralizados en un lugar
- **Consistencia**: Datos coherentes en todos los tests
- **Flexibilidad**: Overrides para casos específicos

#### **2. Implementación de Factories**

```typescript
// src/modules/auth/test/factories/register.factory.ts
import type { RegisterForm } from '@/modules/auth/types/Auth.types'

interface RegisterFormOverrides {
  username?: string
  firstName?: string
  country?: string
  city?: string
  emergencyContact?: string
  emergencyPhone?: string
  newsletter?: boolean
  termsAccepted?: boolean
  marketingConsent?: boolean
}

export const createMockRegisterForm = (overrides: RegisterFormOverrides = {}): RegisterForm => ({
  username: '',
  firstName: '',
  country: '',
  city: '',
  emergencyContact: '',
  emergencyPhone: '',
  newsletter: false,
  termsAccepted: false,
  marketingConsent: false,
  ...overrides // Permitir customización
})

export const createValidRegisterForm = (overrides: RegisterFormOverrides = {}): RegisterForm => 
  createMockRegisterForm({
    username: 'testuser123',
    firstName: 'Juan',
    country: 'colombia',
    city: 'Bogotá',
    emergencyContact: 'María García',
    emergencyPhone: '3001234567',
    newsletter: true,
    termsAccepted: true,
    marketingConsent: false,
    ...overrides
  })

// Factory para casos edge
export const createInvalidRegisterForm = (overrides: RegisterFormOverrides = {}): RegisterForm => 
  createMockRegisterForm({
    username: '', // Inválido: vacío
    firstName: 'A', // Inválido: muy corto
    country: '', // Inválido: vacío
    city: '', // Inválido: vacío
    emergencyContact: '', // Inválido: vacío
    emergencyPhone: '', // Inválido: vacío
    newsletter: false,
    termsAccepted: false, // Inválido: no aceptado
    marketingConsent: false,
    ...overrides
  })
```

#### **3. Uso en Tests**

```typescript
import { createMockRegisterForm, createValidRegisterForm } from '../factories/register.factory'

describe('Register Form Testing with Factories', () => {
  it('should handle empty form data', () => {
    // Arrange
    const emptyForm = createMockRegisterForm()
    
    // Act & Assert
    expect(emptyForm.username).toBe('')
    expect(emptyForm.termsAccepted).toBe(false)
  })

  it('should handle valid form data', () => {
    // Arrange
    const validForm = createValidRegisterForm()
    
    // Act & Assert
    expect(validForm.username).toBe('testuser123')
    expect(validForm.termsAccepted).toBe(true)
    expect(validForm.country).toBe('colombia')
  })

  it('should allow custom overrides', () => {
    // Arrange
    const customForm = createValidRegisterForm({
      username: 'customuser',
      newsletter: false
    })
    
    // Act & Assert
    expect(customForm.username).toBe('customuser')
    expect(customForm.newsletter).toBe(false)
    expect(customForm.firstName).toBe('Juan') // Mantiene valor por defecto
  })

  it('should handle edge cases with invalid factory', () => {
    // Arrange
    const invalidForm = createInvalidRegisterForm()
    
    // Act & Assert
    expect(invalidForm.username).toBe('')
    expect(invalidForm.termsAccepted).toBe(false)
    expect(invalidForm.firstName).toBe('A')
  })
})
```

#### **4. Factories para Stores**

```typescript
// src/modules/auth/test/factories/store.factory.ts
import { createTestingPinia } from '@pinia/testing'
import type { RegisterForm } from '@/modules/auth/types/Auth.types'

export const createMockAuthStore = (overrides = {}) => {
  const pinia = createTestingPinia({
    initialState: {
      auth: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        ...overrides
      }
    },
    stubActions: false
  })
  
  return pinia
}

export const createMockRegisterFormState = (formData: Partial<RegisterForm> = {}) => ({
  form: createValidRegisterForm(formData),
  isLoading: false,
  currentStep: 1,
  totalSteps: 4
})
```

#### **5. Mejores Prácticas para Factories**

**SÍ hacer:**
- **Nombres descriptivos**: `createValidRegisterForm`, `createInvalidRegisterForm`
- **Overrides flexibles**: Permitir personalización para casos específicos
- **Valores realistas**: Usar datos que simulen el mundo real
- **Exportación centralizada**: `index.ts` para facilitar imports

**NO hacer:**
- Crear factories con datos hardcodeados sin overrides
- Usar factories para datos que cambian frecuentemente
- Crear factories demasiado específicas que no se reutilizan
- Mezclar lógica de negocio en las factories

**Patrón recomendado para factories complejas:**
```typescript
// Factory con múltiples variantes
export const createRegisterFormVariants = {
  empty: () => createMockRegisterForm(),
  valid: () => createValidRegisterForm(),
  invalid: () => createInvalidRegisterForm(),
  partial: () => createValidRegisterForm({
    username: 'partial',
    firstName: 'Partial',
    // Solo algunos campos llenos
  })
}
```

### Testing de Formularios

**¿Por qué testing específico para formularios?**
Los formularios complejos con múltiples secciones, validación y estado compartido requieren estrategias de testing especializadas. Nuestro enfoque se basa en la experiencia del formulario de registro y las mejores prácticas de [Filament](https://filamentphp.com/docs/2.x/admin/testing).

#### **1. Testing de Formularios con Secciones Separadas**

**Patrón recomendado**: Testing en capas - unitario para lógica, integración para flujo completo.

```typescript
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import RegisterFormStep from '@/modules/auth/views/RegisterFormStep/index.vue'

describe('Complex Form with Sections', () => {
  it('should render all form sections correctly', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar estructura del formulario
    expect(screen.getByTestId('form:main')).toBeInTheDocument()
    expect(screen.getByTestId('step:complete')).toBeInTheDocument()
    
    // Verificar secciones individuales
    expect(screen.getByTestId('section:basic')).toBeInTheDocument()
    expect(screen.getByTestId('section:residence')).toBeInTheDocument()
    expect(screen.getByTestId('section:contact')).toBeInTheDocument()
    expect(screen.getByTestId('section:preferences')).toBeInTheDocument()
  })

  it('should display form header with correct content', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar contenido del formulario
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear Cuenta')
    expect(screen.getByText('Completa los siguientes datos para crear tu cuenta')).toBeInTheDocument()
  })
})
```

#### **2. Mocks Avanzados para Element Plus**

**Patrón recomendado**: Mocks que simulan comportamiento real de formularios. Ejemplo para el uso de componentes como el del design system

```typescript
// src/modules/auth/test/setup.ts
vi.mock('element-plus', () => ({
  ElForm: {
    name: 'ElForm',
    template: `
      <form v-bind="$attrs" @submit.prevent="$emit('submit')">
        <slot />
      </form>
    `,
    props: ['model', 'rules'],
    emits: ['submit'],
    methods: {
      validate() {
        return Promise.resolve(true)
      },
      resetFields() {
        if (this.model) {
          Object.keys(this.model).forEach(key => {
            if (typeof this.model[key] === 'boolean') {
              this.model[key] = false
            } else {
              this.model[key] = ''
            }
          })
        }
        return Promise.resolve()
      }
    }
  },
  ElInput: {
    name: 'ElInput',
    template: `
      <div class="el-input" v-bind="$attrs">
        <input 
          class="el-input__inner" 
          type="text" 
          :placeholder="placeholder"
          :value="modelValue" 
          @input="handleInput"
        />
      </div>
    `,
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    methods: {
      handleInput(event) {
        this.$emit('update:modelValue', event.target.value)
      }
    }
  },
  ElButton: {
    name: 'ElButton',
    template: `
      <button 
        class="el-button" 
        :type="type" 
        :disabled="loading || disabled" 
        @click="handleClick" 
        v-bind="$attrs"
      >
        <slot />
      </button>
    `,
    props: ['type', 'loading', 'disabled'],
    emits: ['click'],
    methods: {
      handleClick(event) {
        if (!this.loading && !this.disabled) {
          this.$emit('click', event)
        }
      }
    }
  }
}))
```

#### **3. Testing de Validación de Formularios**

**Patrón recomendado**: Testing unitario de lógica de validación + testing de integración de UI.

```typescript
import { useRegisterFormStepValidation } from '@/modules/auth/composables/useRegisterFormStepValidation'
import { createValidRegisterForm, createInvalidRegisterForm } from '../factories/register.factory'

describe('Form Validation Testing', () => {
  it('should validate complete form successfully', () => {
    // Arrange
    const { result } = renderComposable(() => useRegisterFormStepValidation())
    const validForm = createValidRegisterForm()
    
    // Act
    const isValid = result.validateForm(validForm)
    
    // Assert
    expect(isValid).toBe(true)
  })

  it('should reject form with missing required fields', () => {
    // Arrange
    const { result } = renderComposable(() => useRegisterFormStepValidation())
    const invalidForm = createInvalidRegisterForm()
    
    // Act
    const isValid = result.validateForm(invalidForm)
    
    // Assert
    expect(isValid).toBe(false)
  })

  it('should provide validation rules for all form fields', () => {
    // Arrange
    const { result } = renderComposable(() => useRegisterFormStepValidation())
    
    // Act & Assert
    expect(result.validationRules).toBeDefined()
    expect(result.validationRules.username).toBeDefined()
    expect(result.validationRules.firstName).toBeDefined()
    expect(result.validationRules.country).toBeDefined()
    expect(result.validationRules.city).toBeDefined()
    expect(result.validationRules.emergencyContact).toBeDefined()
    expect(result.validationRules.emergencyPhone).toBeDefined()
    expect(result.validationRules.termsAccepted).toBeDefined()
  })
})
```

#### **4. Testing de Estado de Formularios**

**Patrón recomendado**: Testing de estado reactivo y cambios de UI.

```typescript
import { render, screen, waitFor } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import RegisterFormStep from '@/modules/auth/views/RegisterFormStep/index.vue'

describe('Form State Management', () => {
  it('should render form inputs with correct attributes', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar atributos de los inputs
    const firstNameInput = screen.getByTestId('input:first-name')
    expect(firstNameInput).toBeInTheDocument()
    expect(firstNameInput.getAttribute('data-test')).toBe('input:first-name')

    const usernameInput = screen.getByTestId('input:username')
    expect(usernameInput).toBeInTheDocument()
    expect(usernameInput.getAttribute('data-test')).toBe('input:username')

    const countrySelect = screen.getByTestId('select:country')
    expect(countrySelect).toBeInTheDocument()
    expect(countrySelect.getAttribute('data-test')).toBe('select:country')
  })

  it('should render form with proper accessibility attributes', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar accesibilidad básica
    const form = screen.getByTestId('form:main')
    expect(form).toBeInTheDocument()
    
    // Verificar que los inputs tienen placeholders
    const firstNameInput = screen.getByTestId('input:first-name')
    expect(firstNameInput).toHaveAttribute('placeholder')
    
    const usernameInput = screen.getByTestId('input:username')
    expect(usernameInput).toHaveAttribute('placeholder')
  })
})
```

#### **5. Testing de Integración de Formularios**

**Patrón recomendado**: Testing del flujo completo usando mocks simplificados.

```typescript
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'

// Mock simplificado del componente para testing de integración
const RegisterFormStep = {
  name: 'RegisterFormStep',
  template: `
    <div data-test="view:register-form-step">
      <h1>Crear Cuenta</h1>
      <p>Completa los siguientes datos para crear tu cuenta</p>
      
      <el-form data-test="form:main">
        <div data-test="step:complete">
          <div data-test="section:basic">
            <el-input data-test="input:first-name" placeholder="Nombre" />
            <el-input data-test="input:username" placeholder="Usuario" />
          </div>
          
          <div data-test="section:residence">
            <el-select data-test="select:country" placeholder="Selecciona tu país">
              <el-option label="Colombia" value="colombia" />
              <el-option label="México" value="mexico" />
              <el-option label="Argentina" value="argentina" />
            </el-select>
            <el-input data-test="input:city" placeholder="Ciudad" />
          </div>
          
          <div data-test="section:contact">
            <el-input data-test="input:emergency-contact" placeholder="Contacto de emergencia" />
            <el-input data-test="input:emergency-phone" placeholder="Teléfono de emergencia" />
          </div>
          
          <div data-test="section:preferences">
            <el-switch data-test="switch:newsletter" />
            <el-switch data-test="switch:marketing" />
            <el-checkbox data-test="checkbox:terms">Acepto los términos</el-checkbox>
          </div>
        </div>
        
        <el-button data-test="button:submit" type="success">Crear Cuenta</el-button>
      </el-form>
    </div>
  `
}

describe('Form Integration Testing', () => {
  it('should render form with correct Element Plus components', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar que se usan los mocks de Element Plus
    const form = screen.getByTestId('form:main')
    expect(form.tagName.toLowerCase()).toBe('el-form')
    expect(form).toHaveAttribute('data-test', 'form:main')

    const submitButton = screen.getByTestId('button:submit')
    expect(submitButton.tagName.toLowerCase()).toBe('el-button')
    expect(submitButton).toHaveAttribute('type', 'success')
  })

  it('should render country options in select', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar que las opciones del país están presentes como mocks
    const select = screen.getByTestId('select:country')
    expect(select.tagName.toLowerCase()).toBe('el-select')
    
    // Buscar los el-option dentro del select
    const options = select.querySelectorAll('el-option')
    expect(options.length).toBe(3)
    expect(options[0].getAttribute('label')).toBe('Colombia')
    expect(options[0].getAttribute('value')).toBe('colombia')
    expect(options[1].getAttribute('label')).toBe('México')
    expect(options[1].getAttribute('value')).toBe('mexico')
    expect(options[2].getAttribute('label')).toBe('Argentina')
    expect(options[2].getAttribute('value')).toBe('argentina')
  })
})
```

#### **6. Mejores Prácticas para Testing de Formularios**

**SÍ hacer:**
- **Testing en capas**: Unitario para lógica, integración para UI
- **Mocks avanzados**: Simular comportamiento real de componentes
- **Validación separada**: Testing unitario de reglas de validación
- **Factories**: Usar datos consistentes y reutilizables

**NO hacer:**
- Testing de detalles internos de implementación
- Mockear validación en tests de integración
- Ignorar accesibilidad en tests de formularios
- Crear tests frágiles que dependen de estructura específica

### userEvent: Enfoque Principal del Proyecto

#### **¿Por qué recomendamos userEvent?**

**Este proyecto usa `userEvent` como enfoque principal** para simular interacciones reales del usuario. Esta decisión está basada en los principios de testing centrado en el usuario y las mejores prácticas de Testing Library.

```typescript
import userEvent from '@testing-library/user-event'

it('should handle user interaction', async () => {
  const user = userEvent.setup()
  
  // Simula interacción real del usuario
  await user.click(screen.getByRole('button'))
  await user.type(screen.getByRole('textbox'), 'test')
  
  // Más realista, simula el flujo completo
})
```

#### **Beneficios de userEvent**  
- Simula el flujo completo de interacción del usuario
- Incluye eventos de focus, blur, hover y navegación por teclado
- Detecta problemas de UX que otros enfoques podrían pasar por alto
- Reduce falsos positivos y negativos en los tests
- Identifica eventos que faltan o están mal configurados
- Detecta problemas de focus y navegación

#### **Sobre fireEvent**

`fireEvent` es una alternativa más directa que simula eventos DOM específicos:

```typescript
import { fireEvent } from '@testing-library/vue'

it('should handle DOM events', async () => {
  // Simula eventos DOM directos
  fireEvent.click(screen.getByRole('button'))
  fireEvent.input(screen.getByRole('textbox'), { target: { value: 'test' } })
})
```

**Beneficios de fireEvent:**
- Más rápido, Menos overhead de procesamiento
- Más directo, Control preciso sobre eventos específicos

**¿Por qué no lo usamos como enfoque principal?**
- **Menos realista**: No simula el flujo completo de interacción
- **Limitado para accesibilidad**: No incluye navegación por teclado
- **Puede ocultar problemas**: No detecta eventos faltantes o mal configurados
- **Menos alineado con testing centrado en usuario**: Se enfoca en eventos DOM en lugar de comportamiento observable

### Testing de Stores Pinia (analizar)

**El proyecto utiliza dos enfoques principales para testing con Pinia**, según el tipo de test y el nivel de control necesario.

#### **1. Enfoque con createTestingPinia**

**Cuándo usar**: Para **testing de componentes (.vue)** que necesitan control total sobre el estado inicial y comportamiento de los stores.

```typescript
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
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
          createTestingPinia({
            // Estado inicial controlado
            initialState: {
              auth: { isAuthenticated: true },
              anime: { favorites: [] }
            },
            // Permite que las acciones se ejecuten realmente
            stubActions: false
          })
        ]
      }
    })
    
    // Assert
    expect(screen.getByTestId('button:toggle-favorite')).toBeInTheDocument()
    expect(screen.queryByTestId('button:login-required')).not.toBeInTheDocument()
  })

  it('should show login button when user is not authenticated', () => {
    // Arrange
    const anime = createMockAnime()
    
    // Act
    render(AnimeCard, {
      props: { anime },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { isAuthenticated: false },
              anime: { favorites: [] }
            }
          })
        ]
      }
    })
    
    // Assert
    expect(screen.getByTestId('button:login-required')).toBeInTheDocument()
    expect(screen.queryByTestId('button:toggle-favorite')).not.toBeInTheDocument()
  })
})
```

#### **2. Enfoque con Pinia Real + Spy**

**Cuándo usar**: Para **testing unitario de composables (.ts)** o cuando necesitas verificar el comportamiento real de getters computados.

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAnimeStore } from '@/modules/anime/stores/anime.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { render, screen } from '@testing-library/vue'
import AnimeCard from '@/modules/anime/components/AnimeCard'
import { createMockAnime } from '../factories/anime.factory'

describe('useAnimeCard composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should handle favorite toggle when user is authenticated', () => {
    // Arrange
    const anime = createMockAnime()
    const animeStore = useAnimeStore()
    const authStore = useAuthStore()
    
    // Mockear getters readonly usando spy
    vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
    
    // Configurar estado inicial
    animeStore.favorites = []
    
    // Act
    const composable = useAnimeCard(anime)
    composable.toggleFavorite()
    
    // Assert
    expect(animeStore.favorites).toContain(anime)
    expect(composable.isFavorite.value).toBe(true)
  })
})
```

#### **6. Getters Readonly y Spying**

**Problema común**: Los getters computados en Pinia son readonly por naturaleza.

```typescript
// En el store (readonly)
const isAuthenticated = computed(() => !!user.value)

// En el test - CORRECTO para getters readonly
vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)

// En el test - INCORRECTO (no funciona con getters)
authStore.isAuthenticated = true // Error: Cannot assign to read only property
```

**¿Cuándo usar spy?**
- Getters computados que dependen de estado complejo
- Propiedades que no puedes modificar directamente
- Testing de comportamiento condicional basado en getters

#### **7. Mejores Prácticas**

**SÍ hacer:**
- **Componentes**: Usar `createTestingPinia` para control total del estado
- **Composables**: Usar Pinia real + spy para testing unitario
- **Getters readonly**: Mockear con `vi.spyOn(store, 'getter', 'get')`
- **Cleanup**: Limpiar mocks con `vi.clearAllMocks()` en `beforeEach`

**NO hacer:**
- Mezclar `createTestingPinia` y Pinia real en el mismo test
- Testear detalles internos del store (estado privado)
- Crear datos mock inline repetidamente
- Olvidar `stubActions: false` cuando necesites acciones reales
- Intentar asignar valores a getters computados directamente


## Métricas de Cobertura

**¿Qué es Coverage?**
El coverage mide qué porcentaje del código está siendo ejecutado por los tests. Es una métrica que ayuda a identificar código no probado, pero no garantiza calidad.

**Importante:** En proyectos en migración, es normal tener coverage bajo inicialmente. Los siguientes porcentajes son **metas a alcanzar gradualmente**.

#### **Objetivos**

* Stores: 80-90% (Lógica de negocio crítica)
* Composables: 70-80% (Lógica de UI y transformaciones)
* Utils: 80-90% (Funciones puras y transformaciones)
* Components: 50-70% (Interacciones de usuario y lógica de template)
* Services: 30-50% (Solo casos edge y validaciones específicas)

#### **Criterios de Exclusión**

**Lo que NO contar en coverage:**
- **Archivos de configuración**: `vite.config.ts`, `vitest.config.ts`
- **Archivos de tipos**: `*.d.ts`, `types.ts` (solo definiciones)
- **Setup de tests**: `test/setup.ts`, `test/utils/*`
- **Factories de testing**: `test/factories/*`
- **Mocks y stubs**: Archivos que solo contienen mocks
- **Componentes de presentación**: Solo template sin lógica no reciben ni props (solo muestran datos)

#### **Métricas de Calidad vs Cantidad**

**Importante:** Es mejor tener 70% de coverage en código que realmente importa, que 90% incluyendo código trivial.

**Priorizar testing de:**
1. **Lógica de negocio crítica** (stores, utils complejas)
2. **Composables con transformaciones** (filtros, cálculos)
3. **Componentes con interacciones complejas** (formularios, validaciones)
4. **Casos edge en servicios** (validaciones, errores específicos)

**No priorizar testing de:**
1. **Componentes de presentación** (solo muestran datos)
2. **Getters simples** (solo retornan estado)
3. **Métodos triviales** (solo asignan valores)
4. **Configuración y setup** (no lógica de negocio)

### Comandos y Scripts de Testing
Los comandos de testing están organizados para facilitar diferentes escenarios de desarrollo.

**Comandos básicos**
```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests con coverage
yarn test --coverage

# Ejecutar tests en modo watch
yarn test --watch

# Ejecutar tests con UI
yarn test --ui (revisar)

# Ejecutar tests en modo verbose
yarn test --reporter=verbose
```

**Comandos específicos por módulo**
```bash
# Testear solo un módulo específico
yarn test src/modules/anime/test/

# Testear solo lógica de un componente
yarn test src/modules/anime/test/components/AnimeCard/useAnimeCard.spec.ts

# Testear solo template de un componente
yarn test src/modules/anime/test/components/AnimeCard/index.spec.ts

# Testear solo stores
yarn test src/modules/anime/test/stores/

# Testear solo servicios
yarn test src/modules/anime/test/services/
```

**Scripts de package.json**
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:anime": "vitest src/modules/anime/test/",
    "test:auth": "vitest src/modules/auth/test/",
    "test:shared": "vitest src/shared/test/",
    "test:unit": "vitest --run src/**/*.spec.ts",
    "test:components": "vitest --run src/**/index.spec.ts"
  }
}
```

## Herramientas y Configuración

Esta sección describe las herramientas principales que utilizamos para testing, cómo configurarlas correctamente y las utilidades globales que facilitan el desarrollo de tests efectivos.

### Stack de Testing

Nuestro stack de testing está diseñado para proporcionar una experiencia de desarrollo eficiente y confiable:

**Framework principal**: Vitest
- **Velocidad**: Ejecución rápida con hot reload
- **Compatibilidad**: Soporte nativo para Vue 3 y TypeScript
- **Coverage**: Integración con @vitest/coverage-v8
- **UI**: Interfaz visual para debugging de tests

**Testing de componentes**: Vue Testing Library
- **Enfoque centrado en el usuario**: Simula interacciones reales
- **Accesibilidad**: Promueve el uso de selectores accesibles
- **API intuitiva**: Sintaxis clara y fácil de aprender

**State Management**: @pinia/testing
- **Testing de stores**: Herramientas específicas para Pinia
- **Mocks automáticos**: Configuración simplificada de stores
- **Integración**: Funciona perfectamente con Vue Testing Library

### Configuración Global (analizar)

La configuración global establece el entorno base para todos los tests del proyecto.

**Configuración de Vitest (vitest.config.ts)**
```typescript
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      reporters: [['verbose', { summary: true }]],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/coverage/**',
          'dist/',
          'build/',
          'public/'
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
          }
        }
      },
      deps: {
        optimizer: {
          web: {
            enabled: true,
            include: ['@grpc/proto-loader', '@fdograph/rut-utilities'],
          },
        },
      },
    }
  })
)
```

**¿Por qué esta configuración es la mejor práctica?**

Esta configuración utiliza `mergeConfig` para combinar la configuración de Vite con Vitest, ofreciendo:

**Ventajas principales**
- **Consistencia**: Reutiliza configuración de Vite (alias, plugins, resolvers)
- **Mantenimiento**: Evita duplicación entre Vite y Vitest
- **Optimización**: Incluye optimizaciones específicas para dependencias del proyecto
- **Escalabilidad**: Configuración robusta para proyectos complejos

**Setup Global (test/setup.ts)**
```typescript
import { vi, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import type { ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import '@testing-library/jest-dom'

vi.mock('element-plus')

// Configuración de Pinia para tests
const pinia = createTestingPinia({ 
  createSpy: vi.fn,
  stubActions: false // Permite que las acciones se ejecuten realmente
})
```

### Utilidades Globales de Testing (analizar)

Las utilidades globales proporcionan funciones reutilizables que simplifican la escritura de tests y mantienen consistencia en todo el proyecto.

**Utilidades para Testing de Composables (test/utils/withSetup.ts)**

Basándonos en las mejores prácticas de [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/) y [Dylan Britz](https://dev.to/britzdm/mastering-vue-3-composables-testing-with-vitest-1bk3), hemos creado utilidades específicas para diferentes tipos de composables:

```typescript
import { withSetup, withInjectedSetup, withPlugins, withAsyncSetup } from '@/test/setup'

// 1. Composable con lifecycle hooks
const { result, app } = withSetup(() => useMyComposable())
expect(result.isReady.value).toBe(true)
app.unmount() // Importante: siempre hacer cleanup

// 2. Composable con inyección de dependencias
const { result, app } = withInjectedSetup(
  () => useMyComposable(),
  { 'my-key': 'my-value' }
)

// 3. Composable con plugins (Pinia, Router)
const { result, app } = withPlugins(
  () => useMyStore(),
  [createTestingPinia()]
)

// 4. Composable con async operations
const { result, app, waitFor } = withAsyncSetup(() => useAsyncComposable())
await waitFor(() => expect(result.data.value).toBeDefined())
app.unmount()
```

**¿Cuándo usar cada utilidad?**

| Tipo de Composable | Utilidad | Cuándo usar |
|-------------------|----------|-------------|
| Solo reactividad | `renderComposable` | Composables simples sin lifecycle |
| Con lifecycle hooks | `withSetup` | Composables con `onMounted`, `onUnmounted` |
| Con provide/inject | `withInjectedSetup` | Composables que usan inyección |
| Con plugins | `withPlugins` | Composables que usan Pinia, Router |
| Con async operations | `withAsyncSetup` | Composables con operaciones asíncronas |

**Mejores prácticas:**
- **Siempre hacer cleanup**: Llamar `app.unmount()` o `unmount()`
- **Testear comportamiento observable**: No detalles de implementación
- **Usar la utilidad más simple**: No usar `withSetup` si no es necesario
- **Importar desde setup global**: `import { withSetup } from '@/test/setup'`

**Utilidad para testing de formularios (test/utils/formTesting.ts)**
```typescript
import { fireEvent, waitFor } from '@testing-library/vue'
import type { Component } from 'vue'

/**
 * Utilidad para simular llenado de formularios
 */
export async function fillForm(
  wrapper: any,
  formData: Record<string, string | boolean>
) {
  for (const [field, value] of Object.entries(formData)) {
    const element = wrapper.find(`[data-test="${field}"]`)
    
    if (element.exists()) {
      if (typeof value === 'boolean') {
        await element.setChecked(value)
      } else {
        await element.setValue(value)
      }
    }
  }
}

/**
 * Utilidad para validar errores de formulario
 */
export async function expectFormErrors(
  wrapper: any,
  expectedErrors: string[]
) {
  await waitFor(() => {
    expectedErrors.forEach(error => {
      expect(wrapper.text()).toContain(error)
    })
  })
}
```

**Utilidades Globales de Testing (test/setup.ts)**

Nuestro setup global incluye utilidades reutilizables que simplifican la escritura de tests:

**Helper para testing de navegación:**
```typescript
// Crear mock de router personalizado
const mockRouter = createMockRouter({
  currentRoute: {
    value: {
      path: '/anime/1',
      params: { id: '1' }
    }
  }
})

// Verificar navegación
expectNavigation(mockRouter, '/anime/2')
```

**Helper para testing de formularios con Vue Testing Library:**
```typescript
// Llenar formulario automáticamente
await fillForm({
  'email': 'test@example.com',
  'password': 'password123',
  'terms': true
})

// Validar errores de formulario
await expectFormErrors([
  'El email es requerido',
  'La contraseña debe tener al menos 8 caracteres'
])
```

**Helper para testing de navegación con Vue Testing Library:**
```typescript
// Simular navegación de usuario
const user = userEvent.setup()
await user.click(screen.getByRole('link', { name: /anime detail/i }))

// Verificar que la navegación ocurrió
expect(router.currentRoute.value.path).toBe('/anime/1')
```

**Helper para limpiar mocks:**
```typescript
// Limpiar todos los mocks entre tests
beforeEach(() => {
  clearMocks()
})
```

**Utilidad para testing de navegación (test/utils/navigationTesting.ts)**
```typescript
import { vi } from 'vitest'

/**
 * Mock de router para testing de navegación
 */
export const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      params: {},
      query: {},
      hash: ''
    }
  }
})

/**
 * Utilidad para verificar navegación
 */
export function expectNavigation(
  routerMock: any,
  expectedPath: string,
  expectedOptions?: any
) {
  expect(routerMock.push).toHaveBeenCalledWith(
    expectedPath,
    expectedOptions
  )
}
```

### Configuración por Módulo (analizar)

Cada módulo puede tener su propia configuración específica para tests.

**Setup por módulo (src/modules/anime/test/setup.ts)**
```typescript
import { vi } from 'vitest'
import { animeApi } from '@/modules/anime/services/anime.services'

// Mocks específicos del módulo anime
vi.mock('@/modules/anime/services/anime.services', () => ({
  animeApi: {
    getAnimeList: vi.fn(),
    getAnimeById: vi.fn(),
    getAnimeCharacters: vi.fn(),
    searchAnime: vi.fn()
  }
}))

// Factories específicas del módulo
export { createMockAnime, createMockAnimeList } from './factories/anime.factory'
export { createMockAnimeStore } from './factories/store.factory'

// Utilidades específicas del módulo
export const mockAnimeApi = vi.mocked(animeApi)
```

**Configuración de coverage por módulo**
```typescript
// vitest.config.ts - Configuración específica por módulo
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        // Coverage global
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Coverage específico por módulo
        'src/modules/anime/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        'src/modules/auth/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
})
```

## Checklist de Calidad (analizar)

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

## Anti-Patrones a Evitar (analizar - crear)

## Recursos y Referencias

### **Artículos Fundamentales**
- [Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests) - Kent C. Dodds
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) - Kent C. Dodds
- [The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy) - Kent C. Dodds

### **Documentación Oficial**
- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing) - Guía oficial de testing en Vue
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/) - Herramienta recomendada para component testing
- [User Event Documentation](https://testing-library.com/docs/user-event/v13/) - Documentación oficial de user-event
- [User Event GitHub Repository](https://github.com/testing-library/user-event) - Repositorio oficial con ejemplos y issues

### **Vue 3 Testing Específico**
- [Vue Testing Guide](https://vuejs.org/guide/scaling-up/testing) - Documentación oficial de Vue
- [Testing Vue Components with Vitest](https://dev.to/jacobandrewsky/testing-vue-components-with-vitest-5c21) - Jacob Andrewsky
- [Testing Vue Composables Lifecycle](https://dylanbritz.dev/writing/testing-vue-composables-lifecycle/) - Dylan Britz
- [Good Practices for Vue Composables](https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk) - Jacob Andrewsky
- [How to Test Vue Composables](https://alexop.dev/posts/how-to-test-vue-composables/) - Alex Op
- [How to Write Clean Vue Components](https://alexop.dev/posts/how-to-write-clean-vue-components/) - Alex Op
- [Vue Test Utils Advanced Guide](https://test-utils.vuejs.org/guide/advanced/reusability-composition) - Documentación oficial

### **Vue Router Testing**
- [Vue Test Utils - Using with Vue Router](https://v1.test-utils.vuejs.org/guides/using-with-vue-router.html) - Documentación oficial
- [Vue Testing Library - Vue Router Example](https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/vue-router.js) - Ejemplo oficial de Vue Testing Library
- [Vue Testing Handbook - Vue Router](https://lmiller1990.github.io/vue-testing-handbook/vue-router.html) - Guía completa de testing de router
- [Focused.io - Vue Router Testing Strategies](https://focused.io/lab/vue-router-testing-strategies) - Estrategias avanzadas de testing
- [Unit Testing Vue Router](https://medium.com/js-dojo/unit-testing-vue-router-1d091241312) - Mejores prácticas específicas

### **Mejores Prácticas de Testing**
- [How I Started Writing Unit Tests for Vue Components](https://www.byteminds.co.uk/blog/how-i-started-writing-unit-tests-for-vue-components) - Byteminds
- [Vue.js Testing with Vue Test Utils and Vitest](https://vueschool.io/articles/vuejs-tutorials/vue-js-testing-with-vue-test-utils-and-vitest/) - Vue School
- [Realiza Pruebas Unitarias con Vitest y Vue Test Utils](https://codingpr.com/es/realiza-pruebas-unitarias-con-vitest-y-vue-test-utils/) - CodingPR

---

**Nota sobre las referencias**: Esta documentación está basada en las mejores prácticas establecidas por la comunidad Vue y los principios de testing moderno. Todas las referencias han sido seleccionadas por su relevancia y autoridad en el tema. La frase clave "Si un usuario no puede hacerlo, tu prueba tampoco debería poder hacerlo" es fundamental para entender el enfoque de testing centrado en el usuario.

