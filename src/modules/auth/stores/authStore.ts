import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User, LoginCredentials, RegisterCredentials } from '../types/Auth.types'

export const useAuthStore = defineStore('auth', () => {
  // Estado reactivo
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)

  // Acciones
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulación de login local
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validación simple para demo
      if (credentials.username === 'demo' && credentials.password === 'demo123') {
        const mockUser: User = {
          id: '1',
          username: credentials.username,
          email: 'demo@example.com',
          avatar: 'https://via.placeholder.com/150'
        }
        
        user.value = mockUser
        localStorage.setItem('user', JSON.stringify(mockUser))
        return true
      } else {
        throw new Error('Credenciales inválidas')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en el login'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulación de registro local
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validación simple para demo
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Las contraseñas no coinciden')
      }

      const mockUser: User = {
        id: Date.now().toString(),
        username: credentials.username,
        email: credentials.email,
        avatar: 'https://via.placeholder.com/150'
      }
      
      user.value = mockUser
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en el registro'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        localStorage.removeItem('user')
      }
    }
  }

  // Inicializar estado desde localStorage
  checkAuth()

  return {
    // Estado
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,
    
    // Acciones
    login,
    register,
    logout,
    checkAuth
  }
}) 