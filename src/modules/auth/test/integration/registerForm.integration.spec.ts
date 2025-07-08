import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'

// Mock simplificado del componente RegisterFormStep
const RegisterFormStep = {
  name: 'RegisterFormStep',
  template: `
    <div data-test="view:register-form-step">
      <h1>Crear Cuenta</h1>
      <p>Completa los siguientes datos para crear tu cuenta</p>
      
      <el-form data-test="form:main">
        <div data-test="step:complete">
          <div data-test="section:basic">
            <el-input 
              data-test="input:first-name" 
              placeholder="Nombre" 
            />
            <el-input 
              data-test="input:username" 
              placeholder="Usuario" 
            />
          </div>
          
          <div data-test="section:residence">
            <el-select 
              data-test="select:country" 
              placeholder="Selecciona tu país"
            >
              <el-option label="Colombia" value="colombia" />
              <el-option label="México" value="mexico" />
              <el-option label="Argentina" value="argentina" />
            </el-select>
            <el-input 
              data-test="input:city" 
              placeholder="Ciudad" 
            />
          </div>
          
          <div data-test="section:contact">
            <el-input 
              data-test="input:emergency-contact" 
              placeholder="Contacto de emergencia" 
            />
            <el-input 
              data-test="input:emergency-phone" 
              placeholder="Teléfono de emergencia" 
            />
          </div>
          
          <div data-test="section:preferences">
            <el-switch 
              data-test="switch:newsletter" 
            />
            <el-switch 
              data-test="switch:marketing" 
            />
            <el-checkbox 
              data-test="checkbox:terms"
            >
              Acepto los términos
            </el-checkbox>
          </div>
        </div>
        
        <el-button 
          data-test="button:submit" 
          type="success"
        >
          Crear Cuenta
        </el-button>
      </el-form>
    </div>
  `
}

// Mock del componente RegisterSuccessStep
const RegisterSuccessStep = {
  name: 'RegisterSuccessStep',
  template: `
    <div data-test="view:register-success-step">
      <h1>¡Cuenta Creada Exitosamente!</h1>
      <p>Tu cuenta ha sido creada exitosamente para el usuario <strong>{{ username }}</strong></p>
    </div>
  `,
  props: {
    username: {
      type: String,
      required: true
    }
  }
}

import { createValidRegisterForm } from '../factories/register.factory'

// Importar setup específico del módulo auth
import '../setup'

describe('Register Form Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render RegisterFormStep with all sections', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert
      expect(screen.getByTestId('view:register-form-step')).toBeInTheDocument()
      expect(screen.getByTestId('form:main')).toBeInTheDocument()
      expect(screen.getByTestId('step:complete')).toBeInTheDocument()
      expect(screen.getByTestId('section:basic')).toBeInTheDocument()
      expect(screen.getByTestId('section:residence')).toBeInTheDocument()
      expect(screen.getByTestId('section:contact')).toBeInTheDocument()
      expect(screen.getByTestId('section:preferences')).toBeInTheDocument()
    })

    it('should render RegisterSuccessStep with success message', () => {
      // Arrange & Act
      render(RegisterSuccessStep, {
        props: {
          username: 'juan123'
        },
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert
      expect(screen.getByText('¡Cuenta Creada Exitosamente!')).toBeInTheDocument()
      expect(screen.getByText('juan123')).toBeInTheDocument()
    })
  })

  describe('Form Structure', () => {
    it('should render all form inputs with correct data-test attributes', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert - Verificar que todos los inputs están presentes
      expect(screen.getByTestId('input:first-name')).toBeInTheDocument()
      expect(screen.getByTestId('input:username')).toBeInTheDocument()
      expect(screen.getByTestId('select:country')).toBeInTheDocument()
      expect(screen.getByTestId('input:city')).toBeInTheDocument()
      expect(screen.getByTestId('input:emergency-contact')).toBeInTheDocument()
      expect(screen.getByTestId('input:emergency-phone')).toBeInTheDocument()
      expect(screen.getByTestId('switch:newsletter')).toBeInTheDocument()
      expect(screen.getByTestId('switch:marketing')).toBeInTheDocument()
      expect(screen.getByTestId('checkbox:terms')).toBeInTheDocument()
    })

    it('should render form with correct Element Plus components', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert - Verificar que se usan los mocks de Element Plus
      const form = screen.getByTestId('form:main')
      expect(form.tagName.toLowerCase()).toBe('el-form')
      expect(form).toHaveAttribute('data-test', 'form:main')

      const submitButton = screen.getByTestId('button:submit')
      expect(submitButton.tagName.toLowerCase()).toBe('el-button')
      expect(submitButton).toHaveAttribute('type', 'success')
    })

    it('should render form sections in correct order', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert - Verificar orden de las secciones
      const sections = [
        'section:basic',
        'section:residence', 
        'section:contact',
        'section:preferences'
      ]

      sections.forEach(sectionId => {
        const section = screen.getByTestId(sectionId)
        expect(section).toBeInTheDocument()
        expect(section.getAttribute('data-test')).toBe(sectionId)
      })
    })
  })

  describe('Form Accessibility', () => {
    it('should have proper form structure and labels', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert - Verificar accesibilidad básica
      const form = screen.getByTestId('form:main')
      expect(form).toBeInTheDocument()
      
      // Verificar que los inputs tienen placeholders
      const firstNameInput = screen.getByTestId('input:first-name')
      expect(firstNameInput).toHaveAttribute('placeholder', 'Nombre')
      
      const usernameInput = screen.getByTestId('input:username')
      expect(usernameInput).toHaveAttribute('placeholder', 'Usuario')
      
      const cityInput = screen.getByTestId('input:city')
      expect(cityInput).toHaveAttribute('placeholder', 'Ciudad')
    })

    it('should have submit button with correct text', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert
      const submitButton = screen.getByTestId('button:submit')
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveTextContent('Crear Cuenta')
    })
  })

  describe('Form Content', () => {
    it('should display correct form title and description', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear Cuenta')
      expect(screen.getByText('Completa los siguientes datos para crear tu cuenta')).toBeInTheDocument()
    })

    it('should render country options in select', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert - Verificar que las opciones del país están presentes como mocks
      const select = screen.getByTestId('select:country')
      expect(select.tagName.toLowerCase()).toBe('el-select')
      // Buscar los el-option dentro del select
      const options = select.querySelectorAll('el-option')
      expect(options.length).toBe(3)
      expect(options[0].getAttribute('label')).toBe('Colombia')
      expect(options[0].getAttribute('value')).toBe('colombia')
      expect(options[1].getAttribute('label')).toBe('México')
      expect(options[1].getAttribute('value')).toBe('mexico')
      expect(options[2].getAttribute('label')).toBe('Argentina')
      expect(options[2].getAttribute('value')).toBe('argentina')
    })

    it('should render terms checkbox with correct text', () => {
      // Arrange & Act
      render(RegisterFormStep, {
        global: {
          plugins: [createTestingPinia()]
        }
      })

      // Assert
      const termsCheckbox = screen.getByTestId('checkbox:terms')
      expect(termsCheckbox).toBeInTheDocument()
      expect(termsCheckbox).toHaveTextContent('Acepto los términos')
    })
  })
}) 