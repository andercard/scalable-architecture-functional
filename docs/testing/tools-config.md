[⬅️ Volver al índice](./README.md)

## Herramientas y Configuración

Esta sección describe las herramientas principales que utilizamos para testing, cómo configurarlas correctamente y las utilidades globales que facilitan el desarrollo de tests efectivos.

### Stack de Testing

Nuestro stack de testing está diseñado para proporcionar una experiencia de desarrollo eficiente y confiable:

Framework principal: Vitest
- Velocidad: Ejecución rápida con hot reload
- Compatibilidad: Soporte nativo para Vue 3 y TypeScript
- Coverage: Integración con @vitest/coverage-v8
- UI: Interfaz visual para debugging de tests

Testing de componentes: Vue Testing Library
- Enfoque centrado en el usuario: Simula interacciones reales
- Accesibilidad: Promueve el uso de selectores accesibles
- API intuitiva: Sintaxis clara y fácil de aprender

State Management: @pinia/testing
- Testing de stores: Herramientas específicas para Pinia
- Mocks automáticos: Configuración simplificada de stores
- Integración: Funciona perfectamente con Vue Testing Library

### Configuración Global (analizar)

La configuración global establece el entorno base para todos los tests del proyecto.

Configuración de Vitest (vitest.config.ts)
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

¿Por qué esta configuración es la mejor práctica?

Esta configuración utiliza `mergeConfig` para combinar la configuración de Vite con Vitest, ofreciendo:

Ventajas principales
- Consistencia: Reutiliza configuración de Vite (alias, plugins, resolvers)
- Mantenimiento: Evita duplicación entre Vite y Vitest
- Optimización: Incluye optimizaciones específicas para dependencias del proyecto
- Escalabilidad: Configuración robusta para proyectos complejos

Setup Global (test/setup.ts)
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

Utilidades para Testing de Composables (test/utils/withSetup.ts)

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

Uso práctico:

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

Mejores prácticas:
- Usar `withSetup` para todos los composables: Es el patrón estándar del proyecto
- Cleanup obligatorio: Siempre hacer `app.unmount()` después del test
- Testear comportamiento observable: No detalles de implementación

Utilidad para testing de formularios (test/utils/formTesting.ts)
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

Utilidades Globales de Testing (test/setup.ts)

Nuestro setup global incluye utilidades reutilizables que simplifican la escritura de tests:

Helper para testing de navegación:
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

Helper para testing de formularios con Vue Testing Library:
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

Helper para testing de navegación con Vue Testing Library:
```typescript
// Simular navegación de usuario
const user = userEvent.setup()
await user.click(screen.getByRole('link', { name: /anime detail/i }))

// Verificar que la navegación ocurrió
expect(router.currentRoute.value.path).toBe('/anime/1')
```

Helper para limpiar mocks:
```typescript
// Limpiar todos los mocks entre tests
beforeEach(() => {
  vi.clearAllMocks()
})
```

Utilidad para testing de navegación (test/utils/navigationTesting.ts)
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

Setup por módulo (src/modules/anime/test/setup.ts)
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

Configuración de coverage por módulo
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