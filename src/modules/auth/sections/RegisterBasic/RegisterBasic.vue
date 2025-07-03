// Este archivo será movido a src/modules/auth/sections/RegisterBasicSection/RegisterBasicSection.vue
<template>
  <div class="register-section">
    <div class="section-header">
      <h3>{{ section.title }}</h3>
      <p>{{ section.description }}</p>
    </div>
    
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="section-form"
    >
      <div class="form-row">
        <el-form-item label="Nombre" prop="firstName">
          <el-input
            v-model="form.firstName"
            placeholder="Ingresa tu nombre"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="Apellido" prop="lastName">
          <el-input
            v-model="form.lastName"
            placeholder="Ingresa tu apellido"
            :prefix-icon="User"
          />
        </el-form-item>
      </div>
      
      <div class="form-row">
        <el-form-item label="Usuario" prop="username">
          <el-input
            v-model="form.username"
            placeholder="Ingresa tu usuario"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="Ingresa tu email"
            :prefix-icon="Message"
          />
        </el-form-item>
      </div>
      
      <div class="form-row">
        <el-form-item label="Contraseña" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Ingresa tu contraseña"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="Confirmar" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirma tu contraseña"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
      </div>
      
      <el-form-item label="Fecha de Nacimiento" prop="dateOfBirth">
        <el-date-picker
          v-model="form.dateOfBirth"
          type="date"
          placeholder="Selecciona tu fecha de nacimiento"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useRegisterBasic } from './useRegisterBasic'

const {
  form,
  formRef,
  section,
  rules,
  User,
  Message,
  Lock
} = useRegisterBasic()
</script>

<style scoped lang="scss">
@import './RegisterBasic.styles.scss';
</style> 