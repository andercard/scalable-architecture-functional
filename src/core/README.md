# Core

Esta carpeta contiene los fundamentos de la arquitectura de la aplicación, independientes de cualquier lógica de negocio específica.

## Estructura

```
src/core/
├── api/              # Configuración de API y interceptors
│   ├── index.ts      # Exports principales de API
│   ├── instance.ts   # Instancia de Axios configurada
│   ├── interceptors.request.ts  # Interceptores de request
│   └── interceptors.response.ts # Interceptores de response
├── either/           # Patrón Either para manejo funcional de errores
│   ├── types.ts      # Tipos del patrón Either
│   ├── utils.ts      # Utilidades para manejo de Either
│   ├── index.ts      # Exports principales
│   ├── index.spec.ts # Tests unitarios
│   └── README.md     # Documentación detallada
├── router/           # Configuración centralizada del router
│   ├── index.ts      # Creación y configuración del router
│   └── guards.ts     # Sistema de guards en cadena
└── README.md         # Esta documentación
```

## Propósito

El `core` contiene:

- **Patrones arquitectónicos fundamentales**: Como el patrón Either para manejo de errores
- **Utilidades de bajo nivel**: Funciones puras y tipos que no dependen de frameworks
- **Abstracciones de dominio**: Conceptos que atraviesan toda la aplicación
- **Configuración de infraestructura**: Router, API, y otros servicios fundamentales

## Diferencias con `shared`

- **`core`**: Fundamentos de la arquitectura (independiente de frameworks)
- **`shared`**: Utilidades específicas del proyecto (componentes UI, composables Vue, etc.)

## Uso

```typescript
// Importar desde el core
import { Either, left, right } from '@core/either'
import { ApiInstance } from '@core/api'
import { createAppRouter } from '@core/router'

// Usar en servicios
const result: Either<ApiFailure, ApiSuccess<Data>> = await service.getData()
result.fold(
  (failure) => handleError(failure),
  (success) => handleSuccess(success.data)
)

// Crear router configurado
const router = createAppRouter()
```

## Principios

1. **Independencia**: No debe depender de frameworks específicos
2. **Pureza**: Funciones puras sin efectos secundarios
3. **Reutilización**: Debe ser utilizable en cualquier parte del proyecto
4. **Testabilidad**: Fácil de testear de forma aislada 

## Carpeta api

Contiene la lógica centralizada para la creación de instancias de cliente HTTP, interceptores funcionales y guardianes de módulos. Permite desacoplar la infraestructura de red del resto de la aplicación y facilita el cambio de cliente HTTP o la extensión de lógica cross-module.

### Características
- Instancia de Axios configurada con interceptors
- Manejo automático de errores con patrón Either
- Logging centralizado de requests y responses
- Configuración de base URL y headers

## Carpeta router

Contiene la configuración centralizada del router de Vue, incluyendo el sistema de guards en cadena que permite ejecutar múltiples guards en orden y de forma modular.

### Características
- Creación centralizada del router con `createAppRouter()`
- Sistema de guards en cadena con `executeGuards()`
- Guards globales y específicos por ruta
- Configuración automática de guards en el router
- Tipado fuerte para todos los guards

### Uso de Guards

```typescript
// En las rutas, especificar guards específicos
{
  path: '/anime/favorites',
  name: 'AnimeFavorites',
  component: () => import('../pages/AnimeFavorites.vue'),
  meta: {
    requiresAuth: true,
    guards: ['animeAuthGuard', 'animeFavoritesGuard']
  }
}
``` 