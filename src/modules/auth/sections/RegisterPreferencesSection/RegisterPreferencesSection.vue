// Este archivo será movido a src/modules/auth/sections/RegisterPreferencesSection/RegisterPreferencesSection.vue
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
      <el-form-item label="Newsletter" prop="newsletter">
        <el-checkbox v-model="form.newsletter">
          Quiero recibir noticias y actualizaciones por email
        </el-checkbox>
      </el-form-item>
      
      <el-form-item label="Marketing" prop="marketingConsent">
        <el-checkbox v-model="form.marketingConsent">
          Acepto recibir ofertas y promociones
        </el-checkbox>
      </el-form-item>
      
      <el-form-item label="Términos y Condiciones" prop="termsAccepted">
        <el-checkbox v-model="form.termsAccepted">
          He leído y acepto los 
          <el-link type="primary" href="#" @click.prevent="showTerms">
            términos y condiciones
          </el-link>
          y la 
          <el-link type="primary" href="#" @click.prevent="showPrivacy">
            política de privacidad
          </el-link>
        </el-checkbox>
      </el-form-item>
      
      <div class="terms-info">
        <p class="terms-text">
          Al marcar esta casilla, confirmas que has leído y comprendido nuestros términos de servicio 
          y política de privacidad. Tus datos serán tratados de acuerdo con nuestra política de 
          protección de datos.
        </p>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useRegisterPreferencesSection } from './useRegisterPreferencesSection'

const {
  form,
  formRef,
  section,
  showTerms,
  showPrivacy,
  rules
} = useRegisterPreferencesSection()
</script>

<style scoped lang="scss">
@import './RegisterPreferencesSection.styles.scss';
</style> 