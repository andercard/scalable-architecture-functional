import { computed } from 'vue'
import { truncateText, getGenreColor } from '@/shared/common/utils/format'
import type { BaseCardProps } from '../types/shared.types'

export const useBaseCard = (props: BaseCardProps, emit: (event: 'click', ...args: any[]) => void) => {
  const truncatedTitle = computed(() => 
    truncateText(props.title ?? '', props.maxTitleLength || 50)
  )

  const displayGenres = computed(() => 
    Array.isArray(props.genres) ? props.genres.slice(0, props.maxGenres) : []
  )

  const handleClick = (event: MouseEvent) => {
    if (props.clickable) {
      emit('click', event)
    }
  }

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
    img.nextElementSibling?.classList.remove('base-card__placeholder--hidden')
  }

  return {
    truncatedTitle,
    displayGenres,
    handleClick,
    handleImageError,
    getGenreColor
  }
} 