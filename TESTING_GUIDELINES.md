# Guía de Testing

**Última actualización**: Julio 10 2025  
**Autor actualización**: Anderson Mesa  
**Autor**: Andersson Mesa  
**Responsable**: Equipo de Desarrollo  
**Versión**: 1.0.0 

## Índice

- [Introducción](#introducción)
- [Enfoque: Dos Tipos de Usuarios](#enfoque-dos-tipos-de-usuarios)
- [Patrones y Mejores Prácticas](#patrones-y-mejores-prácticas)
- [Herramientas y Configuración](#herramientas-y-configuración)
- [Checklist de Calidad](#checklist-de-calidad)
- [Recursos y Referencias](#recursos-y-referencias)

---

## Introducción

Esta guía reúne las mejores prácticas, patrones y ejemplos para escribir tests efectivos y mantenibles en este proyecto. Su objetivo es facilitar la incorporación de nuevos desarrolladores, estandarizar la calidad de las pruebas y asegurar que el código sea confiable y fácil de evolucionar. Está inspirada en los principios de la comunidad Vue y en referentes como Kent C. Dodds, priorizando la experiencia del usuario final y la robustez de la lógica de negocio.

¿A quién está dirigida esta guía?
- A cualquier desarrollador que trabaje en el proyecto, sin importar su nivel de experiencia.
- A quienes deseen entender el porqué de las decisiones de testing y cómo aplicarlas en la práctica.


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
- **DOM mínimo**: Usan jsdom para reactividad de Vue y APIs del navegador, pero no renderizan templates completos
- **Aisladas**: Sin dependencias externas o efectos secundarios
- **Rápidas**: < 1ms por test (funciones puras) o < 10ms (composables)
- **Determinísticas**: Mismo input siempre produce el mismo output

Ejemplo práctico:
```typescript
// Test unitario - Prueba lógica pura de composable
it('should compute anime subtitle correctly', () => {
  const props = { anime: createMockAnime({ type: 'TV', status: 'Airing' }) }
  const emit = vi.fn()
  
  const { result, app } = withSetup(() => useAnimeCard(props, emit))
  
  expect(result.animeSubtitle.value).toBe('TV • Airing')
  app.unmount()
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
Al usar selectores como `getByLabelText()`, los tests de componentes promueven y validan la accesibilidad de la aplicación.

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
- Simular errores de cuota excedida
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
import userEvent from '@testing-library/user-event'

// Helper simplificado para crear router de test
const createTestRouter = (routes = []) => {
  const defaultRoutes = [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } }
  ]
  
  return createRouter({
    history: createWebHistory(),
    routes: [...defaultRoutes, ...routes]
  })
}

describe('NavigationMenu', () => {
  it('should navigate using router links', async () => {
    const router = createTestRouter([
      { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
      { path: '/settings', component: { template: '<div>Settings</div>' } },
      { path: '/profile', component: { template: '<div>Profile</div>' } }
    ])

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
import userEvent from '@testing-library/user-event'

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
import userEvent from '@testing-library/user-event'
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
import { createTestRouter, routerFactories } from '@/test/setup'
import type { RenderOptions } from '@testing-library/vue'

interface RenderWithRouterOptions extends Omit<RenderOptions<any>, 'global'> {
  initialRoute?: string
  routeType?: keyof typeof routerFactories
  customRoutes?: Array<{ path: string; component: { template: string } }>
}

export function renderWithRouter(Component: any, options: RenderWithRouterOptions = {}) {
  const { 
    initialRoute = '/', 
    routeType = 'basic',
    customRoutes,
    ...renderOptions 
  } = options

  // Usar rutas personalizadas o factory de rutas
  const routes = customRoutes || routerFactories[routeType]()
  const router = createTestRouter(routes)

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

**Uso del helper mejorado:**
```typescript
describe('NavigationMenu', () => {
  it('should navigate using router links', async () => {
    // Usar factory de rutas específicas para anime
    const { router } = renderWithRouter(NavigationMenu, {
      initialRoute: '/',
      routeType: 'anime' // Usar rutas específicas de anime
    })

    await router.isReady()
    const user = userEvent.setup()
    
    await user.click(screen.getByText('Dashboard'))
    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('should test with custom routes', async () => {
    // Usar rutas personalizadas para casos específicos
    const customRoutes = [
      { path: '/custom', component: { template: '<div>Custom Page</div>' } }
    ]
    
    const { router } = renderWithRouter(NavigationMenu, {
      initialRoute: '/custom',
      customRoutes
    })

    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/custom')
  })
})
```

**Patrón 6: Factory de rutas para testing específico**
```typescript
// test/factories/router.factory.ts
import type { RouteRecordRaw } from 'vue-router'

export const createRouterFactory = {
  // Factory para rutas de anime
  anime: (): RouteRecordRaw[] => [
    { 
      path: '/anime', 
      name: 'AnimeList',
      component: { template: '<div>Anime List</div>' } 
    },
    { 
      path: '/anime/:id', 
      name: 'AnimeDetail',
      component: { template: '<div>Anime Detail: {{ $route.params.id }}</div>' },
      props: true
    },
    { 
      path: '/favorites', 
      name: 'Favorites',
      component: { template: '<div>Favorites</div>' } 
    }
  ],

  // Factory para rutas de autenticación
  auth: (): RouteRecordRaw[] => [
    { 
      path: '/login', 
      name: 'Login',
      component: { template: '<div>Login</div>' } 
    },
    { 
      path: '/register', 
      name: 'Register',
      component: { template: '<div>Register</div>' } 
    },
    { 
      path: '/protected', 
      name: 'Protected',
      component: { template: '<div>Protected</div>' },
      meta: { requiresAuth: true }
    }
  ],

  // Factory para rutas de formularios
  forms: (): RouteRecordRaw[] => [
    { 
      path: '/form', 
      name: 'Form',
      component: { template: '<div>Form</div>' } 
    },
    { 
      path: '/form/success', 
      name: 'FormSuccess',
      component: { template: '<div>Success</div>' } 
    },
    { 
      path: '/form/error', 
      name: 'FormError',
      component: { template: '<div>Error</div>' } 
    }
  ]
}
```

**¿Por qué usar factories de rutas en lugar de rutas hardcodeadas?**

**Problemas de rutas hardcodeadas:**
1. **Falta de flexibilidad** - Cada test no puede definir sus propias rutas
2. **Acoplamiento** - Tests dependen de rutas globales que pueden cambiar
3. **Mantenimiento** - Cambios en rutas requieren modificar helpers globales
4. **Testing específico** - No permite testing de rutas específicas del dominio

**Ventajas de factories de rutas:**
1. **Flexibilidad** - Cada test puede usar rutas específicas para su dominio
2. **Desacoplamiento** - Tests no dependen de rutas globales
3. **Mantenibilidad** - Cambios en rutas no afectan otros tests
4. **Testing específico** - Permite testing de rutas específicas del dominio
5. **Reutilización** - Factories pueden ser compartidas entre tests similares

#### **1. Estructura de Factories Organizada**

**Estructura recomendada (simplificada):**
```
test/
├── factories/
│   ├── index.ts              # Exporta todas las factories
│   ├── router.factory.ts     # Factories de rutas (simplificadas)
│   ├── store.factory.ts      # Factories de stores
│   └── user.factory.ts       # Factories de usuarios
├── utils/
│   └── withSetup.ts          # Utilidades de testing
└── setup.ts                  # Setup global
```

**Ventajas de esta estructura:**
- **Separación clara**: Cada tipo de factory en su propio archivo
- **Fácil mantenimiento**: Cambios centralizados por tipo
- **Escalabilidad**: Fácil agregar nuevas factories
- **Importación limpia**: `import { createRouterFactory } from '@/test/factories'`

**Uso de la nueva estructura funcional:**
```typescript
// Importar desde la ubicación centralizada
import { 
  routerFactories, 
  createAnimeRouterFactory, 
  createCompositeRouterFactory,
  withBasePath,
  withMeta 
} from '@/test/factories'

describe('Component with Router', () => {
  it('should work with anime routes', async () => {
    const router = createTestRouter(routerFactories.anime())
    // Test implementation
  })

  it('should work with auth routes', async () => {
    const router = createTestRouter(routerFactories.auth())
    // Test implementation
  })

  it('should work with extended anime routes', async () => {
    const animeFactory = createAnimeRouterFactory()
      .addAnimeRoutes() // Agregar rutas adicionales
      .addRoute({
        path: '/anime/custom',
        name: 'CustomAnime',
        component: { template: '<div>Custom Anime Page</div>' }
      })
    
    const router = createTestRouter(animeFactory.build())
    // Test implementation
  })

  it('should work with functional mixins', async () => {
    const animeFactory = createAnimeRouterFactory()
    
    const enhancedFactory = withBasePath('/app')(
      withMeta({ requiresAuth: true })(animeFactory)
    )
    
    const router = createTestRouter(enhancedFactory.build())
    // Test implementation
  })

  it('should work with composite routes', async () => {
    const animeFactory = createAnimeRouterFactory()
    const authFactory = createAuthRouterFactory()
    
    const compositeFactory = createCompositeRouterFactory([animeFactory, authFactory])
      .addRoute({
        path: '/dashboard',
        name: 'Dashboard',
        component: { template: '<div>Dashboard</div>' }
      })
    
    const router = createTestRouter(compositeFactory.build())
    // Test implementation
  })
})
```



#### **3. Mejores Prácticas para Factories de Rutas**

**Mejores prácticas:**

**SÍ hacer:**
- **Usar factories específicas por dominio** - `anime`, `auth`, `forms`
- **Definir rutas con nombres descriptivos** - `AnimeList`, `AnimeDetail`
- **Incluir meta información cuando sea necesario** - `meta: { requiresAuth: true }`
- **Usar props automáticas para rutas dinámicas** - `props: true`
- **Crear factories reutilizables** - Para tests similares

**NO hacer:**
- **Hardcodear rutas en helpers globales** - Reduce flexibilidad
- **Usar rutas reales de producción** - Tests deben ser independientes
- **Crear factories demasiado específicas** - Que no se reutilicen
- **Mezclar lógica de negocio en factories** - Solo definición de rutas

**Patrón recomendado para factories simplificadas:**
```typescript
// test/factories/router.factory.ts
import type { RouteRecordRaw } from 'vue-router'

interface RouteFactoryOptions {
  includeAuth?: boolean
  includeForms?: boolean
  customRoutes?: RouteRecordRaw[]
}

export const createRouterFactory = {
  // Factory básica con opciones
  basic: (options: RouteFactoryOptions = {}): RouteRecordRaw[] => {
    const routes: RouteRecordRaw[] = [
      { path: '/', name: 'Home', component: { template: '<div>Home</div>' } }
    ]

    if (options.includeAuth) {
      routes.push(
        { path: '/login', name: 'Login', component: { template: '<div>Login</div>' } },
        { path: '/register', name: 'Register', component: { template: '<div>Register</div>' } }
      )
    }

    if (options.includeForms) {
      routes.push(
        { path: '/form', name: 'Form', component: { template: '<div>Form</div>' } }
      )
    }

    if (options.customRoutes) {
      routes.push(...options.customRoutes)
    }

    return routes
  },

  // Factory específica para testing de guards
  withGuards: (): RouteRecordRaw[] => [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
    { 
      path: '/protected', 
      name: 'Protected',
      component: { template: '<div>Protected</div>' },
      meta: { requiresAuth: true }
    },
    { path: '/login', name: 'Login', component: { template: '<div>Login</div>' } }
  ]
}

// Helper simplificado para crear router de test
export const createTestRouter = (routes: RouteRecordRaw[] = []) => {
  const defaultRoutes = [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } }
  ]
  
  return {
    routes: [...defaultRoutes, ...routes],
    // Métodos básicos para testing
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: { value: { path: '/', params: {} } }
  }
}
```

**Uso de factories con opciones:**
```typescript
describe('Component with Router', () => {
  it('should work with basic routes', async () => {
    const router = createTestRouter(createRouterFactory.basic())
    // Test implementation
  })

  it('should work with auth routes', async () => {
    const router = createTestRouter(createRouterFactory.basic({ 
      includeAuth: true 
    }))
    // Test implementation
  })

  it('should work with custom routes', async () => {
    const customRoutes = [
      { path: '/custom', name: 'Custom', component: { template: '<div>Custom</div>' } }
    ]
    
    const router = createTestRouter(createRouterFactory.basic({ 
      customRoutes 
    }))
    // Test implementation
  })
})
```

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
    const mockResponse = right({ data: [] })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
    
    // Act
    await store.loadAnimeList()
    
    // Assert
    expect(store.isLoading).toBe(false)
    expect(store.animeList).toHaveLength(0)
  })

  it('should show loading state while fetching data', async () => {
    // Arrange
    const mockResponse = right({ data: [] })
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
    const mockError = left({ message: 'Network Error' })
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
  
  if (errorResult.isLeft()) {
    expect(errorResult.value.message).toBe('API Error')
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
    const { result, app } = withSetup(() => useAnimeList())
    await result.loadAnimeList()
    
    expect(result.animes.value).toHaveLength(1)
    app.unmount()
    expect(result.error.value).toBeNull()
    
    // Act & Assert - Failure case
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(failureResponse)
    await result.loadAnimeList()
    
    expect(result.error.value).toBe('Error en el módulo de anime')
    expect(result.animes.value).toHaveLength(0)
  })
})
```


### Testing de Inject/provide

**¿Cuándo usar provide/inject en testing?**
El patrón provide/inject es común en formularios complejos donde múltiples componentes necesitan compartir estado. Nuestro enfoque de testing se adapta según el tipo de test y el nivel de integración necesario.

#### **1. Testing de Composables con Provide/Inject**

**Patrón recomendado**: Usar `withSetup` para testing unitario de composables que usan provide/inject, ya que es la forma estándar de testear composables con contexto de Vue.

```typescript
import { withSetup } from '@/test/utils/withSetup'
import { useRegisterFormProvider } from '@/modules/auth/composables/useRegisterFormProvider'
import { useRegisterFormStepValidation } from '@/modules/auth/composables/useRegisterFormStepValidation'

describe('Register Form Provider/Inject Pattern', () => {
  it('should provide form data to child composables', () => {
    // Arrange
    const emit = vi.fn()
    
    // Act - Provider setup dentro del mismo contexto
    const { result, app } = withSetup(() => {
      const provider = useRegisterFormProvider(emit)
      const validation = useRegisterFormStepValidation() // Usa el contexto del provider
      
      return { provider, validation }
    })
    
    // Assert - Verificar que el provider funciona
    expect(result.provider.provide).toBeDefined()
    expect(result.provider.form).toBeDefined()
    expect(result.provider.form.username).toBe('')
    expect(result.validation.form).toBeDefined() // Debe acceder al mismo formulario
    
    // Cleanup
    app.unmount()
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
    expect(screen.getByTestId('basic-section')).toBeInTheDocument()
    expect(screen.getByTestId('residence-section')).toBeInTheDocument()
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
    expect(screen.getByTestId('preferences-section')).toBeInTheDocument()
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
    const { result, app } = withSetup(() => useRegisterFormStepValidation())
    const validForm = createValidRegisterForm()
    
    // Act
    const isValid = result.validateForm(validForm)
    
    // Assert
    expect(isValid).toBe(true)
    app.unmount()
  })

  it('should reject form with missing required fields', () => {
    // Arrange
    const { result, app } = withSetup(() => useRegisterFormStepValidation())
    const invalidForm = createValidRegisterForm({ username: '' }) // Username vacío
    
    // Act
    const isValid = result.validateForm(invalidForm)
    
    // Assert
    expect(isValid).toBe(false)
    app.unmount()
  })

  it('should provide validation rules for all form fields', () => {
    // Arrange
    const { result, app } = withSetup(() => useRegisterFormStepValidation())
    
    // Act & Assert
    expect(result.validationRules).toBeDefined()
    expect(result.validationRules.username).toBeDefined()
    expect(result.validationRules.firstName).toBeDefined()
    expect(result.validationRules.country).toBeDefined()
    app.unmount()
  })
})
```

#### **4. Mejores Prácticas para Provide/Inject**

**SÍ hacer:**
- **Composables con provide/inject**: Usar `withSetup` para testing unitario
- **Composables simples**: Usar `withSetup` para testing simple
- **Integración real**: Testing entre componentes padre/hijo
- **Validación separada**: Testing unitario de lógica de validación
- **Cleanup**: Siempre hacer `app.unmount()` con `withSetup`

**NO hacer:**
- Usar métodos incorrectos para provide/inject (siempre usar `withSetup`)
- Mockear provide/inject en tests de integración
- Testear detalles internos de la inyección
- Ignorar cleanup con `withSetup`
- Mezclar testing unitario e integración en el mismo test

### Selectores y Atributos para Testing de Componentes

**¿Por qué es crucial elegir el selector correcto en testing de componentes?**
Los selectores determinan qué tan robustos, accesibles y mantenibles serán tus tests. Testing Library proporciona múltiples métodos de consulta, cada uno con un propósito específico que se alinea con nuestro enfoque centrado en el usuario.

#### **1. Jerarquía de Preferencia de Selectores**

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
screen.getByLabelText('Email')
screen.getByLabelText('Contraseña')
screen.getByLabelText('Usuario')
screen.getByLabelText('Nombre')
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

**Estructura recomendada: `propósito` (simplificada)**

```vue
<!-- Formularios -->
data-testid="register-form"
data-testid="login-form"

<!-- Secciones -->
data-testid="basic-section"
data-testid="contact-section"

<!-- Inputs -->
data-testid="username-input"
data-testid="email-input"
data-testid="password-input"

<!-- Selects -->
data-testid="country-select"
data-testid="city-select"

<!-- Botones -->
data-testid="submit-button"
data-testid="cancel-button"
data-testid="favorite-button"

<!-- Contenedores -->
data-testid="anime-grid"
data-testid="loading-skeleton"

<!-- Estados -->
data-testid="loading-state"
data-testid="error-message"
data-testid="empty-state"
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
- **Usar `getByClassName()` o `getById()`** - Frágil y no accesible
- **Usar `aria-label` cuando hay texto visible suficientemente descriptivo** - Confunde lectores de pantalla
- **Testear detalles internos** - Estado privado, variables internas
- **Ignorar la jerarquía de selectores** - Siempre preferir labelText y text antes que testId

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
    expect(screen.getByTestId('main-form')).toBeInTheDocument()
    expect(screen.getByTestId('complete-step')).toBeInTheDocument()
    
    // Verificar secciones individuales
    expect(screen.getByTestId('basic-section')).toBeInTheDocument()
    expect(screen.getByTestId('residence-section')).toBeInTheDocument()
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
    expect(screen.getByTestId('preferences-section')).toBeInTheDocument()
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
    const firstNameInput = screen.getByTestId('first-name-input')
    expect(firstNameInput).toBeInTheDocument()
    expect(firstNameInput.getAttribute('data-testid')).toBe('first-name-input')

    const usernameInput = screen.getByTestId('username-input')
    expect(usernameInput).toBeInTheDocument()
    expect(usernameInput.getAttribute('data-testid')).toBe('username-input')

    const countrySelect = screen.getByTestId('country-select')
    expect(countrySelect).toBeInTheDocument()
    expect(countrySelect.getAttribute('data-testid')).toBe('country-select')
  })

  it('should render form with proper accessibility attributes', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar accesibilidad básica
    const form = screen.getByTestId('main-form')
    expect(form).toBeInTheDocument()
    
    // Verificar que los inputs tienen placeholders
    const firstNameInput = screen.getByTestId('first-name-input')
    expect(firstNameInput).toHaveAttribute('placeholder')
    
    const usernameInput = screen.getByTestId('username-input')
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
    <div data-testid="register-form-step-view">
      <h1>Crear Cuenta</h1>
      <p>Completa los siguientes datos para crear tu cuenta</p>
      
      <el-form data-testid="main-form">
        <div data-testid="complete-step">
          <div data-testid="basic-section">
            <el-input data-testid="first-name-input" placeholder="Nombre" />
            <el-input data-testid="username-input" placeholder="Usuario" />
          </div>
          
          <div data-testid="residence-section">
            <el-select data-testid="country-select" placeholder="Selecciona tu país">
              <el-option label="Colombia" value="colombia" />
              <el-option label="México" value="mexico" />
              <el-option label="Argentina" value="argentina" />
            </el-select>
            <el-input data-testid="city-input" placeholder="Ciudad" />
          </div>
          
          <div data-testid="contact-section">
            <el-input data-testid="emergency-contact-input" placeholder="Contacto de emergencia" />
            <el-input data-testid="emergency-phone-input" placeholder="Teléfono de emergencia" />
          </div>
          
          <div data-testid="preferences-section">
            <el-switch data-testid="newsletter-switch" />
            <el-switch data-testid="marketing-switch" />
            <el-checkbox data-testid="terms-checkbox">Acepto los términos</el-checkbox>
          </div>
        </div>
        
        <el-button data-testid="submit-button" type="success">Crear Cuenta</el-button>
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
    const form = screen.getByTestId('main-form')
    expect(form.tagName.toLowerCase()).toBe('el-form')
    expect(form).toHaveAttribute('data-testid', 'main-form')

    const submitButton = screen.getByTestId('submit-button')
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
    const select = screen.getByTestId('country-select')
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

### Testing de Stores Pinia

**El proyecto utiliza dos enfoques principales para testing con Pinia**, según el tipo de test y el nivel de control necesario. Basándonos en las mejores prácticas de [Fotis Adamakis sobre Unit Testing a Pinia Component](https://fadamakis.com/unit-testing-a-pinia-component-37d045582aed?gi=644ecb388b0a), hemos optimizado nuestros patrones de testing.

#### **1. Enfoque con createTestingPinia**

**Cuándo usar**: Para **testing de componentes (.vue)** que necesitan control total sobre el estado inicial y comportamiento de los stores.

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

#### **3. Patrón de Testing de Stores Completo**

**Patrón completo que cubre todos los aspectos:**

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAnimeStore } from '@/modules/anime/stores/anime.store'
import { createMockAnime } from '../factories/anime.factory'

describe('Anime Store - Testing Completo', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Estado Inicial', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useAnimeStore()
      
      // Assert
      expect(store.animes).toEqual([])
      expect(store.currentAnime).toBeNull()
      expect(store.favorites).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.currentPage).toBe(1)
      expect(store.totalAnimes).toBe(0)
      expect(store.totalFavorites).toBe(0)
    })
  })

  describe('Getters Computados', () => {
    it('should compute isFavorite correctly', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime({ mal_id: 1 })
      
      // Act
      store.addToFavorites(anime)
      
      // Assert
      expect(store.isFavorite(1)).toBe(true)
      expect(store.isFavorite(2)).toBe(false)
    })

    it('should compute totalFavorites correctly', () => {
      // Arrange
      const store = useAnimeStore()
      const anime1 = createMockAnime({ mal_id: 1 })
      const anime2 = createMockAnime({ mal_id: 2 })
      
      // Act
      store.addToFavorites(anime1)
      store.addToFavorites(anime2)
      
      // Assert
      expect(store.totalFavorites).toBe(2)
    })
  })

  describe('Acciones Síncronas', () => {
    it('should add anime to favorites', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime()
      
      // Act
      store.addToFavorites(anime)
      
      // Assert
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0]).toEqual(anime)
      expect(store.isFavorite(anime.mal_id)).toBe(true)
    })

    it('should remove anime from favorites', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime()
      store.addToFavorites(anime)
      
      // Act
      store.removeFromFavorites(anime.mal_id)
      
      // Assert
      expect(store.favorites).toHaveLength(0)
      expect(store.isFavorite(anime.mal_id)).toBe(false)
    })

    it('should toggle favorite status', () => {
      // Arrange
      const store = useAnimeStore()
      const anime = createMockAnime()
      
      // Act & Assert - Add
      store.toggleFavorite(anime)
      expect(store.isFavorite(anime.mal_id)).toBe(true)
      
      // Act & Assert - Remove
      store.toggleFavorite(anime)
      expect(store.isFavorite(anime.mal_id)).toBe(false)
    })
  })

  describe('Acciones Asíncronas', () => {
    it('should handle loading state during API calls', async () => {
      // Arrange
      const store = useAnimeStore()
      const mockResponse = right({ data: [] })
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
      
      // Act
      const loadPromise = store.loadAnimeList()
      
      // Assert - During loading
      expect(store.isLoading).toBe(true)
      
      // Act - Wait for completion
      await loadPromise
      
      // Assert - After loading
      expect(store.isLoading).toBe(false)
    })

    it('should handle API errors gracefully', async () => {
      // Arrange
      const store = useAnimeStore()
      const mockError = left({ message: 'API Error' })
      vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockError)
      
      // Act
      await store.loadAnimeList()
      
      // Assert
      expect(store.error).toBe('Error en el módulo de anime')
      expect(store.isLoading).toBe(false)
    })
  })
})
```

#### **4. Getters Readonly y Spying**

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

#### **5. Mejores Prácticas**

**SÍ hacer:**
- **Componentes**: Usar `createTestPinia` para control total del estado
- **Composables**: Usar Pinia real + spy para testing unitario
- **Getters readonly**: Mockear con `vi.spyOn(store, 'getter', 'get')`
- **Cleanup**: Limpiar mocks con `vi.clearAllMocks()` en `beforeEach`
- **Consistencia**: Usar siempre el helper `createTestPinia` del setup global
- **Testing de estado**: Verificar estado antes y después de acciones
- **Testing de getters**: Probar lógica computada con diferentes estados

**NO hacer:**
- Mezclar `createTestingPinia` y Pinia real en el mismo test
- Testear detalles internos del store (estado privado)
- Crear datos mock inline repetidamente
- Olvidar `stubActions: false` cuando necesites acciones reales
- Intentar asignar valores a getters computados directamente
- Usar `createTestingPinia` directamente en lugar del helper global

#### **6. Mejoras Implementadas**

**Mejoras implementadas:**

**Configuración Global Mejorada:**
```typescript
// test/setup.ts - Helper global mejorado
export const createTestPinia = (options = {}) => createTestingPinia({ 
  createSpy: vi.fn,
  stubActions: false, // Permite que las acciones se ejecuten realmente
  ...options
})
```

**Consistencia en el Uso:**
- **Antes**: Uso inconsistente de `createTestingPinia` y helpers locales
- **Después**: Uso consistente del helper global `createTestPinia`

**Patrón de Testing Completo:**
- Testing de estado inicial
- Testing de getters computados
- Testing de acciones síncronas y asíncronas
- Testing de manejo de errores
- Testing de integración con localStorage

**Beneficios de las Mejoras:**
1. **Consistencia**: Todos los tests usan el mismo helper global
2. **Mantenibilidad**: Configuración centralizada en un lugar
3. **Flexibilidad**: Opciones personalizables por test
4. **Mejor Testing**: Patrones más completos y robustos
5. **Documentación**: Mejores prácticas claramente documentadas

## Métricas de Cobertura

**¿Qué es Coverage?**
El coverage mide qué porcentaje del código está siendo ejecutado por los tests. Es una métrica que ayuda a identificar código no probado, pero no garantiza calidad.

**Importante:** En proyectos en migración, es normal tener coverage bajo inicialmente. Los siguientes porcentajes son **metas a alcanzar gradualmente**.

#### **Objetivos**

* Stores: 70-80% (Lógica de negocio crítica)
* Composables: 60-75% (Lógica de UI y transformaciones)
* Utils: 70-80% (Funciones puras y transformaciones)
* Components: 40-60% (Interacciones de usuario y lógica de template)
* Services: 20-40% (Solo casos edge y validaciones específicas)

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

# Ejecutar tests con UI (interfaz visual de Vitest)
yarn test --ui

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
    "test:unit": "vitest --run src/**/*.spec.ts",
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
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
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

// Importar factories desde su ubicación separada
import { 
  routerFactories, 
  defaultRoutes, 
  createRouterFactory,
  createAnimeRouterFactory,
  createAuthRouterFactory,
  withBasePath,
  withMeta,
  withCustomRoutes
} from './factories'

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

Implementamos el patrón `withSetup` para testing de composables:

```typescript
// test/utils/withSetup.ts
import { createApp } from 'vue'

export function withSetup<T>(composable: () => T, options: any = {}) {
  let result: T
  
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })

  // Configurar plugins si se proporcionan
  if (options.plugins) {
    options.plugins.forEach(plugin => app.use(plugin))
  }

  app.mount(document.createElement('div'))
  
  return { result, app }
}
```

**Uso práctico:**

```typescript
import { withSetup } from '@/test/utils/withSetup'

// 1. Composable simple (recomendado)
const { result, app } = withSetup(() => useMyComposable())
expect(result.isReady.value).toBe(true)
app.unmount()

// 2. Composable con lifecycle hooks
const { result, app } = withSetup(() => useMyComposable())
expect(result.isReady.value).toBe(true)
app.unmount() // Cleanup obligatorio

// 3. Composable con plugins (Pinia, Router)
const { result, app } = withSetup(() => useMyStore(), {
  plugins: [createTestingPinia()]
})
expect(result.data.value).toBeDefined()
app.unmount()
```

**Mejores prácticas:**
- **Usar `withSetup` para todos los composables**: Es el patrón estándar del proyecto
- **Cleanup obligatorio**: Siempre hacer `app.unmount()` después del test
- **Testear comportamiento observable**: No detalles de implementación

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
    const element = wrapper.find(`[data-testid="${field}"]`)
    
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
  vi.clearAllMocks()
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
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        },
        // Coverage específico por módulo (solo para módulos críticos)
        'src/modules/auth/': {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75
        }
      }
    }
  }
})
```

## Preguntas para Crear Tests de Calidad

### **¿Vale la pena testear esto?**

#### **Preguntas de Valor de Negocio**
- **¿Qué pasa si esto falla en producción?** Si la respuesta es "nada grave", probablemente no necesita test
- **¿Cuántos usuarios se verían afectados?** Funcionalidad crítica para muchos usuarios = alta prioridad
- **¿Cuánto dinero se perdería si falla?** Checkout, pagos, facturación = testing obligatorio
- **¿Qué tan difícil es detectar el error manualmente?** Errores sutiles o casos edge necesitan tests

#### **Preguntas de Complejidad**
- **¿Tiene lógica de negocio compleja?** Cálculos, validaciones, transformaciones = sí testear
- **¿Es un getter/setter simple?** `get name() { return this.name }` = no testear
- **¿Tiene múltiples condiciones o casos edge?** Más de 2-3 `if/else` = probablemente sí
- **¿Es código que escribiste rápido y no estás 100% seguro?** Mejor testearlo

#### **¿Solo Lógica o También UX?**
- **Solo lógica si**: Es una función pura, cálculo, validación, transformación de datos
- **También UX si**: El usuario interactúa directamente, hay formularios, navegación, o estados visuales
- **Ejemplo lógica**: `calculateTax(price, rate)` → test unitario
- **Ejemplo UX**: Formulario de login → test de componente
- **Ejemplo mixto**: Carrito de compras → test lógica (cálculos) + UX (agregar/quitar items)

#### **Preguntas de Costo/Beneficio**
- **¿Cuánto tiempo tomaría escribir el test?** Si es más de 30 min, evalúa si vale la pena
- **¿Cuánto tiempo tomaría arreglar bugs sin test?** Si es mucho tiempo de debugging, mejor testear
- **¿Estás en modo "ship rápido"?** Si necesitas lanzar urgente, prioriza tests de flujos críticos
- **¿Es código que cambia mucho?** Si cambia semanalmente, los tests pueden ser contraproducentes

### **¿Está bien arquitecturado mi test?**
- **¿Puedo entender qué hace el test en 5 segundos?** Si no, necesita ser más claro
- **¿El test falla con un mensaje útil?** El mensaje de error debe explicar qué salió mal, no solo que falló
- **¿Es fácil de mantener?** Si cambias la implementación (sin cambiar el comportamiento), ¿el test sigue funcionando?
- **¿Usa factories para datos complejos?** Evita crear objetos mock enormes inline

### **¿Está bien estructurado mi test?**
- **¿Sigue el patrón AAA?** Arrange, Act, Assert debe ser claro
- **¿Tiene un solo propósito?** Un test debe probar una sola cosa
- **¿El nombre del test explica qué hace?** Debe ser descriptivo: `should calculate total price with tax when item is taxable`
- **¿Es independiente de otros tests?** Debe poder ejecutarse solo sin depender de orden o estado

### **¿Está optimizado para debugging?**
- **¿Si falla, sabré inmediatamente por qué?** Los mensajes de error deben ser claros y específicos
- **¿Usa `expect().toBe()` en lugar de `expect().toBeTruthy()`?** Aserciones específicas dan mejor feedback
- **¿Evita lógica compleja en el test?** Los tests deben ser simples y lineales


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


**Nota sobre las referencias**: Esta documentación está basada en las mejores prácticas establecidas por la comunidad Vue y los principios de testing moderno. Todas las referencias han sido seleccionadas por su relevancia y autoridad en el tema. La frase clave "Si un usuario no puede hacerlo, tu prueba tampoco debería poder hacerlo" es fundamental para entender el enfoque de testing centrado en el usuario.

### **Pinia Testing**
- [Pinia Testing Documentation](https://pinia.vuejs.org/cookbook/testing.html) - Documentación oficial de Pinia
- [Unit Testing a Pinia Component](https://fadamakis.com/unit-testing-a-pinia-component-37d045582aed?gi=644ecb388b0a) - Fotis Adamakis - Mejores prácticas específicas
- [Testing Vuex/Pinia Stores](https://test-utils.vuejs.org/guide/advanced/vuex.html) - Vue Test Utils - Guía oficial

