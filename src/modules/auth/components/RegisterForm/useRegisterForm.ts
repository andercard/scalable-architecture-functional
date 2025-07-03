import { computed } from 'vue'
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'
import { useRegisterFormProvider } from '../../composables/useRegisterFormProvider'
import RegisterBasic from '../../sections/RegisterBasic/RegisterBasic.vue'
import RegisterResidence from '../../sections/RegisterResidence/RegisterResidence.vue'
import RegisterContact from '../../sections/RegisterContact/RegisterContact.vue'
import RegisterPreferences from '../../sections/RegisterPreferences/RegisterPreferences.vue'

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
    basic: RegisterBasic,
    residence: RegisterResidence,
    contact: RegisterContact,
    preferences: RegisterPreferences
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