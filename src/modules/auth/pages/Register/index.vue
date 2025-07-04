<template>
  <div class="register-page" data-test="page:register">
    <RegisterFormStep 
      v-if="currentStep === 0"
      @registration-success="handleRegistrationSuccess"
    />
    
    <RegisterSuccessStep 
      v-if="currentStep === 1"
      :username="registeredUsername"
    />
  </div>
</template>

<script setup lang="ts">
import RegisterFormStep from '../../views/RegisterFormStep/index.vue'
import RegisterSuccessStep from '../../views/RegisterSuccessStep/index.vue'
import { useRegister } from './useRegister'

const { currentStep, registeredUsername, handleRegistrationSuccess } = useRegister()
</script> 