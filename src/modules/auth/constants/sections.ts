import type { RegisterSection } from '../types/Register.types'

export const REGISTER_SECTIONS: RegisterSection[] = [
  {
    id: 'basic',
    title: 'Datos Básicos',
    description: 'Información personal básica',
    isCompleted: false,
    isValid: false
  },
  {
    id: 'residence',
    title: 'Residencia',
    description: 'Información de dirección',
    isCompleted: false,
    isValid: false
  },
  {
    id: 'contact',
    title: 'Información de Contacto',
    description: 'Datos de contacto y emergencia',
    isCompleted: false,
    isValid: false
  },
  {
    id: 'preferences',
    title: 'Preferencias',
    description: 'Configuración de preferencias',
    isCompleted: false,
    isValid: false
  }
] 