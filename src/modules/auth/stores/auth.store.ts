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

      // Validación simple para demo - solo requiere username
      if (credentials.username && credentials.username.trim() !== '') {
        const mockUser: User = {
          id: '1',
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjOGI1Y2Y2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTAgMTIwQzUwIDEwMCA3MCA4MCA5MCA4MEgxMTBDMTMwIDgwIDE1MCAxMDAgMTUwIDEyMFYxNTBINTBWMTIwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+'
        }
        
        user.value = mockUser
        localStorage.setItem('user', JSON.stringify(mockUser))
        return true
      } else {
        throw new Error('Usuario requerido')
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

      // Validación simple para demo - solo requiere username y email
      if (credentials.username && credentials.username.trim() !== '' && 
          credentials.email && credentials.email.trim() !== '') {
        
        const mockUser: User = {
          id: Date.now().toString(),
          username: credentials.username,
          email: credentials.email,
          avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjOGI1Y2Y2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTAgMTIwQzUwIDEwMCA3MCA4MCA5MCA4MEgxMTBDMTMwIDgwIDE1MCAxMDAgMTUwIDEyMFYxNTBINTBWMTIwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+'
        }
        
        user.value = mockUser
        localStorage.setItem('user', JSON.stringify(mockUser))
        return true
      } else {
        throw new Error('Usuario y email son requeridos')
      }
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