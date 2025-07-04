<template>
  <div class="register-form-step" data-test="view:register-form-step">
    <div class="register-container">
      <div class="register-header">
        <h1>Crear Cuenta</h1>
        <p>Completa los siguientes datos para crear tu cuenta</p>
      </div>

      <!-- Contenido del formulario -->
      <div class="form-container">
        <el-form
          ref="mainFormRef"
          :model="form"
          :rules="formRules"
          class="main-form"
          data-test="form:main"
        >
          <!-- Todas las secciones en un solo step -->
          <div class="step-content" data-test="step:complete">
            <RegisterBasic />
            <RegisterResidence />
            <RegisterContact />
            <RegisterPreferences />
          </div>
        </el-form>

        <!-- Botones de navegación -->
        <div class="navigation-buttons">
          <el-button
            type="success"
            @click="onSubmit"
            :loading="isLoading"
            data-test="button:submit"
          >
            Crear Cuenta
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterBasic from '../../sections/RegisterBasic/index.vue'
import RegisterResidence from '../../sections/RegisterResidence/index.vue'
import RegisterContact from '../../sections/RegisterContact/index.vue'
import RegisterPreferences from '../../sections/RegisterPreferences/index.vue'
import { useRegisterFormStep } from './useRegisterFormStep'

// Emitir eventos
const emit = defineEmits<{
  'registration-success': [username: string]
}>()

// Composable para manejo del formulario
const {
  form,
  isLoading,
  mainFormRef,
  formRules,
  onSubmit
} = useRegisterFormStep(emit)
</script>

<style scoped lang="scss">
@import './RegisterFormStep.styles.scss';
</style> 