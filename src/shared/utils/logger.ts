// Structured logging utility for the application

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

class Logger {
  private isDevelopment = import.meta.env.DEV

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.isDevelopment && level === LogLevel.DEBUG) {
      return
    }

    const formattedMessage = this.formatMessage(level, message, context)
    
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

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  // Convenience methods for common use cases
  apiRequest(method: string, url: string, context?: Record<string, any>): void {
    this.info(`API Request: ${method.toUpperCase()} ${url}`, context)
  }

  apiResponse(status: number, url: string, context?: Record<string, any>): void {
    this.info(`API Response: ${status} ${url}`, context)
  }

  apiError(status: number, url: string, error?: Error, context?: Record<string, any>): void {
    this.error(`API Error: ${status} ${url}`, context, error)
  }

  userAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, context)
  }

  componentLifecycle(component: string, lifecycle: string, context?: Record<string, any>): void {
    this.debug(`Component ${component}: ${lifecycle}`, context)
  }
}

export const logger = new Logger() 