import { ref, computed } from 'vue'
import { Location } from '@element-plus/icons-vue'
import { useRegisterFormProvider } from './useRegisterFormProvider'
import { COUNTRIES } from '../constants/countries'
import type { FormInstance, FormRules } from 'element-plus'

const { form, sections } = useRegisterFormProvider()

const formRef = ref<FormInstance>()

const section = computed(() => sections.find(s => s.id === 'residence')!)

const countries = COUNTRIES

const rules: FormRules = {
  country: [
    { required: true, message: 'Por favor selecciona tu país', trigger: 'change' }
  ],
  state: [
    { required: true, message: 'Por favor ingresa tu estado o provincia', trigger: 'blur' }
  ],
  city: [
    { required: true, message: 'Por favor ingresa tu ciudad', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Por favor ingresa tu dirección', trigger: 'blur' },
    { min: 10, message: 'La dirección debe tener al menos 10 caracteres', trigger: 'blur' }
  ],
  postalCode: [
    { required: true, message: 'Por favor ingresa tu código postal', trigger: 'blur' },
    { min: 4, message: 'El código postal debe tener al menos 4 caracteres', trigger: 'blur' }
  ]
}

export {
  form,
  sections,
  formRef,
  section,
  countries,
  rules,
  Location
} 