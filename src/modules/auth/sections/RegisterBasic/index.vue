<template>
  <div class="register-basic-section" data-test="section:basic">
    <div class="section-header">
      <h3>Datos Básicos</h3>
      <p>Información personal básica</p>
    </div>
    
    <div class="section-content">
      <div class="form-row">
        <el-form-item label="Nombre" prop="firstName" label-position="top">
          <el-input
            v-model="form.firstName"
            placeholder="Ingresa tu nombre"
            :prefix-icon="User"
            data-test="input:first-name"
          />
        </el-form-item>
        
        <el-form-item label="Usuario" prop="username" label-position="top">
          <el-input
            v-model="form.username"
            placeholder="Ingresa tu usuario"
            :prefix-icon="User"
            data-test="input:username"
          />
        </el-form-item>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { injectRegisterForm } from '../../composables/useRegisterFormProvider'


const { form } = injectRegisterForm()
</script>

<style scoped lang="scss">
@import './RegisterBasic.styles.scss';
</style> 