# Guía de Migración: Patrón Either para Capa de Servicios

Esta guía explica cómo migrar todos los endpoints existentes para usar el patrón Either adaptado a la programación funcional, siguiendo los lineamientos de la capa de servicios.

## 📋 Resumen de Cambios

### Antes (Patrón Imperativo)
```typescript
export const commerceClient = {
  getRecurring(userId?: string) {
    return ApiInstance.get<CommerceData[]>(
      'pse-autorizador/b2b/recurring/',
      {
        params: { userId },
      }
    );
  },
}
```

### Después (Patrón Funcional con Either)
```typescript
export const commerceApiFunctional = {
  getRecurring(params: GetRecurringParams = {}): Promise<ApiResult<CommerceData[]>> {
    return executeRequest(() => 
      api.get<CommerceData[]>('pse-autorizador/b2b/recurring/', {
        params: { userId: params.userId }
      })
    )
  }
}
```

## 🚀 Pasos para la Migración

### 1. Crear Tipos Funcionales

Asegúrate de que los tipos funcionales estén disponibles:

```typescript
// src/core/either/types.ts
export type Either<L, R> = Left<L> | Right<R>
export type ApiResult<T> = Either<ApiFailure, ApiSuccess<T>>

// Interfaces funcionales (no clases)
export interface Left<L> {
  readonly _tag: 'Left'
  readonly value: L
  isLeft(): this is Left<L>
  isRight(): this is Right<never>
  map<B>(_f: (r: never) => B): Either<L, B>
  flatMap<B>(_f: (r: never) => Either<L, B>): Either<L, B>
  fold<B>(onLeft: (l: L) => B, _onRight: (r: never) => B): B
}

export interface Right<R> {
  readonly _tag: 'Right'
  readonly value: R
  isLeft(): this is Left<never>
  isRight(): this is Right<R>
  map<B>(f: (r: R) => B): Either<never, B>
  flatMap<L, B>(f: (r: R) => Either<L, B>): Either<L, B>
  fold<B>(_onLeft: (l: never) => B, onRight: (r: R) => B): B
}
```

### 2. Crear Utilidades Funcionales

Las utilidades ya están creadas en `src/core/either/utils.ts`:

- `executeRequest()` - Maneja automáticamente errores con Either
- `extractData()` - Extrae datos de manera segura
- `handleSuccessResponse()` - Convierte respuestas exitosas
- `handleErrorResponse()` - Convierte errores

### 3. Migrar Servicios de API

#### Paso 1: Crear el nuevo servicio funcional

```typescript
// src/modules/[module]/services/[module]ApiFunctional.ts
import { api } from '@shared/utils/api'
import { executeRequest } from '@core/either'
import type { ApiResult } from '@core/either'

export const [module]ApiFunctional = {
  [methodName](params: [ParamsType]): Promise<ApiResult<[ResponseType]>> {
    return executeRequest(() => 
      api.[httpMethod]<[ResponseType]>('[endpoint]', {
        params,
        // otros configs
      })
    )
  }
}
```

#### Paso 2: Documentar con JSDoc

```typescript
/**
 * Obtiene la lista de [entidad] con filtros opcionales
 * @param params - Parámetros de consulta y paginación
 * @returns Promise con Either que contiene la lista o un error
 */
get[Entity]List(params: [ParamsType] = {}): Promise<ApiResult<[ResponseType]>> {
  return executeRequest(() => 
    api.get<[ResponseType]>('/[endpoint]', { params })
  )
}
```

### 4. Migrar Composables

#### Paso 1: Importar el nuevo servicio

```typescript
import { [module]ApiFunctional } from '../services/[module]ApiFunctional'
import { extractData } from '@core/either'
```

#### Paso 2: Usar el patrón Either

```typescript
const loadData = async (params: [ParamsType]) => {
  setLoading(true)
  
  const result = await [module]ApiFunctional.getData(params)
  
  const data = extractData(result, handleApiError)
  if (data) {
    // Procesar datos exitosos
    items.value = data
  }
  
  setLoading(false)
}
```

### 5. Manejo de Errores

#### Función de manejo de errores

```typescript
const handleApiError = (failure: any) => {
  setError(failure.error || 'Error desconocido')
}
```

#### Uso en composables

```typescript
const data = extractData(result, handleApiError)
```

## 📝 Ejemplos de Migración por Tipo de Endpoint

### GET - Obtener Lista

```typescript
// Antes
static async getList(params: ListParams = {}): Promise<ListResponse | null> {
  try {
    const response = await api.get<ListResponse>('/endpoint', { params })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Después
getList(params: ListParams = {}): Promise<ApiResult<ListResponse>> {
  return executeRequest(() => 
    api.get<ListResponse>('/endpoint', { params })
  )
}
```

### POST - Crear

```typescript
// Antes
static async create(data: CreateData): Promise<CreatedEntity | null> {
  try {
    const response = await api.post<CreatedEntity>('/endpoint', data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Después
static async create(data: CreateData): Promise<ApiResult<CreatedEntity>> {
  return executeRequest(() => 
    api.post<CreatedEntity>('/endpoint', data)
  )
}
```

### PUT - Actualizar

```typescript
// Antes
static async update(id: number, data: UpdateData): Promise<UpdatedEntity | null> {
  try {
    const response = await api.put<UpdatedEntity>(`/endpoint/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Después
static async update(id: number, data: UpdateData): Promise<ApiResult<UpdatedEntity>> {
  return executeRequest(() => 
    api.put<UpdatedEntity>(`/endpoint/${id}`, data)
  )
}
```

### DELETE - Eliminar

```typescript
// Antes
static async delete(id: number): Promise<DeleteResponse | null> {
  try {
    const response = await api.delete<DeleteResponse>(`/endpoint/${id}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Después
static async delete(id: number): Promise<ApiResult<DeleteResponse>> {
  return executeRequest(() => 
    api.delete<DeleteResponse>(`/endpoint/${id}`)
  )
}
```

## 🔧 Utilidades Adicionales

### Transformación de Datos

```typescript
import { mapEither } from '@core/either'

const result = await service.getData()
const transformedResult = mapEither(result, (data) => ({
  ...data,
  processed: true
}))
```

### Secuencia de Operaciones

```typescript
import { sequence } from '@core/either'

const results = await Promise.all([
  service.getData1(),
  service.getData2(),
  service.getData3()
])

const combinedResult = sequence(results)
```

## ✅ Beneficios de la Migración

1. **Manejo de Errores Consistente**: Todos los errores se manejan de la misma manera
2. **Programación Funcional**: Código más predecible y testeable
3. **Type Safety**: TypeScript puede inferir mejor los tipos de error
4. **Composabilidad**: Fácil composición de operaciones
5. **Documentación**: JSDoc obligatorio mejora la documentación
6. **Logging Automático**: Todos los errores se loguean automáticamente
7. **Objetos Funcionales**: Sin clases, solo interfaces y funciones puras
8. **Inmutabilidad**: Todos los objetos son inmutables por defecto

## 🚨 Consideraciones Importantes

1. **Compatibilidad**: Los nuevos servicios pueden coexistir con los antiguos durante la migración
2. **Testing**: Los nuevos servicios son más fáciles de testear
3. **Performance**: No hay overhead significativo en performance
4. **Learning Curve**: El equipo necesita aprender el patrón Either

## 🎯 ¿Por qué Objetos en lugar de Clases?

### Programación Funcional
- **Funciones Puras**: Sin efectos secundarios, siempre retornan el mismo resultado
- **Inmutabilidad**: No modificamos datos existentes, creamos nuevos objetos
- **Composición**: Construimos lógica compleja combinando funciones simples
- **Sin Estado Mutable**: Preferimos `const` sobre `let`

## 🚀 Either Mejorado para Errores Específicos del Negocio

### Problemas del Either Genérico
- ❌ Pérdida de información específica del endpoint
- ❌ No aprovecha el sistema de `reason` y `errorMap`
- ❌ Requiere mapeo manual de errores
- ❌ Demasiado genérico para necesidades específicas

### Solución: Either con BusinessError
```typescript
// ✅ Error específico del negocio con reason
export interface BusinessError {
  reason: string
  message?: string
  status?: number
  details?: any
}

// ✅ Error genérico para casos no mapeados
export interface GenericError {
  error: string
  code?: string
  status?: number
  details?: any
}

export type ApiFailure = BusinessError | GenericError
```

### Uso con Sistema de Errores Existente
```typescript
// ✅ Mapeo de errores específicos del módulo
export const CommerceErrors = {
  COMMERCE_NOT_FOUND: 'El comercio no fue encontrado',
  COMMERCE_ALREADY_EXISTS: 'El comercio ya existe',
  INVALID_COMMERCE_DATA: 'Los datos del comercio son inválidos',
  DEFAULT: 'Error en el módulo de comercio'
} as const

// ✅ Extracción y mapeo automático
const handleApiError = (failure: ApiFailure) => {
  const errorMessage = extractBusinessError(
    either,
    CommerceErrors,
    'Error desconocido'
  )
  setError(errorMessage)
}
```

### Beneficios de Objetos Funcionales
```typescript
// ✅ Correcto - Objeto funcional
export const commerceApiFunctional = {
  getRecurring(params: GetRecurringParams = {}): Promise<ApiResult<CommerceData[]>> {
    return executeRequest(() => api.get('/endpoint', { params }))
  }
}

// ❌ Incorrecto - Clase (no funcional)
export class CommerceApiService {
  static async getRecurring(params: GetRecurringParams = {}): Promise<ApiResult<CommerceData[]>> {
    return executeRequest(() => api.get('/endpoint', { params }))
  }
}
```

### Tipos Funcionales
```typescript
// ✅ Correcto - Interfaces funcionales
export interface Left<L> {
  readonly _tag: 'Left'
  readonly value: L
  isLeft(): this is Left<L>
  fold<B>(onLeft: (l: L) => B, _onRight: (r: never) => B): B
}

// ❌ Incorrecto - Clases (no funcionales)
export class Left<L> {
  constructor(readonly value: L) {}
  isLeft(): this is Left<L> { return true }
}
```

## 📚 Recursos Adicionales

- [Documentación de Either Pattern](https://en.wikipedia.org/wiki/Result_type)
- [Programación Funcional en TypeScript](https://www.typescriptlang.org/docs/)
- [Lineamientos de Código Base](https://www.notion.so/Lineamientos-de-c-digo-Base-2177916433be80198c6fe12ac136c508) 