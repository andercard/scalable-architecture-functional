# Lineamientos de Arquitectura Modular para el Frontend B2B

**Sección 1: Visión General**

A medida que nuestro proyecto frontend B2B ha crecido, nos hemos encontrado con desafíos comunes que ralentizan nuestra capacidad de innovación: código disperso, dependencias complejas y una curva de aprendizaje elevada para los nuevos integrantes del equipo. Para superar estos obstáculos y preparar nuestra plataforma para el futuro, es fundamental adoptar una arquitectura más robusta.

Estos lineamientos establecen el camino hacia una **arquitectura modular estandarizada**, basada en los principios de Domain-Driven Design (DDD) y Clean Architecture sobre Vue 3 y TypeScript.

La meta principal es transformar nuestra base de código en un sistema de módulos independientes y cohesivos. Este enfoque nos permitirá no solo **acelerar la entrega de nuevas funcionalidades y reducir los costos de mantenimiento**, sino también construir una plataforma escalable y de alta calidad que soporte el crecimiento del negocio a largo plazo.

## **Sección 2: Principios de la Arquitectura Modular**

La arquitectura modular es una inversión estratégica en la salud y la evolución del proyecto a largo plazo. Este enfoque se traduce directamente en ventajas críticas para el desarrollo:

- **Mantenibilidad:** Al aislar la lógica de negocio en módulos, los errores o cambios quedan contenidos. Es mucho más fácil y seguro corregir un bug en el módulo de `exchange` sin el riesgo de afectar al de `authentication`.
- **Escalabilidad y Crecimiento:** Permite que nuevas funcionalidades se desarrollen como módulos completamente nuevos y aislados. Esto facilita que diferentes equipos puedan trabajar en paralelo sin conflictos, acelerando el tiempo de entrega de valor.
- **Predictibilidad:** Dado que cada módulo sigue exactamente la misma estructura y reglas, cualquier desarrollador puede navegar por un módulo que no conoce y entender rápidamente dónde encontrar cada pieza. Esto reduce drásticamente la curva de aprendizaje y aumenta la velocidad de desarrollo.

### 2.1. Encapsulación y Cohesión

Cada módulo debe ser una unidad de software independiente y cohesiva, responsable de un único dominio de negocio.

- **Todo dentro de su módulo:** Componentes, stores, tipos, servicios, errores y rutas deben residir dentro del módulo al que pertenecen.
- **Minimizar dependencias:** Un módulo solo debe depender de `common` o, de forma muy controlada, de otros módulos a través de su API Pública (`index.ts`).
- **Alta Cohesión Interna, Bajo Acoplamiento Externo:** Los elementos dentro de un módulo deben estar fuertemente relacionados. Las conexiones entre módulos deben ser mínimas y explícitas.

### 2.2. El Módulo `common` (Compartido)

El módulo `common` es un lugar para la lógica que es **genéricamente reutilizable** a través de **múltiples** módulos de negocio y que **no pertenece a ningún dominio específico**. Es el "cajón de herramientas" para tus módulos.

- **¿Qué va en `common`?**
    - Componentes de UI genéricos que no están en nuestra librería de UI pero se usan en 3 o más módulos.
    - Funciones helper universales (ej. `formatDate`, `formatCurrency`).
    - Tipos e interfaces genéricos.
    - Stores de Pinia para estado global de la aplicación (ej. `notificationsStore`).
- **Regla de Oro:** Si dudas, mantenlo dentro del módulo específico. Solo mueve a `common` cuando la necesidad de reutilización en un tercer módulo se vuelva evidente.

### 2.3. Dependencias y la API Pública (`index.ts`)

Para mantener el orden y el bajo acoplamiento, la comunicación entre módulos debe seguir una regla estricta: **un módulo NO debe importar archivos internos de otro módulo**.

Toda importación debe realizarse a través del archivo `index.ts` del módulo de destino. Este archivo actúa como la **"API Pública"** o "fachada" del módulo: es un contrato que define explícitamente qué funciones, componentes o tipos el módulo decide exponer al resto de la aplicación. Cualquier cosa no exportada en este archivo se considera privada y no debe ser accesible desde el exterior.

## **Sección 3: Principios de Desarrollo y Organización**

### 3.1. Principio de Responsabilidad Única por Archivo

Para garantizar un código testeable y reutilizable, aplicamos principios de desarrollo inspirados en **S.O.L.I.D.**, enfocándonos en la Responsabilidad Única a nivel de **archivo**. Cada archivo en nuestro proyecto tiene una sola razón para existir:

- **Definición de Estructuras de Datos (`.type.ts`):** Define la forma de los datos del módulo, **incluyendo las `props` de los componentes**. Su única responsabilidad es ser la fuente de verdad para todas las estructuras de datos.
- **Definición de `emits` y API Externa (`defineExpose`)**:
    - La definición de **`emits`** **debe** definirse directamente dentro del bloque `<script setup>` del archivo `.vue`.
    - Si un componente necesita exponer una API (`defineExpose`), la lógica de estas funcionalidades **debe** definirse y retornarse desde el hook (`.composable.ts`). El archivo `.vue` simplemente consume el hook y pasa el objeto resultante a `defineExpose`.
- **Capa de Presentación (`.vue`):** Su única responsabilidad es mostrar la interfaz y capturar las interacciones del usuario. No contiene lógica de negocio compleja.
- **Capa de Lógica y Estado (`.composable.ts`):** Su única responsabilidad es manejar el estado reactivo, la lógica de negocio y orquestar las llamadas a los servicios.
- **Capa de Datos (`.service.ts`):** Su única responsabilidad es comunicarse con fuentes de datos externas (API).

### 3.2. Gestión de Estado Local Complejo (Patrón `provide`/`inject`)

Para manejar el estado que es compartido entre un componente padre y sus descendientes (especialmente en formularios complejos o flujos de "steps"), se debe utilizar el patrón `provide`/`inject` de Vue. La lógica para gestionar este estado compartido **DEBE** encapsularse en un único Composable.

### 3.3. Regla de Oro para la Organización de Archivos

- **Regla #1: Anidación de Componentes**
Por defecto, la carpeta `/components` es plana. Solo se debe crear una subcarpeta para un componente si se cumplen **TODAS** las siguientes condiciones:
    1. **Es un Componente Compuesto:** El componente principal se construye a partir de dos o más componentes hijos (`.vue`).
    2. **Los Hijos son 100% Privados:** Los componentes hijos están fuertemente acoplados al padre y no tienen ninguna utilidad por sí solos fuera de él.
    3. **Mejora la Claridad:** Sin la subcarpeta, la cantidad de archivos "privados" saturaría la carpeta `components/`, dificultando la identificación de los componentes principales del módulo.

## **Sección 4: Estructura Detallada de Carpetas del Módulo**

### Por qué Agrupamos por Tipo y no por Feature

Una decisión de arquitectura fundamental es cómo organizar los archivos dentro de un módulo. Siguiendo las mejores prácticas de la industria para aplicaciones a gran escala, hemos adoptado un enfoque híbrido:

1. Primero, agrupamos por **feature de alto nivel** (los módulos como `profile` o `exchange`), un principio fundamental de arquitecturas como **Domain-Driven Design (DDD)**.
2. Luego, **dentro de cada módulo**, hemos hecho la elección estratégica de agrupar los archivos por **tipo** (ej. `composables/`, `types/`) en lugar de anidar por sub-feature.

Esta decisión responde directamente a los problemas que ya estamos experimentando, como la **duplicación de `types`, `helpers` y `composables`** a través de diferentes partes del código. El patrón de "agrupar por tipo" es una práctica recomendada por herramientas de desarrollo empresarial como **Nx (Nrwl Extensions)**, ya que convierte cada categoría de archivo en una "librería" interna del módulo.

Nuestro enfoque "plano por tipo", validado por su éxito en el ecosistema de desarrollo a gran escala, crea una **única fuente de la verdad** para cada tipo de archivo. Esto combate directamente la duplicación, fomenta la reutilización de código, hace la estructura del proyecto predecible y escala de manera mucho más eficiente.

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
    ├── errors/
    ├── helpers/
    ├── router/
    ├── services/
    ├── store/
    ├── types/
    ├── views/
    └── tests/

```

- **`index.ts`**: La única API Pública del módulo.
- **`components/` y `views/`**: Contienen únicamente los archivos `.vue`.
- **`composables/`**: Contiene los hooks (`use-`) que manejan la lógica reactiva.
- **`constants/`**: Para valores primitivos y constantes. Se recomienda el uso de `objetos as const` en lugar de `enum` de TypeScript.
- **`data/`**: Para conjuntos de datos más grandes y estructurados fijos en el frontend.
- **`documentation/`**: Archivos Markdown (`.md`) que explican la lógica compleja del módulo.
- **`errors/`**: Contiene objetos que definen los posibles errores del dominio.
- **`helpers/`**: Funciones puras (sin estado).
- **`router/`**: Define las rutas del módulo, separadas en `private.routes.ts` y `public.routes.ts`.
- **`services/`**: Abstrae las llamadas a la API.
- **`store/`**: El store de Pinia para el estado del módulo.
- **`types/`**: Contiene **todas** las definiciones `interface` y `type` de TypeScript del módulo. Esto incluye tanto los modelos de datos del dominio (ej. `transaction.type.ts`) como las definiciones de `props` para los componentes y vistas (ej. `user-avatar.type.ts`). Centralizar todos los tipos aquí asegura una única fuente de verdad.
- **`tests/`**: Pruebas unitarias para los archivos del módulo.

## **Sección 5: Estructura General del Proyecto (`src`)**

Esta sección proporciona una vista de alto nivel de los directorios principales dentro de `src`.

```
src/
├── core/
│   ├── main.ts
│   ├── App.vue
│   ├── api/
│   ├── plugins/
│   ├── router/
│   ├── store/
│   └── config.ts
├── modules/
├── layouts/
└── assets/

```

- **`core/`**: Es el núcleo de la aplicación, responsable de la **orquestación y configuración global**.
    - `main.ts`: Punto de entrada que monta la aplicación Vue.
    - `App.vue`: El componente raíz que contiene `<router-view>`.
    - `api/`: Contiene la configuración de la(s) instancia(s) global(es) de Axios.
    - `plugins/`: Carpeta para la configuración de plugins de Vue (`app.use()`).
    - `router/`: Contiene la configuración principal de Vue Router.
    - `store/`: Contiene la configuración principal de Pinia (`createPinia()`).
    - `config.ts`: **Centraliza el acceso a las variables de entorno**. Este archivo lee `import.meta.env` y exporta las variables tipadas. Ningún otro archivo debe acceder a `import.meta.env` directamente.
- **`modules/`**: Aquí reside toda la lógica de negocio, organizada por dominio.
- **`layouts/`**: Contiene los diseños estructurales de la aplicación.
- **`assets/`**: Almacena recursos estáticos globales que no son específicos de ningún módulo.

## **Sección 6: Convenciones de Nomenclatura de Archivos**

Las siguientes convenciones se aplican a los **nombres de los archivos** para garantizar la consistencia.

| **Tipo de Archivo** | **Ubicación** | **Patrón de Nomenclatura** |
| --- | --- | --- |
| **Vistas** | `/views` | `PascalCase.vue` |
| **Componentes** | `/components` | `PascalCase.vue` |
| **Tags en Template** | N/A | `<PascalCase />` |
| **Hooks** | `/composables` | `use-[contexto].ts` |
| **Store** | `/store` | `[contexto].store.ts` |
| **Services** | `/services` | `[contexto].service.ts` |
| **Tipos (incl. Props)** | `/types` | `[contexto].type.ts` |
| **Helpers** | `/helpers` | `[contexto].helper.ts` |
| **Errores** | `/errors` | `[contexto].error.ts` |
| **Constantes** | `/constants` | `[contexto].constants.ts` |
| **Data** | `/data` | `[contexto].data.ts` |
| **Archivos de Rutas** | `/router` | `[descriptor].routes.ts`, `guards.ts` |
| **Plugins** | `core/plugins` | `[nombre].plugin.ts` |
| **Instancias/Interceptores API** | `core/api/` | `[nombre].instance.ts`, `[tipo].interceptor.ts` |
| **Pruebas** | `/tests` | `[archivo-a-probar].spec.ts` |
| **Documentación** | `/documentation` | `[nombre-feature].md` |
| **Carpetas** | N/A | `kebab-case` |

## **Sección 7: Gestión de la Capa de API**

### 7.1. Instancia Global de Axios (`core/api`)

La configuración global de Axios **debe residir** en `core/api/`. Esta carpeta es responsable de crear y configurar la(s) instancia(s) única(s) que se usarán en toda la aplicación.

### 7.2. Servicios por Módulo (`modules/.../services`)

Los servicios dentro de cada módulo **no deben** crear su propia instancia de Axios. En su lugar, deben **importar y utilizar** la instancia global pre-configurada que se exporta desde `core/api`.

## **Sección 8: Gestión de Estilos (CSS)**

Para mantener los estilos organizados y evitar conflictos, se seguirá la siguiente jerarquía de 4 niveles, de lo más específico a lo más global.

1. **Clases de Tailwind en el Template:** El método principal y preferido para aplicar estilos es usar las **clases de utilidad de Tailwind directamente en el template** del componente (`.vue`).
2. **Abstracción con `<style scoped>` y `@apply`:** Si un conjunto de clases de Tailwind se repite **múltiples veces dentro del mismo componente**, se puede crear una clase semántica dentro de una etiqueta `<style lang="scss" scoped>` y agrupar las utilidades de Tailwind usando `@apply`. Este enfoque debe usarse con moderación.
3. **Estilos Compartidos entre Módulos (`modules/common/assets`):** Si una clase o conjunto de estilos (`.scss`) necesita ser reutilizado en **varios módulos diferentes**, debe crearse en la carpeta `assets/` del módulo `common`.
    - **Importación:** Estos archivos **deben ser importados directamente** con su ruta completa donde se necesiten (ej. `@use '@/modules/common/assets/styles/forms.scss'`). La regla de la API Pública del `index.ts` no aplica para assets de CSS.
4. **Estilos Fundamentales y Globales (`src/assets`):** La carpeta raíz `src/assets` está reservada exclusivamente para los estilos que son el **fundamento de toda la aplicación**. Esto incluye los archivos base de Tailwind, los estilos de la librería de UI, fuentes o variables CSS raíz. Estos archivos se importan una única vez en `core/main.ts` o en `core/App.vue`, según la necesidad.

## **Sección 9: Gestión de Dependencias Externas**

### 9.1. Librerías Reutilizables (Patrón `common`)

Si una librería necesita ser configurada (ej. `dayjs`), esta configuración debe centralizarse en un helper dentro de `modules/common/helpers/`. Cualquier otro módulo deberá importarla desde la API Pública de `common` (`@/modules/common`).

### 9.2. Plugins y Estilos Globales (Patrón `core`)

Si una librería requiere ser registrada globalmente (`app.use()`), esta inicialización debe ocurrir en el núcleo de la aplicación, dentro de `core/plugins/`, y ser llamada desde `main.ts`.

## **Sección 10: Testing**

- **Pruebas Unitarias y de Integración**: Deben residir dentro del módulo que prueban, en su carpeta `tests/`.
- **Pruebas End-to-End (E2E)**: Las pruebas que simulan flujos de usuario completos deben vivir en la carpeta `tests/` en la raíz del proyecto.