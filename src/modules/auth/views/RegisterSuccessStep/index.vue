<template>
  <div class="register-success-step" data-test="view:register-success-step">
    <div class="success-container">
      <div class="success-header">
        <h1>¡Cuenta Creada Exitosamente!</h1>
        <p>Tu cuenta ha sido creada y está lista para usar</p>
      </div>

      <div class="success-content">
        <el-icon class="success-icon" color="#67c23a" size="64">
          <CircleCheckFilled />
        </el-icon>
        
        <div class="success-message">
          <p>
            Tu cuenta ha sido creada exitosamente para el usuario 
            <strong>{{ username }}</strong>
          </p>
          <p class="success-subtitle">
            Ya puedes iniciar sesión y comenzar a explorar
          </p>
        </div>

        <div class="success-actions">
          <el-button 
            type="primary" 
            size="large"
            @click="goToLogin" 
            data-test="button:go-to-login"
          >
            Ir al Login
          </el-button>
          
          <el-button 
            size="large"
            @click="goToHome" 
            data-test="button:go-to-home"
          >
            Ir al Inicio
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { useRegisterSuccessStep } from './useRegisterSuccessStep'

// Props
interface Props {
  username: string
}

defineProps<Props>()

const { goToLogin, goToHome } = useRegisterSuccessStep()
</script>

<style scoped lang="scss">
@import './RegisterSuccessStep.styles.scss';
</style> 