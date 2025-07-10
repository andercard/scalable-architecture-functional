import type { RouteRecordRaw } from 'vue-router'

/**
 * FACTORY DE RUTAS PARA TESTING - ENFOQUE FUNCIONAL
 * 
 * Basado en las mejores prácticas de:
 * - Oscar Reyes: https://oscar-reyes.medium.com/factory-functions-functional-mixins-with-typescript-83793195391d
 * - Matt Unhjem: https://dev.to/mattu/make-a-factory-creating-reliable-tests-with-factory-functions-in-typescript-and-react-eh
 * - Focused.io: https://focused.io/lab/vue-router-testing-strategies
 * 
 * PRINCIPIOS:
 * - Factory functions puras
 * - Object composition
 * - Functional mixins
 * - Inmutabilidad
 * - Composición funcional
 */

interface RouteFactoryOptions {
  includeAuth?: boolean
  includeForms?: boolean
  customRoutes?: RouteRecordRaw[]
  basePath?: string
  meta?: Record<string, unknown>
}

interface RouteConfig {
  path: string
  name: string
  component: { template: string }
  props?: boolean
  meta?: Record<string, unknown>
}

interface RouterFactoryState {
  routes: RouteRecordRaw[]
  options: RouteFactoryOptions
  addRoute: (config: RouteConfig) => RouterFactoryState
  addRoutes: (configs: RouteConfig[]) => RouterFactoryState
  addCustomRoutes: (routes: RouteRecordRaw[]) => RouterFactoryState
  extend: (otherFactory: RouterFactoryState) => RouterFactoryState
  withOptions: (newOptions: Partial<RouteFactoryOptions>) => RouterFactoryState
  build: () => RouteRecordRaw[]
}

/**
 * FACTORY BASE FUNCIONAL
 * Crea una factory function que retorna un objeto con métodos encadenables
 */
export const createRouterFactory = (options: RouteFactoryOptions = {}): RouterFactoryState => {
  return {
    routes: [],
    options,
    // Métodos que retornan una nueva instancia (inmutabilidad)
    addRoute: (config: RouteConfig) => {
      const route: RouteRecordRaw = {
        path: options.basePath ? `${options.basePath}${config.path}` : config.path,
        name: config.name,
        component: config.component,
        ...(config.props && { props: config.props }),
        ...(config.meta && { meta: { ...options.meta, ...config.meta } })
      }
      
      return createRouterFactory({
        ...options,
        customRoutes: [...(options.customRoutes || []), route]
      })
    },

    addRoutes: (configs: RouteConfig[]) => {
      const newRoutes = configs.map(config => ({
        path: options.basePath ? `${options.basePath}${config.path}` : config.path,
        name: config.name,
        component: config.component,
        ...(config.props && { props: config.props }),
        ...(config.meta && { meta: { ...options.meta, ...config.meta } })
      }))
      
      return createRouterFactory({
        ...options,
        customRoutes: [...(options.customRoutes || []), ...newRoutes]
      })
    },

    addCustomRoutes: (routes: RouteRecordRaw[]) => {
      return createRouterFactory({
        ...options,
        customRoutes: [...(options.customRoutes || []), ...routes]
      })
    },

    extend: (otherFactory: RouterFactoryState) => {
      return createRouterFactory({
        ...options,
        customRoutes: [...(options.customRoutes || []), ...otherFactory.routes]
      })
    },

    withOptions: (newOptions: Partial<RouteFactoryOptions>) => {
      return createRouterFactory({ ...options, ...newOptions })
    },

    build: (): RouteRecordRaw[] => {
      return [...(options.customRoutes || [])]
    }
  }
}

/**
 * FACTORY ESPECÍFICA PARA ANIME
 * Usa object composition para extender la factory base
 */
export const createAnimeRouterFactory = (options: RouteFactoryOptions = {}) => {
  const baseFactory = createRouterFactory(options)
  
  const animeRoutes: RouteConfig[] = [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home</div>' }
    },
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
  ]

  return {
    ...baseFactory,
    routes: animeRoutes,
    
    // Métodos específicos de anime
    addAnimeRoutes: () => {
      const additionalRoutes: RouteConfig[] = [
        {
          path: '/anime/search',
          name: 'AnimeSearch',
          component: { template: '<div>Anime Search</div>' }
        },
        {
          path: '/anime/genre/:genre',
          name: 'AnimeByGenre',
          component: { template: '<div>Anime by Genre: {{ $route.params.genre }}</div>' },
          props: true
        }
      ]
      
      return baseFactory.addRoutes(additionalRoutes)
    },

    build: (): RouteRecordRaw[] => {
      return baseFactory.addRoutes(animeRoutes).build()
    }
  }
}

/**
 * FACTORY ESPECÍFICA PARA AUTENTICACIÓN
 * Usa object composition para extender la factory base
 */
export const createAuthRouterFactory = (options: RouteFactoryOptions = {}) => {
  const baseFactory = createRouterFactory(options)
  
  const authRoutes: RouteConfig[] = [
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
    },
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home</div>' }
    }
  ]

  return {
    ...baseFactory,
    routes: authRoutes,
    
    // Métodos específicos de auth
    addPasswordRecoveryRoutes: () => {
      const recoveryRoutes: RouteConfig[] = [
        {
          path: '/forgot-password',
          name: 'ForgotPassword',
          component: { template: '<div>Forgot Password</div>' }
        },
        {
          path: '/reset-password',
          name: 'ResetPassword',
          component: { template: '<div>Reset Password</div>' }
        }
      ]
      
      return baseFactory.addRoutes(recoveryRoutes)
    },

    build: (): RouteRecordRaw[] => {
      return baseFactory.addRoutes(authRoutes).build()
    }
  }
}

/**
 * FACTORY ESPECÍFICA PARA FORMULARIOS
 * Usa object composition para extender la factory base
 */
export const createFormsRouterFactory = (options: RouteFactoryOptions = {}) => {
  const baseFactory = createRouterFactory(options)
  
  const formRoutes: RouteConfig[] = [
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

  return {
    ...baseFactory,
    routes: formRoutes,
    
    // Métodos específicos de formularios
    addValidationRoutes: () => {
      const validationRoutes: RouteConfig[] = [
        {
          path: '/form/validate',
          name: 'FormValidation',
          component: { template: '<div>Form Validation</div>' }
        }
      ]
      
      return baseFactory.addRoutes(validationRoutes)
    },

    build: (): RouteRecordRaw[] => {
      return baseFactory.addRoutes(formRoutes).build()
    }
  }
}

/**
 * FACTORY PARA GUARDS
 * Usa object composition para extender la factory base
 */
export const createGuardsRouterFactory = (options: RouteFactoryOptions = {}) => {
  const baseFactory = createRouterFactory(options)
  
  const guardRoutes: RouteConfig[] = [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home</div>' }
    },
    {
      path: '/protected',
      name: 'Protected',
      component: { template: '<div>Protected</div>' },
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: { template: '<div>Login</div>' }
    }
  ]

  return {
    ...baseFactory,
    routes: guardRoutes,
    
    build: (): RouteRecordRaw[] => {
      return baseFactory.addRoutes(guardRoutes).build()
    }
  }
}

/**
 * FACTORY PARA NAVEGACIÓN COMPLEJA
 * Usa object composition para extender la factory base
 */
export const createNavigationRouterFactory = (options: RouteFactoryOptions = {}) => {
  const baseFactory = createRouterFactory(options)
  
  const navigationRoutes: RouteConfig[] = [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home</div>' }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: { template: '<div>Dashboard</div>' }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: { template: '<div>Settings</div>' }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: { template: '<div>Profile</div>' }
    }
  ]

  return {
    ...baseFactory,
    routes: navigationRoutes,
    
    build: (): RouteRecordRaw[] => {
      return baseFactory.addRoutes(navigationRoutes).build()
    }
  }
}

/**
 * FACTORY COMPUESTA FUNCIONAL
 * Combina múltiples factories usando composición funcional
 */
export const createCompositeRouterFactory = (factories: RouterFactoryState[]) => {
  const baseFactory = createRouterFactory()
  
  return factories.reduce((composite, factory) => {
    return composite.extend(factory)
  }, baseFactory)
}

/**
 * FUNCIONAL MIXINS
 * Funciones que agregan funcionalidad específica a cualquier factory
 */
export const withBasePath = (basePath: string) => (factory: RouterFactoryState) => {
  return factory.withOptions({ basePath })
}

export const withMeta = (meta: Record<string, unknown>) => (factory: RouterFactoryState) => {
  return factory.withOptions({ meta })
}

export const withCustomRoutes = (routes: RouteRecordRaw[]) => (factory: RouterFactoryState) => {
  return factory.addCustomRoutes(routes)
}

/**
 * FUNCIONES DE CONVENIENCIA
 * Para uso rápido sin crear instancias
 */
export const routerFactories = {
  // Factory básica con opciones
  basic: (options: RouteFactoryOptions = {}): RouteRecordRaw[] => {
    return createRouterFactory(options)
      .addRoute({
        path: '/',
        name: 'Home',
        component: { template: '<div>Home</div>' }
      })
      .build()
  },

  // Factory específica para testing de anime
  anime: (options: RouteFactoryOptions = {}): RouteRecordRaw[] => {
    return createAnimeRouterFactory(options).build()
  },

  // Factory específica para testing de autenticación
  auth: (options: RouteFactoryOptions = {}): RouteRecordRaw[] => {
    return createAuthRouterFactory(options).build()
  },

  // Factory específica para testing de formularios
  forms: (options: RouteFactoryOptions = {}): RouteRecordRaw[] => {
    return createFormsRouterFactory(options).build()
  },

  // Factory específica para testing de guards
  withGuards: (options: RouteFactoryOptions = {}): RouteRecordRaw[] => {
    return createGuardsRouterFactory(options).build()
  },

  // Factory para testing de navegación compleja
  navigation: (options: RouteFactoryOptions = {}): RouteRecordRaw[] => {
    return createNavigationRouterFactory(options).build()
  },

  // Factory compuesta
  composite: (factories: RouterFactoryState[]): RouteRecordRaw[] => {
    return createCompositeRouterFactory(factories).build()
  }
}

/**
 * RUTAS POR DEFECTO PARA TESTS BÁSICOS
 * Mantener compatibilidad con tests existentes
 */
export const defaultRoutes: RouteRecordRaw[] = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/anime', component: { template: '<div>Anime</div>' } },
  { path: '/anime/:id', component: { template: '<div>Anime Detail</div>' } }
]



/**
 * EJEMPLOS DE USO DEL FACTORY PATTERN FUNCIONAL
 * 
 * Estos ejemplos muestran cómo usar las nuevas factory functions
 * para crear rutas flexibles y extensibles usando programación funcional
 */

// Ejemplo 1: Uso básico con función de conveniencia
export const exampleBasicUsage = () => {
  const routes = routerFactories.anime()
  return routes
}

// Ejemplo 2: Uso con factory específica y extensión
export const exampleAnimeWithExtension = () => {
  const animeFactory = createAnimeRouterFactory()
    .addAnimeRoutes() // Agregar rutas adicionales de anime
    .addRoute({
      path: '/anime/custom',
      name: 'CustomAnime',
      component: { template: '<div>Custom Anime Page</div>' }
    })
  
  return animeFactory.build()
}

// Ejemplo 3: Uso con composición de múltiples factories
export const exampleCompositeUsage = () => {
  const animeFactory = createAnimeRouterFactory()
  const authFactory = createAuthRouterFactory()
  
  const compositeFactory = createCompositeRouterFactory([animeFactory, authFactory])
    .addRoute({
      path: '/dashboard',
      name: 'Dashboard',
      component: { template: '<div>Dashboard</div>' }
    })
  
  return compositeFactory.build()
}

// Ejemplo 4: Uso con functional mixins
export const exampleWithMixins = () => {
  const animeFactory = createAnimeRouterFactory()
  
  const enhancedFactory = withBasePath('/app')(
    withMeta({ requiresAuth: true })(
      withCustomRoutes([
        { path: '/custom', component: { template: '<div>Custom</div>' } }
      ])(animeFactory)
    )
  )
  
  return enhancedFactory.build()
}

// Ejemplo 5: Uso con composición funcional
export const exampleFunctionalComposition = () => {
  const baseFactory = createRouterFactory()
    .addRoute({
      path: '/',
      name: 'Home',
      component: { template: '<div>Home</div>' }
    })
  
  const extendedFactory = baseFactory
    .addRoute({
      path: '/about',
      name: 'About',
      component: { template: '<div>About</div>' }
    })
    .withOptions({ basePath: '/app' })
  
  return {
    base: baseFactory.build(),
    extended: extendedFactory.build()
  }
} 