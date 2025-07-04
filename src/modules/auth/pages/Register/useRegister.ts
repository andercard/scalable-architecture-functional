import { ref } from 'vue'

export const useRegister = () => {
  const currentStep = ref(0)
  const registeredUsername = ref('')

  const handleRegistrationSuccess = (username: string) => {
    registeredUsername.value = username
    currentStep.value = 1
  }

  return {
    currentStep,
    registeredUsername,
    handleRegistrationSuccess
  }
} 