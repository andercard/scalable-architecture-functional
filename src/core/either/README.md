# Patrón Either - Manejo Funcional de Errores

Este módulo implementa el patrón Either para el manejo funcional de errores en la aplicación, proporcionando una forma segura y predecible de manejar resultados exitosos y errores.

## Características

- ✅ Manejo funcional de errores con Either
- ✅ Integración con Axios para respuestas de API
- ✅ Mapeo de errores por reason específico del endpoint
- ✅ Funciones helper para composición y transformación
- ✅ Tipado fuerte con TypeScript

## Estructura

```
src/core/either/
├── index.ts      # Exports principales
├── types.ts      # Tipos y interfaces
├── utils.ts      # Funciones helper
└── README.md     # Esta documentación
```

## Tipos Principales

### `Either<L, R>`
Tipo base que representa un valor que puede ser éxito (`Right<R>`) o error (`Left<L>`).

### `ApiResult<T>`
Alias para `Either<ApiFailure, ApiSuccess<T>>` - usado para respuestas de API.

### `ApiSuccess<T>`
Interfaz para respuestas exitosas de API:
```ts
interface ApiSuccess<T> {
  data: T
  status: number
}
```

### `ApiFailure`
Union type de errores de API:
```ts
type ApiFailure = BusinessError | GenericError
```

### `BusinessError`
Error específico del negocio con reason:
```ts
interface BusinessError {
  code: string
  reason: string
  status: number
  message: string
}
```

### `GenericError`
Error genérico para casos no mapeados:
```ts
interface GenericError {
  code: string
  reason: string
  status: number
  message: string
}
```

### `ApiError`
Interfaz para errores de Axios con estructura del backend:
```ts
interface ApiError {
  response?: {
    data?: {
      code?: string
      reason?: string
      source?: string
      hideModalError?: boolean
      message?: string
    }
    status?: number
  }
  message?: string
}
```

## Uso Básico

### 1. Servicio con Either

```ts
import { executeRequest } from '@core/either'
import api from '@/core/api'

export const userService = {
  async getUser(id: string) {
    return executeRequest(() => api.get(`/users/${id}`))
  }
}
```

### 2. Composable con manejo de errores

```ts
import { ref } from 'vue'
import { userService } from './user.services'
import { getReasonMessage } from '@/shared/errors'

export const useUser = () => {
  const user = ref(null)
  const error = ref('')

  const fetchUser = async (id: string) => {
    const result = await userService.getUser(id)
    
    result.fold(
      (failure) => {
        // Manejo de error con mapeo por reason
        const message = getReasonMessage(failure, ErrorUser)
        if (message) {
          error.value = message
        }
      },
      (success) => {
        user.value = success.data
        error.value = ''
      }
    )
  }

  return { user, error, fetchUser }
}
```

## Funciones Helper

### `executeRequest`

Wrapper para llamadas a API que retorna un Either automáticamente.

```ts
const result = await executeRequest(() => api.get('/users'))
```

### `flatMap` - Encadenamiento de operaciones

`flatMap` permite encadenar operaciones que retornan Either, propagando automáticamente los errores.

```ts
// Ejemplo: Obtener usuario y luego sus posts
const getUserWithPosts = async (userId: string) => {
  const userResult = await userService.getUser(userId)
  
  return userResult.flatMap(user => 
    postService.getUserPosts(user.data.id)
  )
}

// Uso
const result = await getUserWithPosts('123')
result.fold(
  (failure) => {
    // Si falla getUser O getPosts, aquí se maneja el error
    console.error('Error:', failure)
  },
  (success) => {
    // success.data contiene los posts del usuario
    console.log('Posts del usuario:', success.data)
  }
)
```

### Encadenamiento múltiple con `flatMap`

```ts
// Ejemplo complejo: Usuario → Posts → Comentarios
const getUserPostsAndComments = async (userId: string) => {
  const userResult = await userService.getUser(userId)
  
  return userResult
    .flatMap(user => postService.getUserPosts(user.data.id))
    .flatMap(posts => {
      // Obtener comentarios del primer post
      const firstPost = posts.data[0]
      if (!firstPost) {
        return left({
          code: 'NO_POSTS',
          reason: 'USER_HAS_NO_POSTS',
          status: 404,
          message: 'El usuario no tiene posts'
        })
      }
      return commentService.getPostComments(firstPost.id)
    })
}

// Uso
const result = await getUserPostsAndComments('123')
result.fold(
  (failure) => {
    // Maneja cualquier error en la cadena
    const message = getReasonMessage(failure, ErrorUser)
    if (message) showToast(message)
  },
  (success) => {
    // success.data contiene los comentarios
    console.log('Comentarios:', success.data)
  }
)
```

### `sequence`

Ejecuta múltiples operaciones y retorna un Either con todos los resultados o el primer error.

```ts
// Ejemplo: Cargar datos de usuario, posts y amigos
const loadUserDashboard = async (userId: number) => {
  const [userResult, postsResult, friendsResult] = await Promise.all([
    userService.getUser(userId),
    postService.getUserPosts(userId),
    friendService.getUserFriends(userId)
  ])

  const combinedResult = sequence([userResult, postsResult, friendsResult])
  
  combinedResult.fold(
    (failure) => {
      console.error('Error en dashboard:', failure)
    },
    ([user, posts, friends]) => {
      // Todos los datos cargados exitosamente
      console.log('Dashboard cargado:', { user, posts, friends })
    }
  )
}
```

### `mapEither`

Transforma el valor de un Either si es exitoso.

```ts
// Transformar datos de usuario
const userResult = await userService.getUser(id)
const formattedUser = mapEither(userResult, (user) => ({
  ...user,
  fullName: `${user.firstName} ${user.lastName}`,
  isAdult: user.age >= 18
}))
```

### Combinación de `sequence` y `mapEither`

```ts
// Cargar y transformar múltiples datos
const loadAndTransformData = async () => {
  const [usersResult, postsResult] = await Promise.all([
    userService.getUsers(),
    postService.getPosts()
  ])

  const combinedResult = sequence([usersResult, postsResult])
  const transformedResult = mapEither(combinedResult, ([users, posts]) => ({
    users: users.map(user => ({ ...user, fullName: `${user.firstName} ${user.lastName}` })),
    posts: posts.filter(post => post.isPublished)
  }))

  transformedResult.fold(
    (failure) => console.error('Error:', failure),
    (data) => console.log('Datos transformados:', data)
  )
}
```

## Manejo de Múltiples Errores

### Caso 1: Parar en el primer error

```ts
export const useTransfer = () => {
  const isLoading = ref(false)
  const transferSuccess = ref(false)

  const handleSendTransfer = async (payload: TransferPayload) => {
    isLoading.value = true
    transferSuccess.value = false

    // Primer servicio: transferencia
    const transferResult = await transferService.sendTransfer(payload)
    if (transferResult.isLeft()) {
      const message = getReasonMessage(transferResult.value, ErrorLimitCca)
      if (message) {
        showToast(message)
      }
      isLoading.value = false
      return
    }

    // Segundo servicio: obtener balance
    const balanceResult = await accountService.getBalance(payload.accountId)
    if (balanceResult.isLeft()) {
      const message = getReasonMessage(balanceResult.value, ErrorAccount)
      if (message) {
        showToast(message)
      }
      isLoading.value = false
      return
    }

    // Si ambos servicios son exitosos
    transferSuccess.value = true
    isLoading.value = false
  }

  return {
    isLoading,
    transferSuccess,
    handleSendTransfer
  }
}
```

### Caso 2: Ejecutar todos y mostrar todos los errores

```ts
const handleMultipleOperations = async () => {
  const results = await Promise.all([
    service1.operation1(),
    service2.operation2(),
    service3.operation3()
  ])

  const errors = results
    .filter(result => result.isLeft())
    .map(result => getReasonMessage(result.value, ErrorMap))

  if (errors.length > 0) {
    // Mostrar todos los errores
    errors.forEach(error => {
      if (error) showToast(error)
    })
    return
  }

  // Todos exitosos
  console.log('Todas las operaciones completadas')
}
```

## Mapeo de Errores por Reason

### Definir errores específicos del endpoint

```ts
// src/shared/errors/transfer.errors.ts
export type ErrorTransfer =
  | 'INSUFFICIENT_FUNDS'
  | 'ACCOUNT_NOT_FOUND'
  | 'TRANSFER_LIMIT_EXCEEDED'
  | 'DEFAULT'

export const ErrorTransfer: Record<ErrorTransfer, string> = {
  INSUFFICIENT_FUNDS: 'Saldo insuficiente para realizar la transferencia',
  ACCOUNT_NOT_FOUND: 'Cuenta de destino no encontrada',
  TRANSFER_LIMIT_EXCEEDED: 'Límite de transferencia excedido',
  DEFAULT: 'Error al procesar la transferencia'
}
```

### Usar en composables

```ts
import { getReasonMessage } from '@/shared/errors'
import { ErrorTransfer } from '@/shared/errors/transfer.errors'

const result = await transferService.sendTransfer(payload)
result.fold(
  (failure) => {
    const message = getReasonMessage(failure, ErrorTransfer)
    if (message) {
      showToast(message)
    }
  },
  (success) => {
    console.log('Transferencia exitosa:', success.data)
  }
)
```

## Testing del Patrón Either

### Verificar que `flatMap` funciona correctamente

```ts
import { left, right } from '@core/either'

// Test 1: flatMap con Right
const successResult = right({ data: { id: 1, name: 'John' }, status: 200 })
const mappedResult = successResult.flatMap(user => 
  right({ data: { posts: [] }, status: 200 })
)

console.log(mappedResult.isRight()) // true
console.log(mappedResult.value) // { data: { posts: [] }, status: 200 }

// Test 2: flatMap con Left (propaga el error)
const errorResult = left({
  code: 'USER_NOT_FOUND',
  reason: 'USER_NOT_FOUND',
  status: 404,
  message: 'Usuario no encontrado'
})

const mappedError = errorResult.flatMap(user => 
  right({ data: { posts: [] }, status: 200 })
)

console.log(mappedError.isLeft()) // true
console.log(mappedError.value) // { code: 'USER_NOT_FOUND', ... }

// Test 3: Encadenamiento múltiple
const chainResult = right({ data: { id: 1 }, status: 200 })
  .flatMap(user => right({ data: { posts: [{ id: 1 }] }, status: 200 }))
  .flatMap(posts => right({ data: { comments: [] }, status: 200 }))

console.log(chainResult.isRight()) // true
console.log(chainResult.value.data) // { comments: [] }
```

### Verificar que `map` funciona correctamente

```ts
// Test: map transforma datos sin cambiar la estructura
const userResult = right({ data: { id: 1, name: 'John' }, status: 200 })
const transformedResult = userResult.map(user => ({
  ...user,
  data: { ...user.data, fullName: `${user.data.name} Doe` }
}))

console.log(transformedResult.isRight()) // true
console.log(transformedResult.value.data.fullName) // 'John Doe'
```

## Ventajas del Patrón Either

1. **Manejo explícito de errores**: No hay errores silenciosos
2. **Composición funcional**: Fácil combinación de operaciones
3. **Tipado fuerte**: TypeScript garantiza el manejo correcto
4. **Sin excepciones**: Control total sobre el flujo de errores
5. **Testeable**: Fácil de testear cada rama (éxito/error) 