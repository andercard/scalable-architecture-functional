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
 * import { info, error, apiRequest } from '@shared/common/utils/logger'
 *
 * info('Mensaje informativo', { contexto: 'opcional' })
 * error('Mensaje de error', { contexto: 'opcional' }, new Error('Detalle'))
 * apiRequest('GET', '/api/anime', { params: { id: 1 } })
 *
 * También puedes usar el objeto logger para compatibilidad:
 * import { logger } from '@shared/common/utils/logger'
 * logger.info('Mensaje')
 *
 * --------------------------------------------------
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

// Determina si el entorno es desarrollo
const isDevelopment = import.meta.env.DEV

/**
 * Formatea el mensaje de log con timestamp, nivel y contexto
 */
const formatMessage = (level: LogLevel, message: string, context?: Record<string, any>): string => {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
}

/**
 * Determina si se debe mostrar el log según el entorno y el nivel
 */
const shouldLog = (level: LogLevel): boolean => {
  if (!isDevelopment && level === LogLevel.DEBUG) {
    return false
  }
  return true
}

/**
 * Imprime el mensaje en consola según el nivel
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
 */
const log = (level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void => {
  if (!shouldLog(level)) {
    return
  }
  const formattedMessage = formatMessage(level, message, context)
  logToConsole(level, formattedMessage, error)
}

/**
 * Log de nivel debug
 */
export const debug = (message: string, context?: Record<string, any>): void => {
  log(LogLevel.DEBUG, message, context)
}

/**
 * Log de nivel info
 */
export const info = (message: string, context?: Record<string, any>): void => {
  log(LogLevel.INFO, message, context)
}

/**
 * Log de nivel warn
 */
export const warn = (message: string, context?: Record<string, any>): void => {
  log(LogLevel.WARN, message, context)
}

/**
 * Log de nivel error
 */
export const error = (message: string, context?: Record<string, any>, error?: Error): void => {
  log(LogLevel.ERROR, message, context, error)
}

/**
 * Log para solicitudes de API
 */
export const apiRequest = (method: string, url: string, context?: Record<string, any>): void => {
  info(`API Request: ${method.toUpperCase()} ${url}`, context)
}

/**
 * Log para respuestas de API
 */
export const apiResponse = (status: number, url: string, context?: Record<string, any>): void => {
  info(`API Response: ${status} ${url}`, context)
}

/**
 * Log para errores de API
 */
export const apiError = (status: number, url: string, err?: Error, context?: Record<string, any>): void => {
  error(`API Error: ${status} ${url}`, context, err)
}

/**
 * Log para acciones de usuario
 */
export const userAction = (action: string, context?: Record<string, any>): void => {
  info(`User Action: ${action}`, context)
}

/**
 * Log para ciclos de vida de componentes
 */
export const componentLifecycle = (component: string, lifecycle: string, context?: Record<string, any>): void => {
  debug(`Component ${component}: ${lifecycle}`, context)
}

/**
 * Objeto logger para compatibilidad con el uso anterior
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