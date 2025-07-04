<template>
  <div class="register-residence-section" data-test="section:residence">
    <div class="section-header">
      <h3>Información de Residencia</h3>
      <p>Datos de ubicación</p>
    </div>
    
    <div class="section-content">
      <div class="form-row">
        <el-form-item label="País" prop="country" label-position="top">
          <el-select
            v-model="form.country"
            placeholder="Selecciona tu país"
            style="width: 100%"
            data-test="select:country"
          >
            <el-option label="Colombia" value="colombia" />
            <el-option label="México" value="mexico" />
            <el-option label="Argentina" value="argentina" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Ciudad" prop="city" label-position="top">
          <el-input
            v-model="form.city"
            placeholder="Ingresa tu ciudad"
            data-test="input:city"
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
@import './RegisterResidence.styles.scss';
</style> 