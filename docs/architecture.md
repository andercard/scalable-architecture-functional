# Lineamientos de Arquitectura Modular para el Frontend B2B

**Última actualización**: Julio 16 2025  
**Autor actualización**: Anderson Mesa  
**Autor**: Andersson Mesa  
**Responsable**: Equipo de Desarrollo

## Índice

- Sección 1: Visión General
- Sección 2: Principios de la Arquitectura Modular
- Sección 3: Estructura Plana Inteligente
- Sección 4: Gestión de Estado Local Complejo
- Sección 5: Convenciones de Nomenclatura de Archivos
- Sección 7: Gestión de la Capa de API
- Sección 8: Gestión de Estilos (CSS)
- Sección 9: Gestión de Dependencias Externas
- Sección 10: Testing

---

## Sección 1: Visión General

En el desarrollo de aplicaciones frontend modernas, la complejidad crece exponencialmente con el tamaño del proyecto. Nos enfrentamos a desafíos como código disperso, dependencias complejas, dificultades de testing y una curva de aprendizaje elevada para nuevos desarrolladores. Para superar estos obstáculos y construir una plataforma escalable y mantenible, hemos adoptado una **arquitectura híbrida moderna** que combina los mejores principios de múltiples enfoques.

### Nuestra Arquitectura: Una Fusión de Mejores Prácticas

Nuestra arquitectura es el resultado de años de experiencia y evolución, combinando:

#### **1. Arquitectura Modular por Dominios**
Cada funcionalidad de negocio se encapsula en su propio módulo independiente. Esto permite que diferentes equipos trabajen en paralelo sin conflictos, acelera el desarrollo y facilita el mantenimiento.

#### **2. Atomic Design Adaptado**
Hemos adaptado los principios de Atomic Design con una nomenclatura más intuitiva:
- **Components** → Átomos: Lógica básica y componentes simples
- **Sections** → Organismos: Unificación de múltiples componentes
- **Views** → Templates: Organización de varias secciones
- **Pages** → Páginas: Las páginas reales de la aplicación

#### **3. Separación SCF (Script-Component-File)**
Para mejorar la testabilidad y mantenibilidad, cada componente se divide en tres archivos:
- **`index.vue`**: Template y estructura
- **`use[Component].ts`**: Lógica reactiva y composables
- **`[component].style.scss`**: Estilo específico

#### **4. Estructura Flat Inteligente**
Evitamos anidamientos excesivos que complican la navegación. Todos los archivos de un mismo tipo (pages, sections, components, views, types, stores, services, errors) se mantienen al mismo nivel dentro del módulo.

#### **5. Core y Shared Centralizados**
- **`core/`**: Infraestructura fundamental que define cómo opera la aplicación (router, API, patrones arquitectónicos, configuración global)
- **`shared/`**: Recursos específicos de la aplicación reutilizables entre módulos (componentes UI, composables, utilidades del proyecto)

#### **Beneficios Estratégicos**

La arquitectura híbrida implementada en este proyecto aporta ventajas técnicas clave, alineadas con las mejores prácticas y las reglas arquitectónicas definidas:

- **Mantenibilidad**: Los cambios y errores se aíslan dentro de sus respectivos módulos, facilitando la corrección y evolución del sistema.
- **Escalabilidad**: Las nuevas funcionalidades se desarrollan como módulos independientes, permitiendo el crecimiento del proyecto sin afectar otras áreas.
- **Testabilidad**: La separación SCF simplifica la creación de pruebas unitarias y de integración, mejorando la calidad del software.
- **Colaboración**: La estructura modular permite que varios equipos trabajen en paralelo sin generar conflictos ni dependencias innecesarias.
- **Predictibilidad**: Una estructura consistente y estandarizada reduce la curva de aprendizaje y facilita la incorporación de nuevos desarrolladores.
- **Rendimiento**: La modularidad favorece la implementación de lazy loading y otras optimizaciones, mejorando la eficiencia de la aplicación.

#### **Objetivo Principal**

Transformar nuestra base de código en un **sistema de módulos cohesivos e independientes** que acelere la entrega de valor, reduzca costos de mantenimiento y construya una plataforma escalable que soporte el crecimiento del negocio a largo plazo.

## **Sección 2: Principios de la Arquitectura Modular**

Adoptar una arquitectura modular es una decisión estratégica que impacta directamente en la salud y evolución del proyecto. Este enfoque aporta beneficios clave para el desarrollo:

- **Mantenibilidad:** Al encapsular la lógica de negocio en módulos, los errores y cambios quedan aislados. Así, corregir un bug en el módulo de `exchange` no pone en riesgo el de `authentication`.
- **Escalabilidad y crecimiento:** Las nuevas funcionalidades se implementan como módulos independientes y aislados, permitiendo que equipos distintos trabajen en paralelo sin conflictos y acelerando la entrega de valor.
- **Predictibilidad:** Al seguir todos los módulos la misma estructura y reglas, cualquier desarrollador puede orientarse rápidamente en un módulo desconocido, reduciendo la curva de aprendizaje y aumentando la velocidad de desarrollo.

### 2.1. Encapsulación y Cohesión

Cada módulo debe ser una unidad de software independiente y cohesiva, responsable de un único dominio de negocio.

- **Todo dentro de su módulo:** Componentes, stores, tipos, servicios, errores y rutas deben residir dentro del módulo al que pertenecen.
- **Minimizar dependencias:** Un módulo solo debe depender de `shared` para reutilizar módulos o utilidades compartidas, o de forma muy controlada, de otros módulos a través de su API Pública (`index.ts`).
- **Alta cohesión interna, bajo acoplamiento externo:** Los elementos dentro de un módulo deben estar fuertemente relacionados. Las conexiones entre módulos deben ser mínimas y explícitas.

### 2.2. Core vs Shared: Separación de Responsabilidades

La aplicación separa los recursos compartidos en dos categorías principales, cada una con propósitos distintos y complementarios:

#### **El Módulo `core` (Configuración Global)**

Contiene toda la **configuración global que afecta cómo funciona la aplicación completa**.

**Pregunta clave:** *"¿Es configuración global de la aplicación?"*

**Qué va en `core`:**
- **Router**: Configuración de navegación de toda la app
- **API**: Configuración HTTP que usa toda la app  
- **Patrones arquitectónicos**: Como Either para manejo de errores
- **Plugins globales**: Configuración que afecta toda la app

**Regla simple:** Si cambias algo aquí, puede impactar toda la aplicación.

#### **El Módulo `shared` (Recursos Reutilizables)**

Contiene **recursos que se usan en múltiples módulos** pero no son configuración global.

**Pregunta clave:** *"¿Es recurso reutilizable entre módulos?"*

**Qué va en `shared`:**
- **Componentes**: BaseCard, Modal, etc. (usados en múltiples módulos)
- **Composables**: useModal, useNotification, etc. (usados en múltiples módulos)  
- **Utilidades**: formatDate, validation, etc. (usados en múltiples módulos)
- **Stores globales**: Estado que necesitan múltiples módulos

**Regla simple:** Si cambias algo aquí, afecta múltiples componentes pero no toda la app.


#### **Criterios de Decisión Simplificados**

Nuevo archivo/funcionalidad:

1. ¿Configura toda la app? (router, api, patterns) → core/
2. ¿Lo usan múltiples módulos? (components, utils)  → shared/  
3. ¿Solo un módulo lo usa? → modules/[module]/

#### Regla de impacto:
- Toco core/ = puede romper toda la app
- Toco shared/ = puede afectar múltiples componentes  
- Toco modules/ = solo afecta ese módulo

### 2.3. Dependencias y la API Pública (`index.ts`)

Para mantener el orden y un bajo acoplamiento, la comunicación entre módulos debe seguir una regla estricta: **un módulo NO debe importar archivos internos de otro módulo**.

Toda importación debe hacerse a través del archivo `index.ts` del módulo de destino. Este archivo funciona como la **"API Pública"** o fachada del módulo: define explícitamente qué funciones, componentes o tipos se exponen al resto de la aplicación. Todo lo que no se exporte en este archivo se considera privado y no debe ser accesible desde fuera del módulo.

## **Sección 3: Estructura Plana Inteligente**

Para evitar el anidamiento excesivo que genera desorden y problemas conflictivos, adoptamos una estructura plana pero inteligente. Cada módulo mantiene sus carpetas principales (`components/`, `pages/`, `composables/`, `utils/`, etc.) al mismo nivel, evitando subcarpetas innecesarias.

### **3.1. Organización de Componentes**

**Estructura de Archivos por Componente (SCF Pattern):**
Cuando se crea un componente, todos sus archivos relacionados se mantienen juntos para preservar la cohesión:

```
components/
├── AnimeListItem/
│   ├── index.vue
│   ├── useAnimeListItem.ts
│   └── animeListItem.style.scss
├── SearchButtonClear/
│   ├── index.vue
│   ├── useSearchButtonClear.ts
│   └── searchButtonClear.style.scss
```
**Nomenclatura y estructura del Componentes:**
- **Regla**: Los nombres deben comenzar con las palabras de nivel más alto y terminar con modificadores descriptivos
- **Patrón**: `[Componente]`  o  `[Componente][Contexto]`  o  `[Componente][Contexto][Modificador]`
- **Ejemplos**: `Anime/`, `AnimeList/`, `AnimeListItem/`

- **`index.vue`**: Capa de Presentación (`.vue`) su única responsabilidad es mostrar la interfaz y capturar las interacciones del usuario. No contiene lógica de negocio compleja. No se debe hacer cálculos en el template
- **`use[Component].ts`**: Capa de Lógica y Estado (`use[contexto].ts`) Cada componente que necesite tener lógica lo debe separar en un composable con el prefijo use y con el nombre del componente. Ej. `useAnime.ts`, `useAnimeLis.ts`, `useAnimeListItem.ts` Su responsabilidad es manejar el estado reactivo, la lógica de negocio y orquestar las llamadas a los servicios.
- **`[component].style.scss`**: Exclusivamente el estilo específico del componente. Ej: `anime.style.scss`, `animeList.style.scss`, `animeListItem.style.scss`
- Si un componente necesita exportar su información se debe usar `defineExpose`

### **3.2. Organización de Composables**

Los composables se organizan en la carpeta `composables/` del módulo con nomenclatura específica:

**Composables Específicos de Componente:**
El composable principal del componente (`use[Component].ts`) se mantiene en la misma carpeta que el componente. Sin embargo, cuando se requiere separar lógica adicional en composables específicos se debe agregar en la carpeta principal de composable del modulo y se debe seguir el siguiente patrón:
- **Patrón**: `use[Componente][Funcionalidad].ts`
- **Ejemplo**: `useAnimeListItemFavorite.ts` (para funcionalidad de favoritos del componente AnimeListItem)

**Composables Globales del Módulo:**
- **Patrón**: `use[Funcionalidad].ts`
- **Ejemplo**: `useAnimeFilter.ts` (para filtrado general de anime en todo el módulo)

### **3.3. Reglas de Nomenclatura**

**Componentes Relacionados entre sí:**

Los componentes que forman parte de una misma funcionalidad deben seguir una jerarquía de nombres clara que refleje su relación.

- **Regla de jerarquía**: Usar el contexto principal como prefijo, agregando especificidad
- **Beneficio**: Facilita la búsqueda y comprensión de la relación entre componentes

**Ejemplos correctos:**
```
AnimeList.vue           # Componente principal
AnimeListItem.vue       # Item de la lista  
AnimeListFilter.vue     # Filtro de la lista
AnimeListEmpty.vue      # Estado vacío de la lista
```

**Ejemplos incorrectos:**
```
ListAnime.vue           # Contexto al final
FilterAnime.vue         # Contexto al final  
EmptyAnimeList.vue      # Orden inconsistente
AnimeFilter.vue         # No indica que es del List
```

**Para Otros Tipos de Archivos:**
- **Tipo e Interfaces**: Pueden agruparse en un mismo archivo cuando comparten el mismo contexto o dominio (ej. `user.type.ts` puede contener `User`, `UserProfile`, `UserPreferences`)
- **Utilidad**: Funciones relacionadas pueden coexistir en un archivo cuando pertenecen al mismo contexto (ej. `date.util.ts` puede contener `formatDate`, `parseDate`, `isValidDate`)
- **Constante**: Valores relacionados pueden agruparse por dominio (ej. `auth.constant.ts` puede contener `VALIDATION_RULES`). 

### Estructura de Carpetas

Cada módulo de negocio debe adherirse rigurosamente a la siguiente estructura:

```
modules/
└── [nombre-modulo]/
    ├── index.ts
    ├── components/
    ├── composables/
    ├── constants/
    ├── data/
    ├── documentation/
    ├── READMEmd
    ├── errors/
    ├── utils/
    ├── router/
    ├── services/
    ├── stores/
    ├── types/
    ├── views/
    └── tests/

```

- **`index.ts`**: La única API Pública del módulo.
- **`components/`, `views/`, `pages/`, `sections/`**: Contienen carpetas de componentes reutilizables, cada una con su archivo `.vue`, composable y estilos (patrón SCF).
- **`composables/`**: Contiene los hooks (`use-`) globales del modulo.
- **`constants/`**: Para valores primitivos y constantes. Se recomienda el uso de `objetos as const` en lugar de `enum` de TypeScript para mejor tree-shaking y tipado más preciso.
- **`documentation/`**: Carpeta opcional que se crea solo cuando la información del README.md es muy extensa y necesita ser separada en archivos Markdown (`.md`) específicos para explicar lógica compleja del módulo.
- **`README.md`** Documentación base del modulo.
- **`errors/`**: Contiene objetos que definen los posibles errores del dominio.
- **`utils/`**: Funciones puras (sin estado).
- **`router/`**: Define las rutas del módulo, separadas en `private.route.ts` y `public.route.ts`.
- **`services/`**: Servicios del modulo.
- **`stores/`**: El store de Pinia para el estado del módulo.
- **`types/`**: Contiene **todas** las definiciones `interface` y `type` de TypeScript del módulo
- **`tests/`**: Pruebas unitarias para los archivos del módulo.

### Estructura General del Proyecto (`src`)

Esta sección proporciona una vista de alto nivel de los directorios principales dentro de `src`, reflejando la estructura actual del proyecto.

```
src/
├── core/
│   ├── api/
│   │   ├── index.ts
│   │   ├── instance.ts
│   │   ├── interceptors.request.ts
│   │   └── interceptors.response.ts
│   ├── either/
│   │   ├── index.ts
│   │   ├── type.ts
│   │   └── util.ts
│   ├── router/
│   │   ├── guards.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── global.css
│   │   └── element/
│   │       └── index.scss
│   ├── types/
│   │   └── index.ts
│   └── test/
│       ├── setup.ts
│       ├── api/
│       ├── either/
│       └── router/
├── modules/
│   ├── anime/
│   ├── auth/
│   └── [otros-módulos]/
├── shared/
│   ├── common/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── utils/
│   │   └── types/
│   └── layout/
│       └── components/
├── main.ts
└── App.vue
```

- **`core/`**: Contiene la **infraestructura fundamental** de la aplicación que define cómo opera estructuralmente.
    - `api/`: Configuración de infraestructura HTTP (instancia Axios, interceptores, patrones de error)
    - `either/`: Patrón funcional Either para manejo robusto de errores en operaciones asíncronas
    - `router/`: Configuración del router y sistema de guards globales
    - `styles/`: Estilos globales y configuración de Element Plus
    - `test/`: Pruebas unitarias de la infraestructura core (api, either, router)
- **`modules/`**: Lógica de negocio organizada por dominio. Cada módulo es independiente y contiene su estructura completa (components, pages, services, stores, etc.).
- **`shared/`**: Recursos **específicos de la aplicación** reutilizables entre módulos de negocio.
    - `common/`: Componentes UI de Vue, composables del proyecto y utilidades específicas de la aplicación
    - `layout/`: Componentes estructurales específicos de esta aplicación (headers, footers, layouts)
- **`main.ts`**: Punto de entrada que monta la aplicación Vue y configura plugins globales.
- **`App.vue`**: El componente raíz que contiene `<router-view>` y la estructura base de la aplicación.

#### **3.4. Beneficios de la Estructura Plana Inteligente**

- **Navegación Simplificada**: Fácil localización de archivos sin navegar por múltiples niveles
- **Cohesión Mantenida**: Archivos relacionados permanecen juntos
- **Escalabilidad**: Nuevos componentes se integran sin afectar la estructura existente
- **Predictibilidad**: Nomenclatura consistente facilita la búsqueda y comprensión
- **Mantenibilidad**: Cambios y refactorizaciones se realizan con mayor facilidad

## Sección 4: Gestión de Estado Local Complejo

Cuando se requiere compartir estado entre un componente padre y sus descendientes (por ejemplo, en flujos de pasos, configuraciones complejas o estados de UI compartidos), se debe emplear el patrón `provide`/`inject` de Vue. Toda la lógica para gestionar este estado compartido **debe** estar encapsulada en un único Composable, facilitando su testeo y reutilización.

### 4.1. Patrón Provider/Inject con Composable

Para estados complejos que requieren ser compartidos entre múltiples componentes en un árbol de componentes, se implementa un patrón que combina `provide`/`inject` con composables:

**Estructura del Composable Provider:**
```typescript
// use[Context]Provider.ts
import { reactive, provide, inject, type InjectionKey } from 'vue'
import type { [Context]Provider } from '../types'
import { INITIAL_[CONTEXT]_STATE } from '../constants'

export function use[Context]Provider(): [Context]Provider {
  const state = reactive({ ...INITIAL_[CONTEXT]_STATE })

  const provider: [Context]Provider = {
    state,
    // Métodos para manipular el estado
    updateState: (updates: Partial<typeof state>) => {
      Object.assign(state, updates)
    },
    resetState: () => {
      Object.assign(state, INITIAL_[CONTEXT]_STATE)
    }
  }

  return provider
}

// Injection key para el provider
export const [CONTEXT]_PROVIDER_KEY: InjectionKey<[Context]Provider> = Symbol('[context]Provider')

// Función para proveer el estado
export function provide[Context](): [Context]Provider {
  const provider = use[Context]Provider()
  provide([CONTEXT]_PROVIDER_KEY, provider)
  return provider
}

// Función para inyectar el estado
export function inject[Context](): [Context]Provider {
  const provider = inject([CONTEXT]_PROVIDER_KEY)
  if (!provider) {
    throw new Error('use[Context]Provider debe ser usado dentro de un componente que proporcione el estado')
  }
  return provider
}
```

**Tipos del Provider:**
```typescript
// types/providers.types.ts
import type { [Context]State } from './[Context].types'

export interface [Context]Provider {
  state: [Context]State
  updateState: (updates: Partial<[Context]State>) => void
  resetState: () => void
}
```

**Constantes del Estado Inicial:**
```typescript
// constants/state.ts
import type { [Context]State } from '../types/[Context].types'

export const INITIAL_[CONTEXT]_STATE: [Context]State = {
  // Propiedades iniciales del estado
}
```

### 4.2. Ejemplos de Uso en Componentes

**Ejemplo 1: Flujo de Pasos (Wizard)**
```vue
<!-- Componente Padre (Provider) -->
<template>
  <div class="wizard-container">
    <WizardStep1 />
    <WizardStep2 />
    <WizardStep3 />
  </div>
</template>

<script setup lang="ts">
import { provideWizard } from '../composables/useWizardProvider'

// Proporciona el estado compartido del wizard
provideWizard()
</script>
```

**Ejemplo 2: Configuración Compleja**
```vue
<!-- Componente Padre (Provider) -->
<template>
  <div class="settings-container">
    <GeneralSettings />
    <AdvancedSettings />
    <NotificationSettings />
  </div>
</template>

<script setup lang="ts">
import { provideSettings } from '../composables/useSettingsProvider'

// Proporciona el estado compartido de configuración
provideSettings()
</script>
```

**Componente Hijo (Consumer):**
```vue
<template>
  <div>
    <input v-model="state.currentStep" />
    <button @click="updateState({ currentStep: state.currentStep + 1 })">
      Siguiente
    </button>
  </div>
</template>

<script setup lang="ts">
import { injectWizard } from '../composables/useWizardProvider'

// Inyecta el estado compartido
const { state, updateState } = injectWizard()
</script>
```

### 4.3. Beneficios del Patrón

- **Encapsulación**: Toda la lógica del estado compartido está en un solo composable
- **Testabilidad**: Fácil testing del provider y consumer por separado
- **Reutilización**: El mismo patrón se puede aplicar a diferentes contextos
- **Type Safety**: TypeScript garantiza que los tipos sean consistentes
- **Error Handling**: Validación explícita de que el provider esté disponible
- **Reactividad**: El estado es reactivo y se propaga automáticamente
- **Métodos de Control**: Funciones para manipular el estado de forma controlada

### 4.4. Casos de Uso Aplicables

- **Flujos de pasos (Wizards)**: Onboarding, checkout, configuración guiada
- **Formularios multi-paso**: Registro, encuestas complejas, procesos de validación
- **Configuraciones complejas**: Ajustes que afectan múltiples componentes
- **Estados de UI compartidos**: Modo oscuro/claro, idioma, tema
- **Procesos de validación**: Estados de validación que se comparten entre pasos
- **Estados de carga**: Indicadores de progreso compartidos
- **Filtros y búsquedas**: Estados de filtrado que afectan múltiples componentes


## **Sección 5: Convenciones de Nomenclatura de Archivos**

Las siguientes convenciones se aplican a los **nombres de los archivos** para garantizar la consistencia y facilitar la navegación en el proyecto.

- Las carpetas siempre deben ir en plural (agrupan varios elementos).
- Los archivos deben ir en singular (definen una sola entidad).

| **Tipo de Archivo** | **Ubicación** | **Patrón de Nomenclatura** | **Ejemplo** |
| --- | --- | --- | --- |
| **Pages** | `/pages` | `PascalCase.vue` | `AnimeList.vue`, `AnimeDetail.vue` |
| **Views** | `/views` | `PascalCase.vue` | `RegisterFormStep.vue`, `RegisterSuccessStep.vue` |
| **Components** | `/components` | `PascalCase.vue` | `AnimeCard.vue`, `AnimeGrid.vue` |
| **Sections** | `/sections` | `PascalCase.vue` | `RegisterBasic.vue`, `RegisterContact.vue` |
| **Tags en Template** | N/A | `<PascalCase />` | `<AnimeCard />`, `<RegisterForm />` |
| **Composables** | `/composables` | `use[Contexto].ts` | `useAnimeList.ts`, `useRegisterForm.ts` |
| **Composables de Componente** | `/components/[Component]/` | `use[Component].ts` | `useAnimeCard.ts`, `useAnimeGrid.ts` |
| **Store** | `/stores` | `[contexto].store.ts` | `anime.store.ts`, `auth.store.ts` |
| **Services** | `/services` | `[contexto].service.ts` | `anime.service.ts`, `auth.service.ts`, `notification.service.ts` |
| **Factories** | `/tests/factories` | `[contexto].factory.ts` | `anime.factory.ts`, `store.factory.ts` |
| **Interceptors** | `/core/api/` | `[contexto].interceptor.ts` | `auth.interceptor.ts`, `error.interceptor.ts` |
| **Tipos (incl. Props)** | `/types` | `[contexto].type.ts` | `anime.type.ts`, `auth.type.ts` |
| **Utils** | `/utils` | `[contexto].util.ts` | `format.util.ts`, `logger.util.ts` |
| **Errors** | `/errors` | `[contexto].error.ts` | `anime.error.ts`, `auth.error.ts` |
| **Constants** | `/constants` | `[contexto].constant.ts` | `country.constant.ts`, `form.constant.ts` |
| **Archivos de Rutas** | `/routes` | `[contexto].route.ts`, `[contexto].guard.ts` | `anime.route.ts`, `auth.route.ts`, `anime.guard.ts` |
| **Core API** | `core/api/` | `[nombre].instance.ts`, `[tipo].interceptor.ts` | `instance.ts`, `interceptors.request.ts` |
| **Core Either** | `core/either/` | `[nombre].ts` | `index.ts`, `type.ts`, `util.ts` |
| **Pruebas** | `/tests` | `[archivoProbar].spec.ts` | `useAnimeList.spec.ts`, `AnimeCard.spec.ts` |
|
| **Documentación** | `/` | `README.md` | `README.md` (en cada módulo) |
| **Carpetas** | N/A | `camelCase` | `animeCard`, `registerForm` |
| **Style** | `/components` | `[componente].style.scss` | `animeCard.style.scss`, `registerForm.style.scss` |

## **Sección 7: Gestión de la Capa de API**

### 7.1. Instancia Global de Axios (`core/api`)

La configuración global de Axios **debe residir** en `core/api/`. Esta carpeta es responsable de crear y configurar la instancia única que se utilizará en toda la aplicación.

**Estructura de `core/api/`:**
```
core/api/
├── index.ts              # Exportaciones públicas de la API
├── instance.ts           # Configuración de la instancia de Axios
├── interceptors.request.ts  # Interceptores de peticiones
└── interceptors.response.ts # Interceptores de respuestas
```

**Características principales:**
- **Instancia única**: Se crea una sola instancia de Axios con configuración centralizada
- **Interceptores globales**: Manejo automático de headers, tokens y errores comunes
- **Base URL configurada**: URL base de la API configurada en la instancia
- **Tipado fuerte**: Exportación de tipos TypeScript para el cliente HTTP

### 7.2. Patrón Either para Manejo de Errores (`core/either`)

Para garantizar un manejo robusto y predecible de errores, todos los servicios utilizan el **patrón Either** implementado en `core/either/`.

**Beneficios del patrón Either:**
- **Manejo explícito de errores**: Cada operación retorna `Either<Error, Success>`
- **Type safety**: TypeScript garantiza que los errores se manejen correctamente
- **Composabilidad**: Las operaciones se pueden encadenar de forma segura
- **Testabilidad**: Fácil testing de casos de éxito y error

**Funciones principales:**
- `executeRequest()`: Envuelve peticiones HTTP con el patrón Either
- `left()` / `right()`: Creadores de resultados de error y éxito
- `handleSuccessResponse()` / `handleErrorResponse()`: Helpers para manejo de respuestas

### 7.3. Servicios por Módulo (`modules/.../services`)

Los servicios dentro de cada módulo **no deben** crear su propia instancia de Axios. En su lugar, deben:

1. **Importar la instancia global**: `import { ApiInstance as http } from '@/core/api'`
2. **Usar el patrón Either**: `import { executeRequest } from '@/core/either'`
3. **Implementar métodos tipados**: Cada método debe retornar `Promise<ApiResult<T>>`

**Ejemplo de implementación:**
```typescript
import { ApiInstance as http } from '@/core/api'
import { executeRequest } from '@/core/either'
import type { ApiResult } from '@/core/either'

export const animeApi = {
  getAnimeList(params: AnimeSearchParams = {}): Promise<ApiResult<PaginatedResponse<Anime>>> {
    return executeRequest(() => 
      http.get<PaginatedResponse<Anime>>('/anime', { params })
    )
  }
}
```

### 7.4. Ventajas de esta Arquitectura

- **Consistencia**: Todos los servicios siguen el mismo patrón de manejo de errores
- **Mantenibilidad**: Cambios en la configuración de API se aplican globalmente
- **Testabilidad**: El patrón Either facilita el testing de casos de error
- **Type Safety**: TypeScript garantiza que los errores se manejen correctamente
- **Reutilización**: La instancia y utilidades se comparten entre todos los módulos

## **Sección 8: Gestión de Estilos (CSS)**

Para mantener los estilos organizados y evitar conflictos, se sigue una jerarquía de 5 niveles, de lo más específico a lo más global, basada en la estructura actual del proyecto.

### **8.1. Jerarquía de Estilos**

1. **Clases de Tailwind en el Template:** El método principal y preferido para aplicar estilos es usar las **clases de utilidad de Tailwind directamente en el template** del componente (`.vue`).

2. **Estilos Específicos de Componente (`[component].styles.scss`):** Cada componente puede tener su propio archivo de estilos SCSS que se importa directamente en el componente.
   ```vue
   <template>
     <!-- Template del componente -->
   </template>
   
   <script setup lang="ts">
   // Lógica del componente
   </script>
   
   <style lang="scss" scoped>
   @import './[component].styles.scss';
   </style>
   ```

3. **Abstracción con `<style scoped>` y `@apply`:** Si un conjunto de clases de Tailwind se repite **múltiples veces dentro del mismo componente**, se puede crear una clase semántica usando `@apply` dentro del archivo `.styles.scss` del componente.

4. **Estilos de Librerías de UI (`src/core/styles/`):** Configuración y personalización de librerías de UI como Element Plus.
   ```
   src/core/styles/
   ├── element/
   │   └── index.scss    # Configuración de Element Plus
   ```

5. **Estilos Fundamentales y Globales (`src/core/styles/`):** Variables CSS globales, configuración de fuentes, estilos base y variables de tema que afectan toda la aplicación. Estos estilos son parte del núcleo de la aplicación y se importan una única vez en `main.ts`.

### **8.2. Estructura de Archivos de Estilos**

**Por Componente (SCF Pattern):**
```
components/
├── AnimeCard/
│   ├── index.vue
│   ├── useAnimeCard.ts
│   └── animeCard.style.scss    # Estilos específicos del componente
```

**Estilos Globales:**
```
src/
├── core/
│   └── styles/
│       ├── global.css           # Variables CSS globales y estilos base
│       └── element/
│           └── index.scss       # Configuración de Element Plus
└── shared/
    └── common/
        └── styles/
            └── [shared].scss    # Estilos compartidos entre módulos
```

### **8.3. Convenciones de Nomenclatura**

- **Archivo de estilo de componente**: `[component].style.scss`
- **Variables CSS globales**: Definidas en `:root` en `src/core/styles/global.css`
- **Clases semánticas**: Usar `@apply` para agrupar clases de Tailwind

### **8.4. Reglas de Importación**

- **Estilos de componente**: Importar directamente en el componente con `@import './[component].styles.scss'`
- **Estilos globales**: Importar en `main.ts` o `App.vue`
- **Estilos de librería**: Importar en `main.ts` o en archivos específicos de configuración

### **8.5. Ejemplo de Implementación**

```scss
// animeCard.styles.scss
.anime-card {
  @apply bg-white rounded-lg shadow-md p-4 transition-all duration-200;
  
  &:hover {
    @apply shadow-lg transform -translate-y-1;
  }
  
  .anime-title {
    @apply text-lg font-semibold text-gray-800 mb-2;
  }
  
  .anime-description {
    @apply text-sm text-gray-600 line-clamp-3;
  }
}
```

### **8.6. Ventajas de esta Arquitectura**

- **Modularidad**: Cada componente tiene sus estilos encapsulados
- **Mantenibilidad**: Cambios en estilos se aíslan al componente específico
- **Reutilización**: Patrones de diseño se pueden compartir entre componentes
- **Performance**: Solo se cargan los estilos necesarios para cada componente
- **Consistencia**: Variables CSS globales garantizan coherencia visual

## **Sección 9: Gestión de Dependencias Externas**

### 9.1. Configuración Global de Librerías → `core/`

**Pregunta:** ¿Es configuración global que afecta toda la aplicación?

**Ejemplos:**
```
core/
├── plugins/
│   ├── element-plus.ts      # app.use() - afecta toda la app
│   ├── pinia.ts            # Estado global - afecta toda la app
│   └── index.ts            
└── api/
    ├── instance.ts         # HTTP global - afecta toda la app
    └── interceptors.*.ts   # Interceptores - afectan toda la app
```

### 9.2. Utilidades Reutilizables de Librerías → `shared/`

**Pregunta:** ¿Es utilidad que usan múltiples módulos?

**Ejemplos:**
```
shared/
└── common/
    ├── utils/
    │   ├── date.util.ts        # formatDate() - usado en múltiples módulos
    │   ├── format.util.ts      # formatCurrency() - usado en múltiples módulos
    │   └── validation.util.ts  # validaciones - usadas en múltiples módulos
    └── index.ts                 
```

**Regla simple:** 
- Si configuras la librería globalmente → `core/`
- Si creas helpers que se reutilizan → `shared/`

## **Sección 10: Testing**

### **10.1. Filosofía de Testing**

Nuestro enfoque se basa en **"Write tests. Not too many. Mostly integration."** siguiendo las mejores prácticas de Kent C. Dodds y la guía oficial de Vue:

- **Pruebas unitarias** para lógica de negocio compleja
- **Pruebas de integración ligera** para composables y stores  
- **Pruebas de comportamiento observable** para interacciones de usuario
- **Evitar** pruebas unitarias excesivas de servicios simples

### **10.2. Estructura de Testing**

**Pruebas por Módulo (`modules/[module]/test/`):**
```
modules/[module]/test/
├── setup.ts                      # Configuración específica del módulo
├── README.md                     # Documentación de testing del módulo
├── components/                   # Pruebas de componentes Vue
│   └── [Component]/
│       ├── index.spec.ts         # Pruebas del template del componente
│       └── use[Component].spec.ts # Pruebas del composable
├── pages/                        # Pruebas de páginas
│   └── [Page]/
│       └── use[Page].spec.ts
├── stores/                       # Pruebas de stores Pinia
│   └── [contexto].store.spec.ts
├── services/                     # Pruebas de servicios
│   └── [contexto].services.spec.ts
├── factories/                    # Factories para datos de prueba
│   └── [contexto].factory.ts
└── utils/                        # Utilidades para testing
    └── test-util.ts
```

### **10.3. Configuración Global**

**Archivo de configuración global (`test/setup.ts`):**
- Configuración de Vitest
- Mocks globales (Vue Router, Element Plus)
- Utilidades compartidas entre todos los tests

**Archivo de configuración por módulo (`modules/[module]/test/setup.ts`):**
- Configuración específica del módulo
- Mocks específicos del dominio
- Factories y utilidades del módulo