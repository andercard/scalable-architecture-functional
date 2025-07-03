// Este archivo ha sido movido a src/modules/auth/components/RegisterForm/RegisterForm.vue
<template>
  <div class="register-form-container">
    <el-card class="register-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>Registro de Usuario</h2>
          <p>Completa la información en cada sección</p>
        </div>
      </template>
      
      <div class="progress-section">
        <el-steps :active="currentSection" finish-status="success" align-center>
          <el-step
            v-for="(section, index) in sections"
            :key="section.id"
            :title="section.title"
            :status="getStepStatus(index)"
          />
        </el-steps>
      </div>
      
      <div class="section-content">
        <transition name="fade" mode="out-in">
          <component :is="currentSectionComponent" :key="currentSection" />
        </transition>
      </div>
      
      <div class="navigation-buttons">
        <el-button
          v-if="currentSection > 0"
          @click="previousSection"
          :disabled="isLoading"
        >
          <el-icon><ArrowLeft /></el-icon>
          Anterior
        </el-button>
        
        <el-button
          v-if="currentSection < sections.length - 1"
          type="primary"
          @click="nextSection"
          :disabled="!sections[currentSection].isValid || isLoading"
        >
          Siguiente
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        
        <el-button
          v-if="currentSection === sections.length - 1"
          type="success"
          @click="submitForm"
          :loading="isLoading"
          :disabled="!isFormValid"
        >
          <el-icon><Check /></el-icon>
          {{ isLoading ? 'Registrando...' : 'Completar Registro' }}
        </el-button>
      </div>
      
      <div class="section-navigation">
        <el-button
          v-for="(section, index) in sections"
          :key="section.id"
          :type="currentSection === index ? 'primary' : 'default'"
          :disabled="!section.isCompleted && index > 0 && !sections[index - 1].isCompleted"
          size="small"
          @click="goToSection(index)"
        >
          {{ section.title }}
          <el-icon v-if="section.isCompleted" class="completed-icon">
            <Check />
          </el-icon>
        </el-button>
      </div>
      
      <div class="form-footer">
        <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRegisterForm } from './useRegisterForm'

const {
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
} = useRegisterForm()
</script>

<style scoped lang="scss">
@import './RegisterForm.styles.scss';
</style> 