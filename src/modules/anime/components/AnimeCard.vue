<template>
  <BaseCard
    :title="anime.title"
    :image-url="anime.images.jpg.large_image_url"
    :subtitle="animeSubtitle"
    :genres="anime.genres"
    :loading="loading"
    :clickable="true"
    @click="handleClick"
  >
    <template #footer>
      <div class="anime-card__footer">
        <div class="anime-card__stats">
          <span class="anime-card__stat">
            <i class="icon-episodes"></i>
            {{ anime.episodes || '?' }} eps
          </span>
        </div>
        
        <el-button
          v-if="isAuthenticated"
          data-test="button:toggle-favorite"
          :type="isFavorite ? 'danger' : 'default'"
          :icon="isFavorite ? 'Star' : 'StarFilled'"
          circle
          size="small"
          @click.stop="toggleFavorite"
          :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        />
        <el-button
          v-else
          data-test="button:login-required"
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
import { useAnimeCard } from '../composables/useAnimeCard'
import BaseCard from '@shared/components/BaseCard.vue'
import type { AnimeCardProps, AnimeCardEmits } from '../types/AnimeCard.types'

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
@import '../styles/AnimeCard.styles.scss';
</style> 