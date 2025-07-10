import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withSetup } from '../../../../../test/utils/withSetup'
import { useLogin } from '@/modules/auth/pages/Login/useLogin'
import { createValidLoginCredentials, createInvalidLoginCredentials } from '../factories'

// Mock de router
const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock })
}))

// Mock de ElMessage
vi.mock('element-plus', () => {
  return {
    ElMessage: {
      success: vi.fn(),
      error: vi.fn()
    }
  }
})
import { ElMessage } from 'element-plus'

// Mock de store
vi.mock('@/modules/auth/stores/auth.store', async () => {
  const actual = await vi.importActual('@/modules/auth/stores/auth.store')
  return {
    ...actual,
    useAuthStore: () => ({
      isLoading: false,
      login: vi.fn(async (credentials) => credentials.username === 'demo'),
      error: null
    })
  }
})

describe('useLogin composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe exponer los campos y métodos requeridos', () => {
    const { result } = withSetup(() => useLogin())
    expect(result.loginForm).toBeDefined()
    expect(result.loginFormRef).toBeDefined()
    expect(result.isLoading).toBeDefined()
    expect(result.rules).toBeDefined()
    expect(result.handleLogin).toBeTypeOf('function')
  })

  it('debe hacer login exitoso y redirigir', async () => {
    const { result } = withSetup(() => useLogin())
    // Simular validación exitosa
    result.loginForm.username = 'demo'
    result.loginFormRef.value = { validate: () => Promise.resolve(true) }
    await result.handleLogin()
    expect(vi.mocked(ElMessage).success).toHaveBeenCalledWith('¡Bienvenido!')
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('debe mostrar error si el login falla', async () => {
    const { result } = withSetup(() => useLogin())
    result.loginForm.username = 'otro'
    result.loginFormRef.value = { validate: () => Promise.resolve(true) }
    await result.handleLogin()
    expect(vi.mocked(ElMessage).error).toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('debe manejar error de validación', async () => {
    const { result } = withSetup(() => useLogin())
    result.loginForm.username = 'demo'
    result.loginFormRef.value = { validate: () => Promise.reject(new Error('error de validación')) }
    await result.handleLogin()
    expect(vi.mocked(ElMessage).success).not.toHaveBeenCalled()
    expect(vi.mocked(ElMessage).error).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })
}) 