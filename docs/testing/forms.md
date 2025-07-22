[⬅️ Volver al índice](./README.md)

## Testing de Formularios

¿Por qué testing específico para formularios?
Los formularios complejos con múltiples secciones, validación y estado compartido requieren estrategias de testing especializadas. Nuestro enfoque se basa en la experiencia del formulario de registro y las mejores prácticas de [Filament](https://filamentphp.com/docs/2.x/admin/testing).

#### 1. Testing de Formularios con Secciones Separadas

Patrón recomendado: Testing en capas - unitario para lógica, integración para flujo completo.

```typescript
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import RegisterFormStep from '@/modules/auth/views/RegisterFormStep/index.vue'

describe('Complex Form with Sections', () => {
  it('should render all form sections correctly', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar estructura del formulario
    expect(screen.getByTestId('main-form')).toBeInTheDocument()
    expect(screen.getByTestId('complete-step')).toBeInTheDocument()
    
    // Verificar secciones individuales
    expect(screen.getByTestId('basic-section')).toBeInTheDocument()
    expect(screen.getByTestId('residence-section')).toBeInTheDocument()
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
    expect(screen.getByTestId('preferences-section')).toBeInTheDocument()
  })

  it('should display form header with correct content', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar contenido del formulario
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear Cuenta')
    expect(screen.getByText('Completa los siguientes datos para crear tu cuenta')).toBeInTheDocument()
  })
})
```

#### 2. Mocks Avanzados para Element Plus

Patrón recomendado: Mocks que simulan comportamiento real de formularios. Ejemplo para el uso de componentes como el del design system

```typescript
// src/modules/auth/test/setup.ts
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
        return Promise.resolve(true)
      },
      resetFields() {
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
  ElInput: {
    name: 'ElInput',
    template: `
      <div class="el-input" v-bind="$attrs">
        <input 
          class="el-input__inner" 
          type="text" 
          :placeholder="placeholder"
          :value="modelValue" 
          @input="handleInput"
        />
      </div>
    `,
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    methods: {
      handleInput(event) {
        this.$emit('update:modelValue', event.target.value)
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
  }
}))
```

... (continúa con el resto de la sección de formularios del README original) 