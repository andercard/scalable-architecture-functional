# Guía de Testing

## Índice

- [Introducción](#introducción)
- [Enfoque: Dos Tipos de Usuarios](#enfoque-dos-tipos-de-usuarios)
- [Herramientas y Configuración](#herramientas-y-configuración)
- [Patrones y Mejores Prácticas](#patrones-y-mejores-prácticas)
- [Arquitectura de Testing](#arquitectura-de-testing)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Anti-Patrones a Evitar](#anti-patrones-a-evitar)
- [Checklist de Calidad](#checklist-de-calidad)
- [Métricas de Éxito](#métricas-de-éxito)
- [Recursos y Referencias](#recursos-y-referencias)

---

## Introducción

Esta guía reúne las mejores prácticas, patrones y ejemplos para escribir tests efectivos y mantenibles en este proyecto. Su objetivo es facilitar la incorporación de nuevos desarrolladores, estandarizar la calidad de las pruebas y asegurar que el código sea confiable y fácil de evolucionar.

El enfoque de testing está inspirado en los principios de la comunidad Vue y en referentes como Kent C. Dodds, priorizando la experiencia del usuario final y la robustez de la lógica de negocio. Aquí encontrarás recomendaciones claras sobre cuándo y cómo testear, cómo estructurar los tests, y cómo evitar los errores más comunes.

**¿A quién está dirigida esta guía?**
- A cualquier desarrollador que trabaje en el proyecto, sin importar su nivel de experiencia.
- A quienes deseen entender el porqué de las decisiones de testing y cómo aplicarlas en la práctica.

**¿Qué encontrarás aquí?**
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

**Características técnicas:**
- **Con DOM**: Renderizan componentes reales en un entorno de testing
- **Centradas en el usuario**: Simulan interacciones reales del usuario
- **Más lentas**: 10-50ms por test debido al renderizado
- **Validación de UX**: Verifican comportamiento observable en la interfaz

**Ejemplo práctico:**
```typescript
// Test de componente - Simula interacción real del usuario
it('should allow user to add anime to favorites', async () => {
  render(AnimeCard, { props: { anime: mockAnime } })
  
  const favoriteButton = screen.getByRole('button', { 
    name: /add to favorites/i 
  })
  
  await fireEvent.click(favoriteButton)
  
  expect(screen.getByText('❤️')).toBeInTheDocument()
  expect(emitted('toggle-favorite')).toBeTruthy()
})
```

### Desarrollador: Testing Unitario

**¿Quién es?**  
El desarrollador es quien escribe, mantiene y evoluciona el código. Necesita confianza en que los cambios que hace no rompen funcionalidad existente.

**¿Qué necesita?**  
El desarrollador necesita tests rápidos y específicos que le ayuden a:
- Verificar que la lógica funciona correctamente
- Detectar regresiones cuando hace cambios
- Entender cómo se comporta el código en diferentes escenarios
- Refactorizar con confianza

**¿Qué probamos?**  
Verificamos funciones puras, composables y lógica de negocio:

- Composables con lógica compleja
- Funciones de utilidad y transformación de datos
- Stores y manejo de estado
- Validaciones y cálculos
- Manejo de errores y casos edge

**Características técnicas:**
- **Sin DOM**: No renderizan componentes, solo prueban lógica
- **Aisladas**: Sin dependencias externas o efectos secundarios
- **Rápidas**: < 1ms por test
- **Determinísticas**: Mismo input siempre produce el mismo output

**Ejemplo práctico:**
```typescript
// Test unitario - Prueba lógica pura
it('should compute anime subtitle correctly', () => {
  const props = { anime: createMockAnime({ type: 'TV', status: 'Airing' }) }
  const emit = vi.fn()
  
  const { result } = renderComposable(() => useAnimeCard(props, emit))
  
  expect(result.current.animeSubtitle).toBe('TV • Airing')
})
```

### Beneficios de esta separación

**Claridad de responsabilidades**
Cada tipo de test tiene un propósito específico y bien definido. Los tests de componentes validan la experiencia del usuario, mientras que los tests unitarios validan la lógica de negocio.

**Mantenibilidad mejorada**
Los desarrolladores pueden refactorizar lógica interna sin romper tests de UI. Los tests unitarios siguen siendo válidos mientras la interfaz pública se mantenga consistente.

**Confianza en la calidad**
Los usuarios finales tienen garantía de que la interfaz funciona como esperan, mientras que los desarrolladores tienen confianza en que la lógica es robusta y correcta.

**Eficiencia en el desarrollo**
Los tests unitarios son rápidos y permiten desarrollo iterativo, mientras que los tests de componentes validan la integración completa cuando es necesario.

**Validación completa del sistema**
Cubrimos tanto la lógica interna como la experiencia de usuario, asegurando que la aplicación funciona correctamente en todos los niveles.

**Detección temprana de problemas**
Los tests de componentes detectan problemas de integración entre lógica y template que los tests unitarios no pueden identificar.

### ¿Por qué no solo pruebas unitarias?

Aunque algunos enfoques sugieren usar únicamente pruebas unitarias para maximizar la velocidad, nuestro enfoque híbrido es superior por las siguientes razones, basándonos en los principios de [Kent C. Dodds](https://kentcdodds.com/blog/testing-implementation-details):

**Los tests de componentes validan UX real**
Los tests unitarios pueden pasar mientras la interfaz de usuario está rota. Los tests de componentes garantizan que el usuario puede realmente usar la aplicación.

**Detectan problemas de integración**
Los tests de componentes revelan problemas entre composables y templates, entre diferentes componentes, y en la integración con librerías externas.

**Validan accesibilidad naturalmente**
Al usar selectores como `getByRole()` y `getByLabelText()`, los tests de componentes promueven y validan la accesibilidad de la aplicación.

**Evitan falsos positivos y falsos negativos**
Los tests unitarios pueden generar dos tipos de errores problemáticos:

- **Falsos positivos**: El test pasa pero la funcionalidad está rota para el usuario. Por ejemplo, un test unitario puede verificar que `toggleFavorite()` se llama correctamente, pero si el botón no está visible o no responde al click, el usuario no puede usar la funcionalidad.

- **Falsos negativos**: El test falla pero la funcionalidad funciona correctamente. Esto sucede cuando testeas detalles de implementación que cambian durante el desarrollo, como nombres de variables internas o estructura de datos específica.

Los tests de componentes, al simular interacciones reales del usuario, validan que la funcionalidad realmente funciona desde la perspectiva del usuario final.

**Proporcionan documentación viva**
Los tests de componentes sirven como documentación de cómo se debe usar la aplicación, mostrando las interacciones esperadas del usuario.

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

### Configuración Global

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
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import { render, type RenderOptions } from '@testing-library/vue'
import type { ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import '@testing-library/jest-dom'

// Mocks globales
vi.mock('vue-router')
vi.mock('@/core/api/instance')
vi.mock('element-plus')

// Configuración de Pinia para tests
const pinia = createTestingPinia({ 
  createSpy: vi.fn,
  stubActions: false // Permite que las acciones se ejecuten realmente
})

// Configuración de Vue Router
const router: Router = createRouter({
  history: createMemoryHistory(), // Simula navegación en memoria, sin modificar URL real
  routes: [],
})

// Helper para configurar testing-library con plugins
export const renderWithPlugins = (component: ComponentPublicInstance, options: RenderOptions<ComponentPublicInstance> = {}) => {
  return render(component, {
    global: {
      plugins: [pinia, router],
      ...(options.global || {})
    },
    ...options
  })
}

/**
 * MOCKS SELECTIVOS DEL NAVEGADOR
 * Solo mockeamos las APIs específicas que necesitamos para testing
 */

// Mock de localStorage (solo métodos necesarios)
globalThis.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
} as unknown as Storage

// Mock de sessionStorage (solo métodos necesarios)
globalThis.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
} as unknown as Storage

// Mock de location (solo propiedades necesarias)
globalThis.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: ''
} as Location

// Mock de IntersectionObserver (para lazy loading, infinite scroll, etc.)
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock de ResizeObserver (para componentes responsivos)
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock de console (útil para debugging en tests)
globalThis.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

/**
 * MOCKS DE LIBRERÍAS EXTERNAS
 */

// Mock de la instancia de API base (usado por todos los módulos)
vi.mock('@/core/api/instance', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}))

// Mock de Element Plus (usado en múltiples módulos)
vi.mock('element-plus', () => ({
  ElMessage: vi.fn(),
  ElMessageBox: vi.fn(),
  ElNotification: vi.fn(),
  ElLoading: vi.fn()
}))

// Mock de Vue Router (para evitar problemas de navegación en tests)
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn()
    }),
    useRoute: () => ({
      params: {},
      query: {},
      path: '/',
      name: undefined
    })
  }
})

/**
 * UTILIDADES PARA TESTING
 */

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

// Helper para simular llenado de formularios
export const fillForm = async (
  wrapper: VueWrapper<unknown>,
  formData: Record<string, string | boolean>
) => {
  for (const [field, value] of Object.entries(formData)) {
    const element = wrapper.find(`[data-test="${field}"]`)
    
    if (element.exists()) {
      if (typeof value === 'boolean') {
        // Para checkboxes, usar trigger con el evento change
        await element.trigger('click')
        if (!value) {
          // Si queremos desmarcar, hacer click nuevamente
          await element.trigger('click')
        }
      } else {
        // Para inputs de texto, usar setValue
        await element.setValue(value)
      }
    }
  }
}

// Helper para validar errores de formulario
export const expectFormErrors = async (
  wrapper: VueWrapper<unknown>,
  expectedErrors: string[]
) => {
  await vi.waitFor(() => {
    expectedErrors.forEach(error => {
      expect(wrapper.text()).toContain(error)
    })
  })
}

// Helper para limpiar mocks entre tests
export const clearMocks = () => {
  vi.clearAllMocks()
  
  // Limpiar localStorage/sessionStorage mocks
  vi.mocked(localStorage.getItem).mockClear()
  vi.mocked(localStorage.setItem).mockClear()
  vi.mocked(localStorage.removeItem).mockClear()
  vi.mocked(localStorage.clear).mockClear()
  
  vi.mocked(sessionStorage.getItem).mockClear()
  vi.mocked(sessionStorage.setItem).mockClear()
  vi.mocked(sessionStorage.removeItem).mockClear()
  vi.mocked(sessionStorage.clear).mockClear()
}
```

### Utilidades Globales de Testing

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

### Configuración por Módulo

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
    "test:anime": "vitest src/modules/anime/test/",
    "test:auth": "vitest src/modules/auth/test/",
    "test:shared": "vitest src/shared/test/",
    "test:unit": "vitest --run src/**/*.spec.ts",
    "test:components": "vitest --run src/**/index.spec.ts"
  }
}
```

### Mejores Prácticas de Configuración

**Enfoque de Mockeo: Selectivo vs Completo**

Nuestro setup utiliza **mockeo selectivo** en lugar de mockear todo `window` y `document`. Esta decisión está basada en experiencias reales y mejores prácticas de la comunidad.

**✅ Ventajas del Mockeo Selectivo (nuestro enfoque):**
- **Preserva funcionalidad real**: Mantiene el DOM real de jsdom
- **Mejor performance**: No sobrecarga el entorno de testing
- **Más estable**: Menos propenso a errores de compatibilidad
- **Fácil debugging**: Los errores son más claros y específicos
- **Mantenimiento simple**: Solo mockea lo que realmente necesitamos

**❌ Problemas del Mockeo Completo (window/document):**
- **Pérdida de funcionalidad**: Muchas APIs del navegador dejan de funcionar
- **Errores inesperados**: Tests que fallan por APIs no mockeadas
- **Mantenimiento complejo**: Hay que mantener mocks de muchas APIs
- **Performance degradada**: Overhead innecesario
- **Debugging difícil**: Errores confusos y difíciles de rastrear

**Ejemplo de problema real con mockeo completo:**
```typescript
// ❌ Problema: Mockear todo window rompe funcionalidad
Object.defineProperty(window, 'localStorage', { value: mockStorage })

// Resultado: Otros tests fallan porque:
// - getComputedStyle no funciona
// - addEventListener no funciona  
// - querySelector no funciona
// - etc.

// ✅ Solución: Mockeo selectivo
// localStorage NO se mockea - jsdom proporciona localStorage real
// Solo mockeamos APIs específicas que necesitamos
globalThis.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  // ... solo lo que necesitamos
} as unknown as Storage
```

**Testing de localStorage con jsdom real:**
```typescript
// ✅ Mejor práctica: Usar localStorage real de jsdom
describe('LocalStorage Tests', () => {
  beforeEach(() => {
    localStorage.clear() // Limpiar antes de cada test
  })

  it('should store and retrieve favorites', () => {
    localStorage.setItem('favorites', JSON.stringify([{ id: 1 }]))
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    expect(favorites).toHaveLength(1)
  })
})
```

**Organización de mocks**
- Mocks globales en `test/setup.ts`
- Mocks específicos por módulo en `src/modules/[module]/test/setup.ts`
- Factories reutilizables en `src/modules/[module]/test/factories/`

**Configuración de coverage**
- Thresholds realistas por tipo de código
- Exclusión de archivos de configuración y tipos
- Reportes en múltiples formatos para diferentes herramientas

**Optimización de performance**
- Uso de `globals: true` para acceso directo a APIs de testing
- Configuración de `environment: 'jsdom'` solo cuando sea necesario
- Mocks eficientes que no impacten la velocidad de ejecución

**Debugging y desarrollo**
- UI de testing para debugging visual
- Modo watch para desarrollo iterativo
- Reportes detallados para análisis de coverage



## Patrones y Mejores Prácticas

### **1. Patrón AAA (Arrange, Act, Assert)**

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

### **2. Testing Comportamiento Observable**

Testea lo que el usuario puede ver y hacer, no cómo funciona internamente el código.

#### **NO hacer esto (Testing detalles de implementación)**
- **Acceder directamente a propiedades internas** del componente
- **Llamar métodos internos** que el usuario no puede invocar
- **Verificar estado interno** que no es visible en la UI
- **Testear implementación específica** en lugar de comportamiento

#### **Hacer esto (Testing comportamiento observable)**
- **Verificar que el usuario ve** la información correcta en pantalla
- **Simular interacciones reales** del usuario (clicks, formularios, navegación)
- **Validar cambios visuales** que el usuario puede observar
- **Testear eventos emitidos** para comunicación entre componentes
- **Usar selectores accesibles** como `getByRole()`, `getByLabelText()`

**Ejemplo conceptual:**
- **Mal**: Verificar que `isFavorite` es `true` internamente
- **Bien**: Verificar que el usuario ve el ícono de corazón lleno (❤️) y el texto "Remove from favorites"

### **3. Mock Pattern (Test Doubles)**
Simular dependencias externas para aislar la unidad de código

```typescript
// Mock de servicios externos
vi.mock('@/core/api/instance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

// Mock de APIs del navegador
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock de librerías de terceros
vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))
```

### **4. NO Mockear el Either**
**Importante**: El patrón Either NO debe ser mockeado. Usa la implementación real.

```typescript
// ✅ CORRECTO
import { right, left } from '@/core/either'

const successResponse = right({ data: [createMockAnime()] })
const failureResponse = left({ 
  code: 'API_ERROR', 
  reason: 'NETWORK_ERROR', 
  status: 500, 
  message: 'API Error' 
})

// INCORRECTO
const mockEither = {
  _tag: 'Right',
  value: data,
  isRight: () => true,
  fold: vi.fn()
}
```

**¿Por qué NO mockear Either?**
- **Funcionalidad completa**: El Either real tiene toda la funcionalidad necesaria
- **Tests más realistas**: Pruebas el comportamiento real del patrón
- **Menos mantenimiento**: No necesitas mantener mocks complejos
- **Mejor debugging**: Los errores son más claros con la implementación real

### **5. Testing de localStorage**

**Enfoque recomendado: localStorage real de jsdom**

Basándonos en las mejores prácticas de [RunThatLine](https://runthatline.com/vitest-mock-localstorage/) y [Medium](https://medium.com/@criszamcham/test-cases-with-jest-local-storage-and-dom-mock-f9144ae9c63c), **jsdom proporciona localStorage real** y es mejor usarlo que mockearlo.

**¿Por qué usar localStorage real?**
- **Más realista**: Simula el comportamiento real del navegador
- **Menos mantenimiento**: No necesitas mantener mocks complejos
- **Mejor testing**: Pruebas el código real, no mocks
- **Aislamiento simple**: Solo necesitas `localStorage.clear()` en `beforeEach`

**Patrón recomendado:**
```typescript
describe('LocalStorage Tests', () => {
  beforeEach(() => {
    localStorage.clear() // Limpiar antes de cada test
  })

  it('should store and retrieve data', () => {
    // Arrange
    const favorites = [{ id: 1, title: 'Anime 1' }]
    
    // Act
    localStorage.setItem('favorites', JSON.stringify(favorites))
    const retrieved = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    // Assert
    expect(retrieved).toHaveLength(1)
    expect(retrieved[0].id).toBe(1)
  })

  it('should handle empty localStorage', () => {
    // Act
    const result = localStorage.getItem('nonexistent')
    
    // Assert
    expect(result).toBeNull()
  })
})
```

**Spying en localStorage (opcional):**
```typescript
describe('LocalStorage with Spying', () => {
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

  beforeEach(() => {
    localStorage.clear()
    getItemSpy.mockClear()
    setItemSpy.mockClear()
  })

  it('should call localStorage methods correctly', () => {
    // Act
    localStorage.setItem('key', 'value')
    localStorage.getItem('key')
    
    // Assert
    expect(setItemSpy).toHaveBeenCalledWith('key', 'value')
    expect(getItemSpy).toHaveBeenCalledWith('key')
  })
})
```

**Cuándo mockear localStorage:**
Solo mockea localStorage cuando necesites:
- Simular errores específicos de localStorage
- Control total sobre el comportamiento
- Testing de casos edge muy específicos

### **7. Testing de Vue Router**

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

### **8. Testing de Operaciones Asíncronas**
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

### **6. Testing de Formularios**

**Patrones para testing de formularios complejos:**

```typescript
describe('RegisterForm', () => {
  it('should validate required fields', async () => {
    // Arrange
    const wrapper = shallowMount(RegisterForm)
    
    // Act
    await wrapper.find('form').trigger('submit')
    
    // Assert
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('should submit form with valid data', async () => {
    // Arrange
    const wrapper = shallowMount(RegisterForm)
    
    // Act
    await wrapper.find('[data-test="email"]').setValue('test@example.com')
    await wrapper.find('[data-test="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit')
    
    // Assert
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
```

### **7. Testing de Router y Navigation**

**Patrones para testing de navegación:**

```typescript
describe('Navigation', () => {
  it('should navigate to detail page on click', async () => {
    // Arrange
    const mockRouter = { push: vi.fn() }
    const wrapper = shallowMount(AnimeCard, {
      props: { anime: createMockAnime() },
      global: { mocks: { $router: mockRouter } }
    })
    
    // Act
    await wrapper.find('[data-test="anime-link"]').trigger('click')
    
    // Assert
    expect(mockRouter.push).toHaveBeenCalledWith('/anime/1')
  })
})
```

**Ejemplo de Test de Template (Renderizado):**
```typescript
describe('AnimeCard Template', () => {
  it('should render anime information correctly', () => {
    // Arrange - Solo testing del template
    render(AnimeCard, {
      props: { anime: createMockAnime() }
    })
    
    // Assert - Verificar que se renderiza correctamente
    expect(screen.getByText('Test Anime')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument()
  })

  it('should emit events when user interacts', async () => {
    // Arrange
    const user = userEvent.setup()
    render(AnimeCard, {
      props: { anime: createMockAnime() }
    })
    
    // Act - Interacción de usuario
    await user.click(screen.getByRole('button', { name: /add to favorites/i }))
    
    // Assert - Verificar que se emite el evento
    // Nota: Para testing de eventos, aún necesitas usar Vue Test Utils
    // o crear un wrapper que capture los eventos
  })
})
```

### **8. Testing de Componentes Vue (Component Testing)**

**Herramienta recomendada**: [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)

**Enfoque**: Testing centrado en el usuario, no en detalles de implementación

**Estrategias de Testing**:
- **render**: Para testing de template y accesibilidad (recomendado)
- **fireEvent**: Para simular interacciones reales del usuario
- **screen**: Para buscar elementos como lo haría un usuario

**Testing de Slots y Scoped Slots:**
```typescript
it('should render default slot content', () => {
  const wrapper = shallowMount(BaseCard, {
    slots: {
      default: '<div>Test Content</div>'
    }
  })
  expect(wrapper.text()).toContain('Test Content')
})

it('should render scoped slot with correct data', () => {
  const wrapper = shallowMount(AnimeCard, {
    scopedSlots: {
      footer: '<div>{{ props.anime.title }}</div>'
    }
  })
  expect(wrapper.text()).toContain('Test Anime')
})
```

**Testing de Eventos Personalizados:**
```typescript
it('should emit custom event with correct payload', async () => {
  const wrapper = shallowMount(AnimeCard, {
    props: { anime: createMockAnime() }
  })
  
  await wrapper.find('[data-test="favorite-btn"]').trigger('click')
  
  expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
  expect(wrapper.emitted('toggle-favorite')[0]).toEqual([{ id: 1 }])
})
```

### **9. Testing de Integración (Limitado)**

**⚠️ IMPORTANTE: Tests de integración limitados**

Basándonos en el principio "Write tests. Not too many. Mostly integration" de Kent C. Dodds, los tests de integración deben ser **limitados y estratégicos**.

**¿Cuándo usar Integration Tests?**
- **Comunicación entre componentes padre-hijo**
- **Flujos de usuario críticos** (máximo 2-3 por módulo)
- **Integración con stores** (solo casos edge)
- **Validación de formularios complejos**

**❌ NO usar para:**
- Cada interacción de componente
- Todas las combinaciones de props
- Casos que ya están cubiertos por unit tests

**Ejemplo de Integration Test (Limitado):**
```typescript
describe('Anime List Integration', () => {
  it('should load and display anime list with favorites integration', async () => {
    // Arrange - Solo para flujos críticos
    const wrapper = mount(AnimeList, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    
    // Act
    await wrapper.vm.$nextTick()
    
    // Assert - Solo verificar integración, no detalles
    expect(wrapper.findComponent(AnimeCard)).toBeTruthy()
    expect(wrapper.find('[data-test="favorite-count"]').text()).toBe('0')
  })
})
```

### **10. Testing de Formularios**

**Patrones para Formularios:**
- **Validación de campos requeridos**
- **Manejo de errores de validación**
- **Submit y reset**
- **Integración con v-model**

**Ejemplo de Test de Formulario:**
```typescript
describe('RegisterForm', () => {
  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(RegisterForm)
    
    // Act
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Assert
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    render(RegisterForm)
    
    // Arrange
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    // Act
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Assert
    // Verificar que el formulario se envió correctamente
    // Esto dependerá de cómo manejes el submit en tu componente
  })
})
```

### **11. Testing de Router y Navigation**

**Mocking de Router:**
```typescript
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  currentRoute: { value: { path: '/anime' } }
}

// Para Vue Testing Library, usa mocks de useRouter
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => ({
    params: {},
    query: {},
    path: '/anime',
    name: undefined
  })
}))

render(Component)
```

**Testing de Navigation:**
```typescript
it('should navigate to detail page on click', async () => {
  const user = userEvent.setup()
  render(AnimeCard, {
    props: { anime: createMockAnime() },
    global: {
      plugins: [router]
    }
  })
  
  await user.click(screen.getByRole('link', { name: /anime detail/i }))
  
  expect(router.currentRoute.value.path).toBe('/anime/1')
})
```

### **12. Testing de Operaciones Asíncronas**

**Patrones para Async Testing:**
- **waitFor**: Para operaciones asíncronas
- **flushPromises**: Para promises pendientes
- **vi.runAllTimers**: Para timers y debounce

**Ejemplo:**
```typescript
it('should handle async data loading', async () => {
  const wrapper = shallowMount(AsyncComponent)
  
  // Act
  await wrapper.vm.loadData()
  await flushPromises()
  
  // Assert
  expect(wrapper.vm.isLoading).toBe(false)
  expect(wrapper.vm.data).toBeTruthy()
})

it('should handle debounced search', async () => {
  const wrapper = shallowMount(SearchComponent)
  
  // Act
  await wrapper.find('input').setValue('anime')
  vi.runAllTimers()
  await flushPromises()
  
  // Assert
  expect(wrapper.vm.searchResults).toHaveLength(1)
})
```

## Métricas de Cobertura

**¿Qué es Coverage?**
El coverage mide qué porcentaje del código está siendo ejecutado por los tests. Es una métrica que ayuda a identificar código no probado, pero no garantiza calidad.

**Importante:** En proyectos en migración, es normal tener coverage bajo inicialmente. Los siguientes porcentajes son **metas a alcanzar gradualmente**.

### **Objetivos por Tipo**

#### **Stores: 80-90%** (Lógica de negocio crítica)
```typescript
// Ejemplo: Lógica de negocio en stores
export const useAnimeStore = defineStore('anime', () => {
  const favorites = ref<Anime[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const addToFavorites = (anime: Anime) => {
    const exists = favorites.value.find(f => f.mal_id === anime.mal_id)
    if (!exists) {
      favorites.value.push(anime)
    }
  }

  const removeFromFavorites = (animeId: number) => {
    const index = favorites.value.findIndex(f => f.mal_id === animeId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  return { favorites, loading, error, addToFavorites, removeFromFavorites }
})
```

#### **Composables: 70-80%** (Lógica de UI)
```typescript
// Ejemplo: Lógica de UI en composables
export const useAnimeCard = (props: AnimeCardProps) => {
  // Esta lógica SÍ se debe probar
  const animeSubtitle = computed(() => {
    const parts = []
    if (props.anime.type) parts.push(props.anime.type)
    if (props.anime.status) parts.push(props.anime.status)
    return parts.join(' • ')
  })
  
  return { animeSubtitle }
}
```

#### **Utils: 80-90%** (Transformaciones)
```typescript
// Ejemplo: Funciones de utilidad
export const formatNumber = (num: number): string => {
  // Esta lógica SÍ se debe probar
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}
```

#### **Components: 50-70%** (Interacciones complejas)
```typescript
<!-- Ejemplo: Componente con lógica compleja -->
<template>
  <button @click="handleClick" :disabled="isLoading">
    {{ isLoading ? 'Cargando...' : 'Guardar' }}
  </button>
</template>

<script setup>
//  Esta lógica SÍ se debe probar
const handleClick = async () => {
  isLoading.value = true
  try {
    await saveData()
    showSuccess()
  } catch (error) {
    showError(error)
  } finally {
    isLoading.value = false
  }
}
</script>
```

#### **Services: 30-50%** (Manejo de Either y errores)
```typescript
// Ejemplo: Servicio con patrón Either
export const animeApi = {
  getAnimeById(id: number): Promise<ApiResult<AnimeDetailResponse>> {
    return executeRequest(() => 
      http.get<AnimeDetailResponse>(`/anime/${id}`)
    )
  }
}

// SÍ probar: Manejo de Either en el store (patrón fold)
const result = await animeApi.getAnimeById(1)
const data = result.fold(
  (failure) => {
    handleApiError(failure)
    return undefined
  },
  (success) => success.data
)

// SÍ probar: Manejo de Either en composables (patrón isRight/isLeft)
const result = await animeApi.getAnimeCharacters(animeId)
if (result.isRight()) {
  characters.value = result.value.data.data.slice(0, 12)
} else {
  charactersError.value = result.value.message
}
```

**¿Por qué 30-50% con Either?**
- **❌ NO probar**: La lógica de `executeRequest` (ya probada en core/either)
- **❌ NO probar**: Las llamadas HTTP reales (responsabilidad del backend)
- **❌ NO probar**: Mockear el Either (usa la implementación real)
- **✅ SÍ probar**: Casos edge específicos del servicio
- **✅ SÍ probar**: Transformaciones de datos si las hay
- **✅ SÍ probar**: Validaciones específicas del dominio
- **✅ SÍ probar**: Manejo de Either en stores y composables

### **Lo que NO contar**
- Archivos de configuración
- Factories de testing
- Archivos de tipos (.d.ts)
- Setup de tests
- Mocks y stubs

### **Testing con Patrón Either**

**¿Por qué usar Either en testing?**
El patrón Either proporciona un manejo funcional de errores que hace los tests más predecibles y legibles. **NO necesitas mockear el Either** - usa la implementación real.

**Patrones reales del proyecto:**

#### **1. Patrón Fold (Stores)**
```typescript
// Como se usa en anime.store.ts
const result = await animeApi.getAnimeList(params)
const data = result.fold(
  (failure) => {
    handleApiError(failure)
    return undefined
  },
  (success) => success.data
)
```

#### **2. Patrón isRight/isLeft (Composables)**
```typescript
// Como se usa en useAnimeDetail.ts
const result = await animeApi.getAnimeCharacters(animeId)
if (result.isRight()) {
  characters.value = result.value.data.data.slice(0, 12)
} else {
  charactersError.value = result.value.message
}
```

**¿Qué probar en servicios con Either?**
```typescript
// SÍ probar: Existencia y firma de funciones
describe('Anime Services', () => {
  it('has getAnimeList function', () => {
    expect(typeof animeApi.getAnimeList).toBe('function')
  })

  it('should accept correct parameters for getAnimeById', () => {
    expect(() => {
      animeApi.getAnimeById(123)
    }).not.toThrow()
  })

  it('should return Promise for all API methods', () => {
    const result = animeApi.getAnimeList({})
    expect(result).toBeInstanceOf(Promise)
  })
})

// SÍ probar: Manejo de Either en stores (patrón fold)
describe('Anime Store with Either', () => {
  it('should handle success response correctly', async () => {
    // Arrange
    const mockResponse = right({ data: [], pagination: { items: { total: 0 } } })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
    
    // Act
    await store.loadAnimeList()
    
    // Assert
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle error response correctly', async () => {
    // Arrange
    const mockResponse = left({ 
      code: 'API_ERROR', 
      reason: 'NETWORK_ERROR', 
      status: 500, 
      message: 'API Error' 
    })
    vi.mocked(animeApi.getAnimeList).mockResolvedValue(mockResponse)
    
    // Act
    await store.loadAnimeList()
    
    // Assert
    expect(store.error).toBe('Error en el módulo de anime')
    expect(store.isLoading).toBe(false)
  })
})

// SÍ probar: Manejo de Either en composables (patrón isRight/isLeft)
describe('useAnimeDetail with Either', () => {
  it('should load characters successfully', async () => {
    // Arrange
    const mockResponse = right({ 
      data: { data: [createMockCharacter()] } 
    })
    vi.mocked(animeApi.getAnimeCharacters).mockResolvedValue(mockResponse)
    
    // Act
    const { result } = renderComposable(() => useAnimeDetail())
    await result.current.loadCharacters(1)
    
    // Assert
    expect(result.current.characters.value).toHaveLength(1)
    expect(result.current.charactersError.value).toBeNull()
  })

  it('should handle character loading error', async () => {
    // Arrange
    const mockResponse = left({ 
      code: 'API_ERROR', 
      reason: 'NETWORK_ERROR', 
      status: 500, 
      message: 'Failed to load characters' 
    })
    vi.mocked(animeApi.getAnimeCharacters).mockResolvedValue(mockResponse)
    
    // Act
    const { result } = renderComposable(() => useAnimeDetail())
    await result.current.loadCharacters(1)
    
    // Assert
    expect(result.current.characters.value).toHaveLength(0)
    expect(result.current.charactersError.value).toBe('Failed to load characters')
  })
})
```

## Comandos de Testing

### **Ejecución de Tests**
```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests con coverage
yarn test --coverage

# Ejecutar tests en modo watch
yarn test --watch

# Ejecutar tests específicos
yarn test src/modules/anime/test/

# Ejecutar tests con UI
yarn test --ui
```

### **Análisis de Coverage**
```bash
# Ver reporte de coverage
yarn test --coverage --reporter=html

# Ver coverage en consola
yarn test --coverage --reporter=text
```

## Recursos y Referencias

### **Artículos Fundamentales**
- [Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests) - Kent C. Dodds
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) - Kent C. Dodds
- [The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy) - Kent C. Dodds

### **Documentación Oficial**
- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing) - Guía oficial de testing en Vue
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/) - Herramienta recomendada para component testing

### **Vue 3 Testing Específico**
- [Vue Testing Guide](https://vuejs.org/guide/scaling-up/testing) - Documentación oficial de Vue
- [Testing Vue Components with Vitest](https://dev.to/jacobandrewsky/testing-vue-components-with-vitest-5c21) - Jacob Andrewsky
- [Testing Vue Composables Lifecycle](https://dylanbritz.dev/writing/testing-vue-composables-lifecycle/) - Dylan Britz
- [Good Practices for Vue Composables](https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk) - Jacob Andrewsky
- [Vue Test Utils Advanced Guide](https://test-utils.vuejs.org/guide/advanced/reusability-composition) - Documentación oficial

### **Vue Router Testing**
- [Vue Test Utils - Using with Vue Router](https://v1.test-utils.vuejs.org/guides/using-with-vue-router.html) - Documentación oficial
- [Vue Testing Handbook - Vue Router](https://lmiller1990.github.io/vue-testing-handbook/vue-router.html) - Guía completa de testing de router
- [Unit Testing Vue Router](https://medium.com/js-dojo/unit-testing-vue-router-1d091241312) - Mejores prácticas específicas

### **Mejores Prácticas de Testing**
- [How I Started Writing Unit Tests for Vue Components](https://www.byteminds.co.uk/blog/how-i-started-writing-unit-tests-for-vue-components) - Byteminds
- [Vue.js Testing with Vue Test Utils and Vitest](https://vueschool.io/articles/vuejs-tutorials/vue-js-testing-with-vue-test-utils-and-vitest/) - Vue School
- [Realiza Pruebas Unitarias con Vitest y Vue Test Utils](https://codingpr.com/es/realiza-pruebas-unitarias-con-vitest-y-vue-test-utils/) - CodingPR

---

**Nota sobre las referencias**: Esta documentación está basada en las mejores prácticas establecidas por la comunidad Vue y los principios de testing moderno. Todas las referencias han sido seleccionadas por su relevancia y autoridad en el tema. La frase clave "Si un usuario no puede hacerlo, tu prueba tampoco debería poder hacerlo" es fundamental para entender el enfoque de testing centrado en el usuario.

## Mejores Prácticas Específicas de Vue 3

### **1. Testing de Composables (Unit Testing)**

**Enfoque recomendado según [Vue.js Official Guide](https://vuejs.org/guide/scaling-up/testing):**

Para testing de composables, se recomienda testing directo cuando solo usan Reactivity APIs:

```typescript
// ✅ Mejor - Testing directo del composable
import { renderComposable } from '@testing-library/vue'
import { useAnimeCard } from './useAnimeCard'

describe('useAnimeCard', () => {
  it('should handle favorite toggle', async () => {
    const { result } = renderComposable(() => useAnimeCard({ anime: mockAnime }))
    
    expect(result.current.isFavorite).toBe(false)
    await result.current.toggleFavorite()
    expect(result.current.isFavorite).toBe(true)
  })
})

// ❌ Evitar - Crear componente solo para testear composable
const TestComponent = defineComponent({
  setup() {
    return useAnimeCard({ anime: mockAnime })
  },
  template: '<div></div>'
})
```

### **2. Testing de Reactivity**

**Patrones para testing de reactividad:**
```typescript
describe('Reactive State', () => {
  it('should update computed when reactive data changes', async () => {
    const { result } = renderComposable(() => {
      const count = ref(0)
      const doubled = computed(() => count.value * 2)
      
      return { count, doubled }
    })
    
    expect(result.current.doubled).toBe(0)
    
    result.current.count = 5
    await nextTick()
    
    expect(result.current.doubled).toBe(10)
  })
})
```

### **3. Testing de Lifecycle Hooks**

**Patrones para testing de lifecycle:**
```typescript
describe('Lifecycle Hooks', () => {
  it('should cleanup on unmount', () => {
    const cleanupSpy = vi.fn()
    
    const { unmount } = renderComposable(() => {
      onUnmounted(cleanupSpy)
      return {}
    })
    
    unmount()
    expect(cleanupSpy).toHaveBeenCalled()
  })
})
```

### **4. Testing de Watchers**

**Patrones para testing de watchers:**
```typescript
describe('Watchers', () => {
  it('should react to watched value changes', async () => {
    const callback = vi.fn()
    
    const { result } = renderComposable(() => {
      const value = ref('initial')
      watch(value, callback)
      
      return { value }
    })
    
    result.current.value = 'changed'
    await nextTick()
    
    expect(callback).toHaveBeenCalledWith('changed', 'initial')
  })
})
```

### **5. Testing de Props y Emits**

**Patrones para testing de props y emits:**
```typescript
describe('Props and Emits', () => {
  it('should emit events with correct payload', async () => {
    const wrapper = shallowMount(AnimeCard, {
      props: { anime: mockAnime }
    })
    
    await wrapper.find('[data-test="favorite-btn"]').trigger('click')
    
    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
    expect(wrapper.emitted('toggle-favorite')[0]).toEqual([mockAnime])
  })
})
```

## Configuración Técnica

### **Setup Global (test/setup.ts)**
```typescript
import { vi } from 'vitest'
import { createTestPinia } from '@pinia/testing'

// Mocks globales
vi.mock('vue-router')
vi.mock('@/core/api/instance')
vi.mock('element-plus')

// Configuración de Pinia
export const createTestStore = () => createTestPinia({
  stubActions: false,
  createSpy: vi.fn
})

// Mocks de DOM
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})
```

### **Vitest Config (vitest.config.ts)**
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

## Checklist de Calidad

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

## Anti-Patrones a Evitar

### **1. Testing Implementation Details**
Basándonos en las [mejores prácticas de Vue testing](https://github.com/tomosterlund/vue-testing-best-practices), **NO** testees detalles de implementación:

```typescript
// ❌ NO hacer esto - Testing implementation details
it('should call setState with correct params', () => {
  const setState = vi.fn()
  component.setState = setState
  
  component.updateData()
  
  expect(setState).toHaveBeenCalledWith({ data: 'value' })
})

// ✅ Hacer esto - Testing observable behavior
it('should show loading state when updating data', async () => {
  const wrapper = shallowMount(Component)
  
  await wrapper.find('[data-test="update-btn"]').trigger('click')
  
  expect(wrapper.find('[data-test="loading"]').exists()).toBe(true)
})
```

### **2. Testing Local State Directamente**
```typescript
// ❌ NO hacer esto - Testing internal state
it('should set hasAlternativeAddress to true', async () => {
  const wrapper = shallowMount(CustomerData)
  const checkbox = wrapper.find('[data-test="alternative-address-checkbox"]')
  
  await checkbox.trigger('click')
  
  expect(wrapper.vm.hasAlternativeAddress).toBe(true) // ❌ Internal state
})

// ✅ Hacer esto - Testing observable DOM changes
it('should show alternative address form when checkbox is checked', async () => {
  const wrapper = shallowMount(CustomerData)
  const checkbox = wrapper.find('[data-test="alternative-address-checkbox"]')
  
  await checkbox.trigger('click')
  await wrapper.vm.$nextTick()
  
  expect(wrapper.find('[data-test="alternative-address-form"]').exists()).toBe(true) // ✅ Observable
})
```

### **3. Invoking Component Methods Directly**
```typescript
// ❌ NO hacer esto - Calling methods directly
it('should navigate to checkout when calling goToCheckout', async () => {
  const wrapper = shallowMount(Cart)
  
  await wrapper.vm.goToCheckout() // ❌ Direct method call
  
  expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/checkout')
})

// ✅ Hacer esto - Triggering user interactions
it('should navigate to checkout when clicking checkout button', async () => {
  const wrapper = shallowMount(Cart)
  const checkoutButton = wrapper.find('[data-test="checkout-button"]')
  
  await checkoutButton.trigger('click') // ✅ User interaction
  
  expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/checkout')
})
```

### **4. Mocks Excesivos**
```typescript
// ❌ NO hacer esto - Demasiados mocks
vi.mock('@/api/userService')
vi.mock('@/api/emailService')
vi.mock('@/api/notificationService')
vi.mock('@/api/auditService')
vi.mock('@/api/analyticsService')

// ✅ Hacer esto - Mock solo lo necesario
vi.mock('@/core/api/instance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))
```

### **5. Tests Frágiles**
```typescript
// ❌ NO hacer esto - Depende de valores específicos
it('should return correct data', () => {
  const result = service.getData()
  expect(result).toEqual({
    id: 1,
    name: 'Specific Name',
    timestamp: '2024-01-01T00:00:00Z' // ❌ Fragile timestamp
  })
})

// ✅ Hacer esto - Testing structure, not specific values
it('should return data with correct structure', () => {
  const result = service.getData()
  expect(result).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
  })
})
```

### **6. Coverage Obsesivo**
```typescript
// ❌ NO hacer esto - Testear getters/setters simples
it('should return the value', () => {
  const value = getValue()
  expect(value).toBe('expected')
})

// ✅ Hacer esto - Testing business logic
it('should format number correctly', () => {
  expect(formatNumber(1000)).toBe('1.0K')
  expect(formatNumber(1500000)).toBe('1.5M')
})
```

### **7. Integration Tests Excesivos**
```typescript
// ❌ NO hacer esto - Too many integration tests
describe('Anime List Integration', () => {
  it('should load anime list') { /* ... */ }
  it('should filter anime list') { /* ... */ }
  it('should sort anime list') { /* ... */ }
  it('should paginate anime list') { /* ... */ }
  it('should search anime list') { /* ... */ }
  // ... 10 more integration tests
})

// ✅ Hacer esto - Limited integration tests
describe('Anime List Integration', () => {
  it('should load and display anime list with favorites integration', async () => {
    // Solo el flujo crítico principal
  })
})
```

### **8. Vue Router Anti-Patrones**
```typescript
// ❌ NO hacer esto - Usar Vue Test Utils en lugar de Vue Testing Library
import { mount } from '@vue/test-utils'
const wrapper = mount(Component, { router })

// ✅ Hacer esto - Usar Vue Testing Library
import { render, screen } from '@testing-library/vue'
render(Component, { global: { plugins: [router] } })
```

```typescript
// ❌ NO hacer esto - No esperar router.isReady()
const router = createRouter({ history: createWebHistory(), routes })
render(Component, { global: { plugins: [router] } })
// Router puede no estar listo

// ✅ Hacer esto - Siempre esperar router.isReady()
const router = createRouter({ history: createWebHistory(), routes })
await router.isReady()
render(Component, { global: { plugins: [router] } })
```

```typescript
// ❌ NO hacer esto - Testing implementación de router
it('should call router.push with correct params', () => {
  const mockRouter = { push: vi.fn() }
  // Testea detalles internos, no comportamiento
})

// ✅ Hacer esto - Testing comportamiento observable
it('should navigate to detail page when clicking link', async () => {
  const user = userEvent.setup()
  await user.click(screen.getByRole('link', { name: /anime detail/i }))
  expect(router.currentRoute.value.path).toBe('/anime/1')
})
```

```typescript
// ❌ NO hacer esto - No limpiar estado entre tests
describe('Router Tests', () => {
  it('should navigate to page 1', async () => {
    await router.push('/page1')
    // Test continúa con estado del test anterior
  })
})

// ✅ Hacer esto - Limpiar estado
describe('Router Tests', () => {
  beforeEach(async () => {
    await router.push('/') // Reset a estado inicial
    await router.isReady()
  })
})
```

## Métricas de Éxito

### **Indicadores de Calidad**
<!-- confirmar si esta información es real -->
- **Tiempo de ejecución**: < 10 segundos para todo el proyecto
- **Cobertura efectiva**: > 70% en lógica de negocio
- **Tests fallando**: < 5% en builds
- **Mantenibilidad**: Tests que no se rompen con refactoring
- **Velocidad de desarrollo**: Tests que aceleran el desarrollo

### **Señales de Alerta**
<!-- confirmar si esta informacion es real -->
- Tests que tardan > 1 segundo cada uno
- Mocks que representan > 50% del código de test
- Tests que se rompen con cambios menores
- Cobertura < 50% en componentes críticos
- Tests que no agregan valor real

## Proceso de Desarrollo

<!-- mejorar esto -->

**Última actualización**: Enero 2025  
**Autor actualización**: Anderson Mesa
**Autor**: Andersson Mesa
**Responsable**: Equipo de Desarrollo  
**Versión**: 1.0.0  

---

## Ejemplo recomendado: Testing de componentes y stores con Pinia y mockeo de getters

> **Referencia:**  
> - [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing)  
> - [@pinia/testing en npm](https://www.npmjs.com/package/@pinia/testing)  
> - [Mastering Pinia](https://masteringpinia.com/blog/my-top-5-tips-for-using-pinia)

### 1. Mockeo de getters en stores Pinia

Cuando un getter es `readonly` (por ejemplo, `isAuthenticated` en el store de auth), se debe mockear con `vi.spyOn(store, 'getter', 'get')` para controlar su valor en los tests:

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAnimeStore } from '@/modules/anime/stores/anime.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { render, screen } from '@testing-library/vue'
import AnimeCard from '@/modules/anime/components/AnimeCard'
import { createMockAnime } from '../factories/anime.factory'
import { vi } from 'vitest'

describe('AnimeCard Template', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('muestra el botón de favoritos si el usuario está autenticado', () => {
    // Arrange
    const anime = createMockAnime()
    const animeStore = useAnimeStore()
    const authStore = useAuthStore()
    vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
    animeStore.favorites = []
    render(AnimeCard, { props: { anime } })
    // Assert
    expect(screen.getByTestId('button:toggle-favorite')).toBeInTheDocument()
  })

  it('muestra el botón de login si el usuario NO está autenticado', () => {
    const anime = createMockAnime()
    const animeStore = useAnimeStore()
    const authStore = useAuthStore()
    vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(false)
    animeStore.favorites = []
    render(AnimeCard, { props: { anime } })
    expect(screen.getByTestId('button:login-required')).toBeInTheDocument()
  })
})
```

### 2. Uso de factories centralizados

Siempre utiliza factories centralizados para crear datos de prueba, así evitas duplicación y facilitas el mantenimiento:

```typescript
// src/modules/anime/test/factories/anime.factory.ts
export function createMockAnime(overrides = {}) {
  return {
    mal_id: 1,
    title: 'Test Anime',
    images: { jpg: { large_image_url: 'https://example.com/anime.jpg' } },
    genres: [{ name: 'Action' }],
    ...overrides
  }
}
```

Y en los tests:

```typescript
import { createMockAnime } from '../factories/anime.factory'

const anime = createMockAnime({ title: 'Naruto' })
```

### 3. Testing de comportamiento observable

No testees detalles internos ni accedas a estado privado. Simula siempre la interacción real del usuario y valida lo que ve en la UI:

```typescript
import userEvent from '@testing-library/user-event'

it('permite agregar a favoritos al hacer click', async () => {
  const anime = createMockAnime()
  const animeStore = useAnimeStore()
  const authStore = useAuthStore()
  vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
  animeStore.favorites = []
  render(AnimeCard, { props: { anime } })

  const user = userEvent.setup()
  await user.click(screen.getByTestId('button:toggle-favorite'))

  // Verifica el cambio observable (por ejemplo, el ícono cambia o se emite un evento)
  expect(animeStore.favorites).toContainEqual(anime)
})
```

---

### **Resumen de buenas prácticas**

- Mockea getters con `vi.spyOn(..., 'getter', 'get')` cuando sean readonly.
- Inicializa los stores con `setActivePinia(createPinia())` en cada test.
- Usa factories centralizados para todos los datos de prueba.
- Testea solo el comportamiento observable, nunca detalles internos.
- Limpia los mocks con `vi.clearAllMocks()` en cada test.
- Usa `@pinia/testing` para facilitar la integración de stores en los tests.
