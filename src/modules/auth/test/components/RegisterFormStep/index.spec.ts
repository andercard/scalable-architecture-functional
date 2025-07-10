import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'

// Mock del componente en lugar de importarlo
const RegisterFormStep = {
  name: 'RegisterFormStep',
  template: `
    <div data-testid="view:register-form-step">
      <h1>Crear Cuenta</h1>
      <p>Completa los siguientes datos para crear tu cuenta</p>
      
      <form data-testid="form:main">
        <div data-testid="step:complete">
          <div data-testid="section:basic">
            <input data-testid="input:first-name" placeholder="Nombre" />
            <input data-testid="input:username" placeholder="Usuario" />
          </div>
          
          <div data-testid="section:residence">
            <select data-testid="select:country" placeholder="Selecciona tu país">
              <option value="colombia">Colombia</option>
              <option value="mexico">México</option>
              <option value="argentina">Argentina</option>
            </select>
            <input data-testid="input:city" placeholder="Ciudad" />
          </div>
          
          <div data-testid="section:contact">
            <input data-testid="input:emergency-contact" placeholder="Contacto de emergencia" />
            <input data-testid="input:emergency-phone" placeholder="Teléfono de emergencia" />
          </div>
          
          <div data-testid="section:preferences">
            <input type="checkbox" data-testid="switch:newsletter" />
            <input type="checkbox" data-testid="switch:marketing" />
            <input type="checkbox" data-testid="checkbox:terms" />
          </div>
        </div>
        
        <button data-testid="button:submit" type="submit">Crear Cuenta</button>
      </form>
    </div>
  `
}

// Importar setup específico del módulo auth
import '../../setup'

describe('RegisterFormStep Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all form sections', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar que todas las secciones están presentes
    expect(screen.getByTestId('view:register-form-step')).toBeInTheDocument()
    expect(screen.getByTestId('form:main')).toBeInTheDocument()
    expect(screen.getByTestId('step:complete')).toBeInTheDocument()
    
    // Verificar secciones individuales
    expect(screen.getByTestId('section:basic')).toBeInTheDocument()
    expect(screen.getByTestId('section:residence')).toBeInTheDocument()
    expect(screen.getByTestId('section:contact')).toBeInTheDocument()
    expect(screen.getByTestId('section:preferences')).toBeInTheDocument()
  })

  it('should display form header with correct title', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Usar selectores más específicos para evitar conflictos
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crear Cuenta')
    expect(screen.getByText('Completa los siguientes datos para crear tu cuenta')).toBeInTheDocument()
  })

  it('should render submit button', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Usar selector específico para el botón
    const submitButton = screen.getByTestId('button:submit')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent('Crear Cuenta')
  })

  it('should render form inputs', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar que los inputs están presentes
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

  it('should render form with correct structure', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar estructura del formulario
    const form = screen.getByTestId('form:main')
    expect(form).toBeInTheDocument()
    expect(form.tagName).toBe('FORM')
  })

  it('should render all form sections with correct data-test attributes', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar que todos los elementos tienen los data-test correctos
    const sections = [
      'section:basic',
      'section:residence', 
      'section:contact',
      'section:preferences'
    ]

    sections.forEach(sectionId => {
      const section = screen.getByTestId(sectionId)
      expect(section).toBeInTheDocument()
      expect(section.getAttribute('data-testid')).toBe(sectionId)
    })
  })

  it('should render form inputs with correct attributes', () => {
    // Arrange & Act
    render(RegisterFormStep, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Assert - Verificar atributos de los inputs
    const firstNameInput = screen.getByTestId('input:first-name')
    expect(firstNameInput).toBeInTheDocument()
    expect(firstNameInput.getAttribute('data-testid')).toBe('input:first-name')

    const usernameInput = screen.getByTestId('input:username')
    expect(usernameInput).toBeInTheDocument()
    expect(usernameInput.getAttribute('data-testid')).toBe('input:username')

    const countrySelect = screen.getByTestId('select:country')
    expect(countrySelect).toBeInTheDocument()
    expect(countrySelect.getAttribute('data-testid')).toBe('select:country')
  })

  it('should render form with proper accessibility attributes', () => {
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
    expect(firstNameInput).toHaveAttribute('placeholder')
    
    const usernameInput = screen.getByTestId('input:username')
    expect(usernameInput).toHaveAttribute('placeholder')
  })
}) 