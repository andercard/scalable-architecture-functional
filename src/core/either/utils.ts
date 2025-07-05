import type { Either, ApiSuccess, ApiFailure, BusinessError, GenericError, ApiError, Left, Right } from './types'
import { logger } from '@/shared/common/utils/logger'

/**
 * Convierte una respuesta exitosa de Axios a ApiSuccess
 * @param response - Respuesta exitosa de Axios
 * @returns ApiSuccess con los datos de la respuesta
 */
export const handleSuccessResponse = <T>(response: any): ApiSuccess<T> => {
  const success: ApiSuccess<T> = {
    data: response.data,
    status: response.status
  }

  return success
}

/**
 * Convierte un error de Axios a un Either con BusinessError o GenericError
 * @param error - Error de Axios
 * @returns Either con BusinessError o GenericError
 */
export const handleErrorResponse = (error: any): Either<ApiFailure, never> => {
  const err = error as ApiError
  const { code, reason, message } = err.response?.data || {}
  const status = err.response?.status || 500
  
  // Si tenemos un reason, es un error de negocio
  if (reason) {
    const businessError: BusinessError = {
      code: code || 'UNKNOWN',
      reason,
      status,
      message: message || getErrorMessage(error)
    }
    
    logger.apiError(
      status,
      error.config?.url || '',
      error,
      { message: err.message, reason, code }
    )
    
    return left(businessError)
  }
  
  // Si no hay reason, es un error genérico
  const genericError: GenericError = {
    code: error.code || 'UNKNOWN',
    reason: 'GENERIC_ERROR',
    status,
    message: getErrorMessage(error)
  }
  
  logger.apiError(
    status,
    error.config?.url || '',
    error,
    { message: error.message }
  )
  
  return left(genericError)
}

/**
 * Obtiene un mensaje de error legible basado en el tipo de error
 * @param error - Error de Axios
 * @returns Mensaje de error legible
 */
const getErrorMessage = (error: any): string => {
  if (error.response) {
    const status = error.response.status
    switch (status) {
      case 400:
        return 'Solicitud incorrecta'
      case 401:
        return 'No autorizado'
      case 403:
        return 'Acceso prohibido'
      case 404:
        return 'Recurso no encontrado'
      case 409:
        return 'Conflicto de datos'
      case 422:
        return 'Datos de validación incorrectos'
      case 429:
        return 'Demasiadas solicitudes. Intenta de nuevo en unos minutos'
      case 500:
        return 'Error interno del servidor'
      case 502:
        return 'Error de gateway'
      case 503:
        return 'Servicio no disponible'
      default:
        return `Error del servidor: ${status}`
    }
  } else if (error.request) {
    return 'Error de conexión. Verifica tu conexión a internet'
  } else {
    return 'Error de configuración de la solicitud'
  }
}

/**
 * Ejecuta una función asíncrona y maneja automáticamente los errores con Either
 * @param requestFn - Función que retorna una promesa de Axios
 * @returns Promise con Either
 */
export const executeRequest = async <T>(
  requestFn: () => Promise<any>
): Promise<Either<ApiFailure, ApiSuccess<T>>> => {
  try {
    const response = await requestFn()
    const success = handleSuccessResponse<T>(response)
    return right(success)
  } catch (error) {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      return handleErrorResponse(error)
    }
    
    // Error no esperado
    const unexpectedError: GenericError = {
      code: 'UNEXPECTED_ERROR',
      reason: 'UNEXPECTED_ERROR',
      status: 500,
      message: 'Error inesperado'
    }
    
    logger.error('Unexpected Error', { error }, error as Error)
    return left(unexpectedError)
  }
}

/**
 * Función helper para manejar múltiples Either en secuencia
 * @param eithers - Array de Either
 * @returns Either con array de datos exitosos o primer error encontrado
 */
export const sequence = <T>(
  eithers: Either<ApiFailure, ApiSuccess<T>>[]
): Either<ApiFailure, ApiSuccess<T[]>> => {
  const results: T[] = []
  
  for (const either of eithers) {
    if (either.isLeft()) {
      return left(either.value)
    }
    results.push(either.value.data)
  }
  
  return right({
    data: results,
    status: 200
  })
}

/**
 * Función helper para transformar datos de un Either
 * @param either - Either original
 * @param transform - Función de transformación
 * @returns Either con datos transformados
 */
export const mapEither = <T, U>(
  either: Either<ApiFailure, ApiSuccess<T>>,
  transform: (data: T) => U
): Either<ApiFailure, ApiSuccess<U>> => {
  return either.map(success => ({
    ...success,
    data: transform(success.data)
  }))
}

/**
 * Implementación funcional de Left
 */
const createLeft = <L>(value: L): Left<L> => ({
  _tag: 'Left',
  value,
  isLeft: function(this: Left<L>): this is Left<L> { return true },
  isRight: function(this: Left<L>): this is Right<never> { return false },
  map: () => createLeft(value) as any,
  flatMap: () => createLeft(value) as any,
  fold: (onLeft) => onLeft(value)
})

/**
 * Implementación funcional de Right
 */
const createRight = <R>(value: R): Right<R> => ({
  _tag: 'Right',
  value,
  isLeft: function(this: Right<R>): this is Left<never> { return false },
  isRight: function(this: Right<R>): this is Right<R> { return true },
  map: (f) => createRight(f(value)),
  flatMap: (f) => f(value),
  fold: (_, onRight) => onRight(value)
})

/**
 * Funciones helper para crear Either
 */
export const left = <L>(value: L): Left<L> => createLeft(value)
export const right = <R>(value: R): Right<R> => createRight(value)