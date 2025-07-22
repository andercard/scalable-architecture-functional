[⬅️ Volver al índice](./README.md)

## Testing de Vue Router

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
### Ejemplo de uso

Puedes ver ejemplos prácticos de testing de Vue Router en:

- [`src/modules/anime/test/routes/anime.guards.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/routes/anime.guards.spec.ts)
- [`src/modules/anime/test/routes/index.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/routes/index.spec.ts) 