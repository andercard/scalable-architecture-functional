<template>
  <BaseCard
    :title="anime.title ?? ''"
    :image-url="anime.images?.jpg?.large_image_url ?? 'https://example.com/placeholder.jpg'"
    :subtitle="animeSubtitle"
    :genres="Array.isArray(anime.genres) ? anime.genres : []"
    :loading="loading"
    :clickable="true"
    @click="handleClick"
  >
    <template #footer>
      <div class="anime-card__footer">
        <div class="anime-card__stats">
          <span class="anime-card__stat">
            <i class="icon-episodes"></i>
            {{ anime.episodes ?? '?' }} eps
          </span>
        </div>
        
        <el-button
          v-if="isAuthenticated"
          data-testid="toggle-favorite-button"
          role="button"
          :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          :type="isFavorite ? 'danger' : 'default'"
          :icon="isFavorite ? 'Star' : 'StarFilled'"
          circle
          size="small"
          @click.stop="toggleFavorite"
          :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        />
        <el-button
          v-else
          data-testid="login-required-button"
          role="button"
          aria-label="Inicia sesión para agregar a favoritos"
          type="info"
          icon="Lock"
          circle
          size="small"
          @click.stop="showLoginMessage"
          title="Inicia sesión para agregar a favoritos"
        />
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { useAnimeCard } from './useAnimeCard'
import BaseCard from '@/shared/common/components/BaseCard/index.vue'
import type { AnimeCardProps, AnimeCardEmits } from '../../types'

const props = withDefaults(defineProps<AnimeCardProps>(), {
  loading: false
})

const emit = defineEmits<AnimeCardEmits>()

const {
  animeSubtitle,
  isAuthenticated,
  isFavorite,
  handleClick,
  toggleFavorite,
  showLoginMessage
} = useAnimeCard(props, emit)
</script>

<style scoped>
@import './AnimeCard.styles.scss';
</style> 