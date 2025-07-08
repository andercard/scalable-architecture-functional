import { vi } from 'vitest'

// Importar setup global
import '../../../../test/setup'

/**
 * SETUP ESPECÍFICO PARA MÓDULO AUTH
 * 
 * Mocks avanzados para componentes de Element Plus usados en el formulario de registro
 * Simulan el comportamiento real de formularios, inputs y botones
 */

// Mock completo de Element Plus para el módulo auth
vi.mock('element-plus', () => ({
  ElForm: {
    name: 'ElForm',
    template: `
      <form v-bind="$attrs" @submit.prevent="$emit('submit')">
        <slot />
      </form>
    `,
    props: ['model', 'rules'],
    emits: ['submit'],
    methods: {
      validate() {
        // Simular validación exitosa
        return Promise.resolve(true)
      },
      resetFields() {
        // Simular reset de campos
        if (this.model) {
          Object.keys(this.model).forEach(key => {
            if (typeof this.model[key] === 'boolean') {
              this.model[key] = false
            } else {
              this.model[key] = ''
            }
          })
        }
        return Promise.resolve()
      }
    }
  },
  ElFormItem: {
    name: 'ElFormItem',
    template: '<div v-bind="$attrs"><slot /></div>',
    props: ['label', 'prop', 'labelPosition']
  },
  ElInput: {
    name: 'ElInput',
    template: `
      <div class="el-input" v-bind="$attrs">
        <input 
          class="el-input__inner" 
          type="text" 
          autocomplete="off" 
          tabindex="0" 
          :placeholder="placeholder"
          :value="modelValue" 
          @input="handleInput"
          @blur="$emit('blur')"
        />
      </div>
    `,
    props: ['modelValue', 'placeholder', 'prefixIcon'],
    emits: ['update:modelValue', 'blur'],
    methods: {
      handleInput(event) {
        this.$emit('update:modelValue', event.target.value)
      }
    }
  },
  ElSelect: {
    name: 'ElSelect',
    template: `
      <div class="el-select" v-bind="$attrs">
        <select 
          class="el-select__inner" 
          :value="modelValue" 
          @change="handleChange"
        >
          <slot />
        </select>
      </div>
    `,
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    methods: {
      handleChange(event) {
        this.$emit('update:modelValue', event.target.value)
      }
    }
  },
  ElOption: {
    name: 'ElOption',
    template: '<option :value="value">{{ label }}</option>',
    props: ['label', 'value']
  },
  ElSwitch: {
    name: 'ElSwitch',
    template: `
      <div class="el-switch" v-bind="$attrs">
        <input 
          type="checkbox" 
          class="el-switch__input"
          :checked="modelValue" 
          @change="handleChange"
        />
      </div>
    `,
    props: ['modelValue'],
    emits: ['update:modelValue'],
    methods: {
      handleChange(event) {
        this.$emit('update:modelValue', event.target.checked)
      }
    }
  },
  ElCheckbox: {
    name: 'ElCheckbox',
    template: `
      <div class="el-checkbox" v-bind="$attrs">
        <input 
          type="checkbox" 
          class="el-checkbox__input"
          :checked="modelValue" 
          @change="handleChange"
        />
        <span class="el-checkbox__label"><slot /></span>
      </div>
    `,
    props: ['modelValue'],
    emits: ['update:modelValue'],
    methods: {
      handleChange(event) {
        this.$emit('update:modelValue', event.target.checked)
      }
    }
  },
  ElButton: {
    name: 'ElButton',
    template: `
      <button 
        class="el-button" 
        :type="type" 
        :disabled="loading || disabled" 
        @click="handleClick" 
        v-bind="$attrs"
      >
        <slot />
      </button>
    `,
    props: ['type', 'loading', 'disabled'],
    emits: ['click'],
    methods: {
      handleClick(event) {
        if (!this.loading && !this.disabled) {
          this.$emit('click', event)
        }
      }
    }
  },
  ElIcon: {
    name: 'ElIcon',
    template: '<div class="el-icon" v-bind="$attrs"><slot /></div>',
    props: ['color', 'size']
  },
  ElMessage: vi.fn(),
  ElMessageBox: vi.fn(),
  ElNotification: vi.fn(),
  ElLoading: vi.fn()
}))

// Mock de iconos de Element Plus
vi.mock('@element-plus/icons-vue', () => ({
  User: 'UserIcon',
  CircleCheckFilled: 'CircleCheckFilledIcon'
}))

// Mock de Vue Router para tests de navegación
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: {
      value: {
        path: '/',
        params: {},
        query: {},
        hash: ''
      }
    }
  }),
  useRoute: () => ({
    path: '/',
    params: {},
    query: {},
    hash: ''
  })
}))

// Exportar utilidades específicas del módulo
export { createMockRegisterForm, createValidRegisterForm } from './factories/register.factory' 