import type { FormRules } from 'element-plus'
import type { RegisterCredentials } from '../types'

export function useRegisterValidation(form: RegisterCredentials) {
  const formRules: FormRules = {
    firstName: [
      { required: true, message: 'El nombre es requerido', trigger: 'blur' },
      { min: 2, max: 50, message: 'El nombre debe tener entre 2 y 50 caracteres', trigger: 'blur' }
    ],
    username: [
      { required: true, message: 'El usuario es requerido', trigger: 'blur' },
      { min: 3, max: 20, message: 'El usuario debe tener entre 3 y 20 caracteres', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: 'El usuario solo puede contener letras, números y guiones bajos', trigger: 'blur' }
    ],
    country: [
      { required: true, message: 'El país es requerido', trigger: 'change' }
    ],
    city: [
      { required: true, message: 'La ciudad es requerida', trigger: 'blur' }
    ],
    emergencyContact: [
      { required: true, message: 'El contacto de emergencia es requerido', trigger: 'blur' }
    ],
    emergencyPhone: [
      { required: true, message: 'El teléfono de emergencia es requerido', trigger: 'blur' }
    ],
    termsAccepted: [
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('Debes aceptar los términos y condiciones'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  }

  return {
    formRules
  }
} 