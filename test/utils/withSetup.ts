import { createApp, type Component, provide } from 'vue'
import type { App, Plugin } from 'vue'

// vi está disponible globalmente en el contexto de testing
declare const vi: {
  fn: () => ReturnType<typeof vi.fn>
}

/**
 * UTILIDADES PARA TESTING DE COMPOSABLES
 * 
 * Basado en las mejores prácticas de:
 * - Vue Testing Library: https://testing-library.com/docs/vue-testing-library/intro/
 * - Dylan Britz: https://dev.to/britzdm/mastering-vue-3-composables-testing-with-vitest-1bk3
 * - Alex Op: https://alexop.dev/posts/how-to-test-vue-composables/
 * 
 * EJEMPLOS DE USO:
 * 
 * ```typescript
 * // 1. Composable simple (solo reactividad)
 * import { renderComposable } from '@testing-library/vue'
 * const { result } = renderComposable(() => useSimpleComposable())
 * 
 * // 2. Composable con lifecycle hooks
 * import { withSetup } from '@/test/setup'
 * const { result, app } = withSetup(() => useLifecycleComposable())
 * app.unmount() // Importante: cleanup
 * 
 * // 3. Composable con inyección
 * const { result, app } = withInjectedSetup(
 *   () => useInjectableComposable(),
 *   { 'my-key': 'my-value' }
 * )
 * 
 * // 4. Composable con plugins
 * const { result, app } = withPlugins(
 *   () => useStoreComposable(),
 *   [createTestingPinia()]
 * )
 * 
 * // 5. Composable async
 * const { result, app, waitFor } = withAsyncSetup(() => useAsyncComposable())
 * await waitFor(() => expect(result.data.value).toBeDefined())
 * ```
 */

/**
 * Utilidad para testear composables que requieren lifecycle hooks
 * 
 * @param composable - Función composable a testear
 * @returns Objeto con result (retorno del composable) y app (instancia de Vue para cleanup)
 * 
 * @example
 * ```typescript
 * const { result, app } = withSetup(() => useMyComposable())
 * expect(result.isReady.value).toBe(true)
 * app.unmount() // Importante: siempre hacer cleanup
 * ```
 */
export function withSetup<T>(composable: () => T): { result: T; app: App } {
  let result: T | undefined

  const TestComponent: Component = {
    setup() {
      result = composable()
      return {}
    },
    template: '<div></div>'
  }

  const app = createApp(TestComponent)
  const container = document.createElement('div')
  app.mount(container)

  return {
    result: result as T,
    app
  }
}

/**
 * Utilidad para testear composables con inyección de dependencias
 * 
 * @param composable - Función composable a testear
 * @param providers - Objeto con dependencias a inyectar
 * @returns Objeto con result y app
 * 
 * @example
 * ```typescript
 * const { result, app } = withInjectedSetup(
 *   () => useMyComposable(),
 *   { 'my-key': 'my-value' }
 * )
 * ```
 */
export function withInjectedSetup<T>(
  composable: () => T,
  providers: Record<string, unknown> = {}
): { result: T; app: App } {
  let result: T | undefined

  const TestComponent: Component = {
    setup() {
      // Proporcionar dependencias
      Object.entries(providers).forEach(([key, value]) => {
        provide(key, value)
      })

      result = composable()
      return {}
    },
    template: '<div></div>'
  }

  const app = createApp(TestComponent)
  const container = document.createElement('div')
  app.mount(container)

  return {
    result: result as T,
    app
  }
}

/**
 * Utilidad para testear composables con plugins (Pinia, Router, etc.)
 * 
 * @param composable - Función composable a testear
 * @param plugins - Array de plugins a instalar
 * @returns Objeto con result y app
 * 
 * @example
 * ```typescript
 * const { result, app } = withPlugins(
 *   () => useMyStore(),
 *   [createTestingPinia()]
 * )
 * ```
 */
export function withPlugins<T>(
  composable: () => T,
  plugins: Plugin[] = []
): { result: T; app: App } {
  let result: T | undefined

  const TestComponent: Component = {
    setup() {
      result = composable()
      return {}
    },
    template: '<div></div>'
  }

  const app = createApp(TestComponent)
  
  // Instalar plugins
  plugins.forEach(plugin => {
    app.use(plugin)
  })

  const container = document.createElement('div')
  app.mount(container)

  return {
    result: result as T,
    app
  }
}

/**
 * Utilidad para testear composables con async operations
 * 
 * @param composable - Función composable a testear
 * @returns Objeto con result, app y waitFor
 * 
 * @example
 * ```typescript
 * const { result, app, waitFor } = withAsyncSetup(() => useAsyncComposable())
 * await waitFor(() => expect(result.data.value).toBeDefined())
 * app.unmount()
 * ```
 */
export function withAsyncSetup<T>(composable: () => T): { 
  result: T; 
  app: App; 
  waitFor: (callback: () => void) => Promise<void> 
} {
  const { result, app } = withSetup(composable)

  const waitFor = (callback: () => void): Promise<void> => {
    return new Promise((resolve) => {
      const check = () => {
        try {
          callback()
          resolve()
        } catch (error) {
          setTimeout(check, 10)
        }
      }
      check()
    })
  }

  return { result, app, waitFor }
}

/**
 * Utilidad para testear composables que usan provide/inject
 * 
 * @param setup - Función setup que contiene el composable
 * @param injections - Configuración de inyecciones
 * @returns Resultado del composable con función unmount
 */
export function useInjectedSetup<TResult>(
  setup: () => TResult,
  injections: Array<{ key: string | symbol; value: any }> = []
): TResult & { unmount: () => void } {
  let result!: TResult

  const Comp = {
    setup() {
      result = setup()
      return () => null
    },
  }

  const Provider = {
    setup() {
      injections.forEach(({ key, value }) => {
        // Simular provide
        if (typeof key === 'string') {
          // Para keys simples, usar una propiedad global
          ;(window as any)[`__test_${key}`] = value
        }
      })
      return () => Comp
    },
  }

  const app = createApp(Provider)
  const el = document.createElement('div')
  const mounted = app.mount(el)

  return {
    ...result,
    unmount: () => app.unmount(),
  } as TResult & { unmount: () => void }
}

/**
 * Helper para simular route params en tests
 * 
 * @param params - Parámetros de ruta a simular
 * @returns Mock de useRoute
 */
export function createMockRoute(params: Record<string, string> = {}) {
  return {
    params,
    query: {},
    path: '/test',
    name: 'test',
    meta: {},
    matched: [],
    hash: '',
    fullPath: '/test'
  }
}

/**
 * Helper para simular router en tests
 * 
 * @returns Mock de useRouter
 */
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: {
      value: {
        path: '/test',
        params: {},
        query: {},
        hash: '',
        fullPath: '/test'
      }
    }
  }
} 