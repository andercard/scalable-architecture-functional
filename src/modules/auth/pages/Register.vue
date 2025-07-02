<template>
  <div class="register-container">
    <el-card class="register-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>Registro</h2>
        </div>
      </template>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-width="120px"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="Usuario" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="Ingresa tu usuario"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="registerForm.email"
            type="email"
            placeholder="Ingresa tu email"
            :prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="isLoading"
            @click="handleRegister"
            style="width: 100%"
          >
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </el-button>
        </el-form-item>
        
        <div class="form-footer">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { User, Message } from '@element-plus/icons-vue'
import { useRegister } from '../composables/useRegister'

const {
  registerFormRef,
  registerForm,
  isLoading,
  rules,
  handleRegister
} = useRegister()
</script>

<style scoped>
@import '../styles/Register.styles.scss';
</style> 