/**
 * Patrón Either mejorado para manejo funcional de errores
 * Adaptado para aprovechar el sistema de errores específico del negocio
 */
export type Either<L, R> = Left<L> | Right<R>

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

/**
 * Tipos para respuestas de API con Either mejorado
 */
export interface ApiSuccess<T> {
  data: T
  status: number
}

/**
 * Error específico del negocio con reason y mapeo
 * Basado en la estructura real de errores de la API
 */
export interface BusinessError {
  code: string
  reason: string
  status: number
  message: string
}

/**
 * Error genérico para casos no mapeados
 */
export interface GenericError {
  code: string
  reason: string
  status: number
  message: string
}

export type ApiFailure = BusinessError | GenericError

export type ApiResult<T> = Either<ApiFailure, ApiSuccess<T>>

/**
 * Error de API con estructura estándar del backend
 * Basado en la estructura real de errores de la API
 */
export interface ApiError {
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