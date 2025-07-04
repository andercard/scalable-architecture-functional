<template>
  <div class="register-preferences-section" data-test="section:preferences">
    <div class="section-header">
      <h3>Preferencias</h3>
      <p>Configuración de preferencias</p>
    </div>
    
    <div class="section-content">
      <el-form-item label="Newsletter" prop="newsletter" label-position="top">
        <el-switch
          v-model="form.newsletter"
          data-test="switch:newsletter"
        />
        <span class="switch-label">Recibir newsletter</span>
      </el-form-item>
      
      <el-form-item label="Marketing" prop="marketingConsent" label-position="top">
        <el-switch
          v-model="form.marketingConsent"
          data-test="switch:marketing"
        />
        <span class="switch-label">Recibir ofertas de marketing</span>
      </el-form-item>
      
      <el-form-item label="Términos" prop="termsAccepted" label-position="top">
        <el-checkbox
          v-model="form.termsAccepted"
          data-test="checkbox:terms"
        >
          Acepto los términos y condiciones
        </el-checkbox>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectRegisterForm } from '../../composables/useRegisterFormProvider'

// Inyectar el provider
const { form } = injectRegisterForm()
</script>

<style scoped lang="scss">
@import './RegisterPreferences.styles.scss';
</style> 