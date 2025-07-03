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
        <el-form-item label="País" prop="country">
          <el-select
            v-model="form.country"
            placeholder="Selecciona tu país"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="country in countries"
              :key="country.value"
              :label="country.label"
              :value="country.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Estado/Provincia" prop="state">
          <el-input
            v-model="form.state"
            placeholder="Ingresa tu estado o provincia"
            :prefix-icon="Location"
          />
        </el-form-item>
      </div>
      
      <div class="form-row">
        <el-form-item label="Ciudad" prop="city">
          <el-input
            v-model="form.city"
            placeholder="Ingresa tu ciudad"
            :prefix-icon="Location"
          />
        </el-form-item>
        
        <el-form-item label="Código Postal" prop="postalCode">
          <el-input
            v-model="form.postalCode"
            placeholder="Ingresa tu código postal"
            :prefix-icon="Location"
          />
        </el-form-item>
      </div>
      
      <el-form-item label="Dirección" prop="address">
        <el-input
          v-model="form.address"
          type="textarea"
          :rows="3"
          placeholder="Ingresa tu dirección completa"
          :prefix-icon="Location"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useRegisterResidence } from './useRegisterResidence'

const {
  form,
  formRef,
  section,
  countries,
  rules,
  Location
} = useRegisterResidence()
</script>

<style scoped lang="scss">
@import './RegisterResidence.styles.scss';
</style> 