/**
 * logger.ts
 * --------------------------------------------------
 * Utilidad de logging estructurado para la aplicación.
 * Permite registrar mensajes en consola con diferentes niveles y contexto.
 *
 * Niveles soportados: debug, info, warn, error
 * Incluye funciones especializadas para logging de API, acciones de usuario y ciclos de vida de componentes.
 *
 * Uso recomendado:
 *
 * import { info, error, apiRequest } from '@/shared/common/utils/logger'
 *
 * info('Mensaje informativo', { contexto: 'opcional' })
 * error('Mensaje de error', { contexto: 'opcional' }, new Error('Detalle'))
 * apiRequest('GET', '/api/anime', { params: { id: 1 } })
 *
 * También puedes usar el objeto logger para compatibilidad:
 * import { logger } from '@/shared/common/utils/logger'
 * logger.info('Mensaje')
 *
 * --------------------------------------------------
 */

/**
 * Niveles de logging disponibles
 * @enum {string}
 */
export enum LogLevel {
  /** Nivel de debug - solo visible en desarrollo */
  DEBUG = 'debug',
  /** Nivel informativo - visible en todos los entornos */
  INFO = 'info',
  /** Nivel de advertencia - visible en todos los entornos */
  WARN = 'warn',
  /** Nivel de error - visible en todos los entornos */
  ERROR = 'error'
}

/**
 * Estructura de una entrada de log
 * @interface LogEntry
 */
export interface LogEntry {
  /** Nivel del log */
  level: LogLevel
  /** Mensaje descriptivo */
  message: string
  /** Timestamp en formato ISO */
  timestamp: string
  /** Contexto adicional opcional */
  context?: Record<string, any>
  /** Error asociado (solo para logs de error) */
  error?: Error
}

// Determina si el entorno es desarrollo
const isDevelopment = import.meta.env.DEV

/**
 * Formatea el mensaje de log con timestamp, nivel y contexto
 * @param {LogLevel} level - Nivel del log
 * @param {string} message - Mensaje descriptivo
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @returns {string} Mensaje formateado
 * @private
 */
const formatMessage = (level: LogLevel, message: string, context?: Record<string, any>): string => {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
}

/**
 * Determina si se debe mostrar el log según el entorno y el nivel
 * @param {LogLevel} level - Nivel del log
 * @returns {boolean} true si se debe mostrar el log
 * @private
 */
const shouldLog = (level: LogLevel): boolean => {
  if (!isDevelopment && level === LogLevel.DEBUG) {
    return false
  }
  return true
}

/**
 * Imprime el mensaje en consola según el nivel
 * @param {LogLevel} level - Nivel del log
 * @param {string} formattedMessage - Mensaje ya formateado
 * @param {Error} [error] - Error asociado (solo para logs de error)
 * @private
 */
const logToConsole = (level: LogLevel, formattedMessage: string, error?: Error): void => {
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMessage)
      break
    case LogLevel.INFO:
      console.info(formattedMessage)
      break
    case LogLevel.WARN:
      console.warn(formattedMessage)
      break
    case LogLevel.ERROR:
      console.error(formattedMessage, error)
      break
  }
}

/**
 * Función principal de logging
 * @param {LogLevel} level - Nivel del log
 * @param {string} message - Mensaje descriptivo
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @param {Error} [error] - Error asociado (solo para logs de error)
 * @private
 */
const log = (level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void => {
  if (!shouldLog(level)) {
    return
  }
  const formattedMessage = formatMessage(level, message, context)
  logToConsole(level, formattedMessage, error)
}

/**
 * Registra un mensaje de nivel debug
 * @description Solo visible en entorno de desarrollo
 * @param {string} message - Mensaje descriptivo
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * debug('Procesando datos', { totalItems: 25, sampleItem: data[0] })
 * // Salida: [2024-01-15T16:35:10.123Z] DEBUG: Procesando datos | {"totalItems":25,"sampleItem":{"id":1}}
 * ```
 */
export const debug = (message: string, context?: Record<string, any>): void => {
  log(LogLevel.DEBUG, message, context)
}

/**
 * Registra un mensaje de nivel info
 * @description Visible en todos los entornos
 * @param {string} message - Mensaje descriptivo
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * info('Usuario logueado exitosamente', { username: 'demo', timestamp: Date.now() })
 * // Salida: [2024-01-15T16:35:10.123Z] INFO: Usuario logueado exitosamente | {"username":"demo","timestamp":1705332910123}
 * ```
 */
export const info = (message: string, context?: Record<string, any>): void => {
  log(LogLevel.INFO, message, context)
}

/**
 * Registra un mensaje de nivel warn
 * @description Visible en todos los entornos
 * @param {string} message - Mensaje descriptivo
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * warn('Datos incompletos recibidos', { receivedFields: ['id', 'title'], expectedFields: ['id', 'title', 'description'] })
 * // Salida: [2024-01-15T16:35:10.123Z] WARN: Datos incompletos recibidos | {"receivedFields":["id","title"],"expectedFields":["id","title","description"]}
 * ```
 */
export const warn = (message: string, context?: Record<string, any>): void => {
  log(LogLevel.WARN, message, context)
}

/**
 * Registra un mensaje de nivel error
 * @description Visible en todos los entornos
 * @param {string} message - Mensaje descriptivo
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @param {Error} [error] - Error asociado
 * @example
 * ```typescript
 * error('Error al cargar datos', { endpoint: '/api/anime', params: { id: 123 } }, new Error('Network timeout'))
 * // Salida: [2024-01-15T16:35:10.123Z] ERROR: Error al cargar datos | {"endpoint":"/api/anime","params":{"id":123}} Error: Network timeout
 * ```
 */
export const error = (message: string, context?: Record<string, any>, error?: Error): void => {
  log(LogLevel.ERROR, message, context, error)
}

/**
 * Registra una solicitud de API
 * @description Wrapper de info() especializado para requests de API
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - URL de la solicitud
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * apiRequest('GET', '/api/anime', { params: { page: 1, limit: 20 } })
 * // Salida: [2024-01-15T16:35:10.123Z] INFO: API Request: GET /api/anime | {"params":{"page":1,"limit":20}}
 * ```
 */
export const apiRequest = (method: string, url: string, context?: Record<string, any>): void => {
  info(`API Request: ${method.toUpperCase()} ${url}`, context)
}

/**
 * Registra una respuesta exitosa de API
 * @description Wrapper de info() especializado para responses de API
 * @param {number} status - Código de estado HTTP
 * @param {string} url - URL de la solicitud
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * apiResponse(200, '/api/anime', { count: 25, pagination: { current_page: 1 } })
 * // Salida: [2024-01-15T16:35:10.123Z] INFO: API Response: 200 /api/anime | {"count":25,"pagination":{"current_page":1}}
 * ```
 */
export const apiResponse = (status: number, url: string, context?: Record<string, any>): void => {
  info(`API Response: ${status} ${url}`, context)
}

/**
 * Registra un error de API
 * @description Wrapper de error() especializado para errores de API
 * @param {number} status - Código de estado HTTP
 * @param {string} url - URL de la solicitud
 * @param {Error} [err] - Error asociado
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * apiError(404, '/api/anime/99999', new Error('Not found'), { params: { id: 99999 } })
 * // Salida: [2024-01-15T16:35:10.123Z] ERROR: API Error: 404 /api/anime/99999 | {"params":{"id":99999}} Error: Not found
 * ```
 */
export const apiError = (status: number, url: string, err?: Error, context?: Record<string, any>): void => {
  error(`API Error: ${status} ${url}`, context, err)
}

/**
 * Registra una acción del usuario
 * @description Wrapper de info() especializado para acciones de usuario
 * @param {string} action - Descripción de la acción
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * userAction('anime_card_clicked', { animeId: 12345, animeTitle: 'Naruto' })
 * // Salida: [2024-01-15T16:35:10.123Z] INFO: User Action: anime_card_clicked | {"animeId":12345,"animeTitle":"Naruto"}
 * ```
 */
export const userAction = (action: string, context?: Record<string, any>): void => {
  info(`User Action: ${action}`, context)
}

/**
 * Registra el ciclo de vida de un componente
 * @description Wrapper de debug() especializado para ciclos de vida de componentes
 * @param {string} component - Nombre del componente
 * @param {string} lifecycle - Fase del ciclo de vida (mounted, updated, unmounted, etc.)
 * @param {Record<string, any>} [context] - Contexto adicional opcional
 * @example
 * ```typescript
 * componentLifecycle('AnimeCard', 'mounted', { animeId: 12345, props: { showImage: true } })
 * // Salida: [2024-01-15T16:35:10.123Z] DEBUG: Component AnimeCard: mounted | {"animeId":12345,"props":{"showImage":true}}
 * ```
 */
export const componentLifecycle = (component: string, lifecycle: string, context?: Record<string, any>): void => {
  debug(`Component ${component}: ${lifecycle}`, context)
}

/**
 * Objeto logger para compatibilidad con el uso anterior
 * @description Proporciona acceso a todas las funciones de logging a través de un objeto
 * @example
 * ```typescript
 * import { logger } from '@shared/common/utils/logger'
 * 
 * logger.info('Mensaje informativo', { contexto: 'opcional' })
 * logger.error('Mensaje de error', { contexto: 'opcional' }, new Error('Detalle'))
 * logger.apiRequest('GET', '/api/anime', { params: { id: 1 } })
 * logger.userAction('button_clicked', { buttonId: 'submit' })
 * logger.componentLifecycle('MyComponent', 'mounted', { props: 'data' })
 * ```
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  apiRequest,
  apiResponse,
  apiError,
  userAction,
  componentLifecycle
} 