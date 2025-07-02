// Errores comunes de la aplicación

export interface AppError {
  message: string
  code?: string
  details?: any
}

export const createError = (message: string, code?: string, details?: any): AppError => ({
  message,
  code,
  details
}) 