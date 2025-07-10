import '../setup'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth.store'
import { 
  createMockUser, 
  createValidLoginCredentials, 
  createInvalidLoginCredentials,
  createValidRegisterForm,
  createInvalidRegisterForm 
} from '../factories'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Estado Inicial', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useAuthStore()
      
      // Assert
      expect(store.user).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Getters Computados', () => {
    it('should compute isAuthenticated correctly when user is present', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidLoginCredentials()
      
      // Act
      await store.login(credentials)
      
      // Assert
      expect(store.isAuthenticated).toBe(true)
    })

    it('should compute isAuthenticated correctly when user is null', () => {
      // Arrange
      const store = useAuthStore()
      
      // Act & Assert
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Acción Login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidLoginCredentials()
      
      // Act
      const result = await store.login(credentials)
      
      // Assert
      expect(result).toBe(true)
      expect(store.user).toBeDefined()
      expect(store.user?.username).toBe(credentials.username)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('should fail login with invalid credentials', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createInvalidLoginCredentials()
      
      // Act
      const result = await store.login(credentials)
      
      // Assert
      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Usuario requerido')
      expect(store.isLoading).toBe(false)
    })

    it('should handle loading state during login', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidLoginCredentials()
      
      // Act
      const loginPromise = store.login(credentials)
      
      // Assert - During loading
      expect(store.isLoading).toBe(true)
      
      // Act - Wait for completion
      await loginPromise
      
      // Assert - After loading
      expect(store.isLoading).toBe(false)
    })

    it('should store user in localStorage after successful login', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidLoginCredentials()
      
      // Act
      await store.login(credentials)
      
      // Assert
      const storedUser = localStorage.getItem('user')
      expect(storedUser).toBeDefined()
      expect(JSON.parse(storedUser!)).toEqual(store.user)
    })
  })

  describe('Acción Register', () => {
    it('should register successfully with valid credentials', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidRegisterForm()
      
      // Act
      const result = await store.register(credentials)
      
      // Assert
      expect(result).toBe(true)
      expect(store.user).toBeDefined()
      expect(store.user?.username).toBe(credentials.username)
      expect(store.user?.email).toBe(credentials.email)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
      expect(store.isLoading).toBe(false)
    })

    it('should fail registration with invalid credentials', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createInvalidRegisterForm()
      
      // Act
      const result = await store.register(credentials)
      
      // Assert
      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Todos los campos obligatorios deben estar completos')
      expect(store.isLoading).toBe(false)
    })

    it('should handle loading state during registration', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidRegisterForm()
      
      // Act
      const registerPromise = store.register(credentials)
      
      // Assert - During loading
      expect(store.isLoading).toBe(true)
      
      // Act - Wait for completion
      await registerPromise
      
      // Assert - After loading
      expect(store.isLoading).toBe(false)
    })

    it('should store user in localStorage after successful registration', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidRegisterForm()
      
      // Act
      await store.register(credentials)
      
      // Assert
      const storedUser = localStorage.getItem('user')
      expect(storedUser).toBeDefined()
      expect(JSON.parse(storedUser!)).toEqual(store.user)
    })
  })

  describe('Acción Logout', () => {
    it('should logout successfully', async () => {
      // Arrange
      const store = useAuthStore()
      const credentials = createValidLoginCredentials()
      await store.login(credentials)
      
      // Act
      store.logout()
      
      // Assert
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('Acción CheckAuth', () => {
    it('should restore user from localStorage', () => {
      // Arrange
      const mockUser = createMockUser()
      localStorage.setItem('user', JSON.stringify(mockUser))
      const store = useAuthStore()
      
      // Act
      store.checkAuth()
      
      // Assert
      expect(store.user).toEqual(mockUser)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle invalid localStorage data', () => {
      // Arrange
      localStorage.setItem('user', 'invalid-json')
      const store = useAuthStore()
      
      // Act
      store.checkAuth()
      
      // Assert
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('user')).toBeNull()
    })

    it('should handle empty localStorage', () => {
      // Arrange
      const store = useAuthStore()
      
      // Act
      store.checkAuth()
      
      // Assert
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Inicialización Automática', () => {
    it('should automatically check auth on store creation', () => {
      // Arrange
      const mockUser = createMockUser()
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      // Act
      const store = useAuthStore()
      
      // Assert
      expect(store.user).toEqual(mockUser)
      expect(store.isAuthenticated).toBe(true)
    })
  })
}) 