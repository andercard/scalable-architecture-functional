<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>Iniciar Sesión</h2>
        </div>
      </template>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="120px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Usuario" prop="username">
          <el-input
            data-test="input:username"
            v-model="loginForm.username"
            placeholder="Ingresa tu usuario"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            data-test="button:login-submit"
            type="primary"
            :loading="isLoading"
            @click="handleLogin"
            style="width: 100%"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </el-button>
        </el-form-item>
        
        <div class="form-footer">
          <p>¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { useLogin } from '../composables/useLogin'

const {
  loginFormRef,
  loginForm,
  isLoading,
  rules,
  handleLogin
} = useLogin()
</script>

<style scoped>
@import '../styles/Login.styles.scss';
</style> 