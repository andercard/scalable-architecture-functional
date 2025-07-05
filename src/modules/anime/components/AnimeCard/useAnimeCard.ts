import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAnimeStore } from '../../stores/anime.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { AnimeCardProps, AnimeCardEmits } from './animeCard.types'

export const useAnimeCard = (props: AnimeCardProps, emit: AnimeCardEmits) => {
  const router = useRouter()
  const animeStore = useAnimeStore()
  const authStore = useAuthStore()

  const animeSubtitle = computed(() => {
    const parts = []
    if (props.anime.type) parts.push(props.anime.type)
    if (props.anime.status) parts.push(props.anime.status)
    if (props.anime.year) parts.push(props.anime.year.toString())
    return parts.join(' • ')
  })

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  
  const isFavorite = computed(() => 
    animeStore.isFavorite(props.anime.mal_id)
  )

  const handleClick = (event: MouseEvent) => {
    emit('click', event)
    router.push(`/anime/${props.anime.mal_id}`)
  }

  const toggleFavorite = () => {
    if (!isAuthenticated.value) {
      showLoginMessage()
      return
    }
    animeStore.toggleFavorite(props.anime)
  }

  const showLoginMessage = () => {
    ElMessage({
      message: 'Debes iniciar sesión para agregar animes a favoritos',
      type: 'warning',
      duration: 2000
    })
    router.push('/login')
  }

  return {
    animeSubtitle,
    isAuthenticated,
    isFavorite,
    handleClick,
    toggleFavorite,
    showLoginMessage
  }
} 