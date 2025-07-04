<template>
  <div class="register-contact-section" data-test="section:contact">
    <div class="section-header">
      <h3>Información de Contacto</h3>
      <p>Datos de contacto de emergencia</p>
    </div>
    
    <div class="section-content">
      <div class="form-row">
        <el-form-item label="Contacto de Emergencia" prop="emergencyContact" label-position="top">
          <el-input
            v-model="form.emergencyContact"
            placeholder="Nombre del contacto de emergencia"
            data-test="input:emergency-contact"

          />
        </el-form-item>
        
        <el-form-item label="Teléfono de Emergencia" prop="emergencyPhone" label-position="top">
          <el-input
            v-model="form.emergencyPhone"
            placeholder="Teléfono de emergencia"
            data-test="input:emergency-phone"

          />
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectRegisterForm } from '../../composables/useRegisterFormProvider'

// Inyectar el provider
const { form } = injectRegisterForm()
</script>

<style scoped lang="scss">
@import './RegisterContact.styles.scss';
</style> 