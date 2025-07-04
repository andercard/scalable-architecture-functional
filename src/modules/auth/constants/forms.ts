import type { RegisterCredentials } from '../types/Auth.types'

export const INITIAL_REGISTER_FORM: RegisterCredentials = {
  username: '',
  firstName: '',
  country: '',
  city: '',
  emergencyContact: '',
  emergencyPhone: '',
  newsletter: false,
  termsAccepted: false,
  marketingConsent: false
} 