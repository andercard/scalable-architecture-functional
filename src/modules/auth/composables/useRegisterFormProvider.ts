import { reactive, ref, computed } from 'vue'
import type { RegisterForm, RegisterSection, RegisterFormProvider } from '../types/Register.types'

const initialForm: RegisterForm = {
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

const initialSections: RegisterSection[] = [
  { id: 'basic', title: 'Datos Básicos', description: '', isCompleted: false, isValid: false },
  { id: 'residence', title: 'Residencia', description: '', isCompleted: false, isValid: false },
  { id: 'contact', title: 'Contacto', description: '', isCompleted: false, isValid: false },
  { id: 'preferences', title: 'Preferencias', description: '', isCompleted: false, isValid: false }
]

export function useRegisterFormProvider(): RegisterFormProvider {
  const form = reactive({ ...initialForm })
  const sections = reactive([...initialSections])
  const currentSection = ref(0)
  const isLoading = ref(false)

  const isFormValid = computed(() => sections.every(s => s.isValid))

  function updateField<K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) {
    form[field] = value
  }

  function updateSection(sectionId: string, updates: Partial<RegisterSection>) {
    const section = sections.find(s => s.id === sectionId)
    if (section) Object.assign(section, updates)
  }

  function nextSection() {
    if (currentSection.value < sections.length - 1) currentSection.value++
  }

  function previousSection() {
    if (currentSection.value > 0) currentSection.value--
  }

  function goToSection(index: number) {
    if (index >= 0 && index < sections.length) currentSection.value = index
  }

  function validateSection(sectionId: string) {
    // Aquí iría la lógica de validación real por sección
    const section = sections.find(s => s.id === sectionId)
    if (section) section.isValid = true
    return !!section?.isValid
  }

  function validateForm() {
    // Aquí iría la lógica de validación global
    return isFormValid.value
  }

  async function submitForm() {
    isLoading.value = true
    // Simular envío
    await new Promise(r => setTimeout(r, 1000))
    isLoading.value = false
  }

  return {
    form,
    sections,
    currentSection,
    isFormValid,
    isLoading,
    updateField,
    updateSection,
    nextSection,
    previousSection,
    goToSection,
    validateSection,
    validateForm,
    submitForm
  }
} 