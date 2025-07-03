import type { Ref, ComputedRef } from 'vue'

export interface RegisterForm {
  // Datos básicos
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  dateOfBirth: string
  
  // Residencia
  country: string
  state: string
  city: string
  address: string
  postalCode: string
  
  // Información de contacto
  phone: string
  emergencyContact: string
  emergencyPhone: string
  
  // Preferencias
  newsletter: boolean
  termsAccepted: boolean
  marketingConsent: boolean
}

export interface RegisterSection {
  id: string
  title: string
  description: string
  isCompleted: boolean
  isValid: boolean
}

export interface RegisterFormProvider {
  form: RegisterForm
  sections: RegisterSection[]
  currentSection: Ref<number>
  isFormValid: ComputedRef<boolean>
  isLoading: Ref<boolean>
  updateField: <K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) => void
  updateSection: (sectionId: string, updates: Partial<RegisterSection>) => void
  nextSection: () => void
  previousSection: () => void
  goToSection: (index: number) => void
  validateSection: (sectionId: string) => boolean
  validateForm: () => boolean
  submitForm: () => Promise<void>
}