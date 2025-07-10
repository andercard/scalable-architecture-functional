import type { RegisterCredentials } from '../types/Auth.types'

export const INITIAL_REGISTER_FORM: RegisterCredentials = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  country: '',
  state: '',
  city: '',
  address: '',
  postalCode: '',
  phone: '',
  emergencyContact: '',
  emergencyPhone: '',
  newsletter: false,
  termsAccepted: false,
  marketingConsent: false
} 