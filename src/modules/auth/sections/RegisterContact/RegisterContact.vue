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
      <el-form-item label="Teléfono" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="Ingresa tu número de teléfono"
          :prefix-icon="Phone"
        />
      </el-form-item>
      
      <el-form-item label="Contacto de Emergencia" prop="emergencyContact">
        <el-input
          v-model="form.emergencyContact"
          placeholder="Nombre del contacto de emergencia"
          :prefix-icon="User"
        />
      </el-form-item>
      
      <el-form-item label="Teléfono de Emergencia" prop="emergencyPhone">
        <el-input
          v-model="form.emergencyPhone"
          placeholder="Teléfono del contacto de emergencia"
          :prefix-icon="Phone"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useRegisterContact } from './useRegisterContact'

const {
  form,
  formRef,
  section,
  rules,
  Phone,
  User
} = useRegisterContact()
</script>

<style scoped lang="scss">
@import './RegisterContact.styles.scss';
</style> 