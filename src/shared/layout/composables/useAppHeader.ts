import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAuthStore } from '@modules/auth/stores/auth.store'

export const useAppHeader = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)

  const handleCommand = async (command: string) => {
    switch (command) {
      case 'favorites':
        router.push('/anime/favorites')
        break
      case 'logout':
        try {
          await ElMessageBox.confirm(
            '¿Estás seguro de que quieres cerrar sesión?',
            'Confirmar',
            {
              confirmButtonText: 'Sí',
              cancelButtonText: 'No',
              type: 'warning'
            }
          )
          authStore.logout()
          router.push('/')
        } catch {
          // Usuario canceló
        }
        break
    }
  }

  return {
    isAuthenticated,
    user,
    handleCommand
  }
} 