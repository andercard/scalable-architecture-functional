/**
 * Core Either Pattern - Exports principales
 * Patrón funcional para manejo de errores y resultados
 */

// Tipos principales
export type {
  Either,
  Left,
  Right,
  ApiSuccess,
  ApiFailure,
  BusinessError,
  GenericError,
  ApiResult,
  ApiError
} from './types'

// Funciones helper para crear Either
export {
  left,
  right
} from './utils'

// Utilidades para manejo de Either
export {
  handleSuccessResponse,
  handleErrorResponse,
  executeRequest,
  sequence,
  mapEither
} from './utils' 