import { computed } from 'vue'
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'
import { useRegisterFormProvider } from '../../composables/useRegisterFormProvider'
import RegisterBasicSection from '../../sections/RegisterBasicSection/RegisterBasicSection.vue'
import RegisterResidenceSection from '../../sections/RegisterResidenceSection/RegisterResidenceSection.vue'
import RegisterContactSection from '../../sections/RegisterContactSection/RegisterContactSection.vue'
import RegisterPreferencesSection from '../../sections/RegisterPreferencesSection/RegisterPreferencesSection.vue'

export function useRegisterForm() {
  const {
    sections,
    currentSection,
    isFormValid,
    isLoading,
    nextSection,
    previousSection,
    goToSection,
    submitForm
  } = useRegisterFormProvider()

  const sectionComponents = {
    basic: RegisterBasicSection,
    residence: RegisterResidenceSection,
    contact: RegisterContactSection,
    preferences: RegisterPreferencesSection
  }

  const currentSectionComponent = computed(() => {
    const currentSectionId = sections[currentSection.value]?.id
    return currentSectionId ? sectionComponents[currentSectionId as keyof typeof sectionComponents] : null
  })

  const getStepStatus = (index: number) => {
    if (index < currentSection.value) {
      return sections[index].isValid ? 'success' : 'error'
    } else if (index === currentSection.value) {
      return 'process'
    } else {
      return 'wait'
    }
  }

  return {
    ArrowLeft,
    ArrowRight,
    Check,
    sections,
    currentSection,
    isFormValid,
    isLoading,
    nextSection,
    previousSection,
    goToSection,
    submitForm,
    currentSectionComponent,
    getStepStatus
  }
} 