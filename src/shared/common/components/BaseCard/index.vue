<template>
  <div 
    class="base-card"
    :class="{ 'base-card--loading': loading, 'base-card--clickable': clickable }"
    data-testid="base-card"
    @click="handleClick"
  >
    <div class="base-card__image-container">
      <img 
        v-if="imageUrl" 
        :src="imageUrl" 
        :alt="title"
        class="base-card__image"
        @error="handleImageError"
      />
      <div v-else class="base-card__placeholder">
        <span>Sin imagen</span>
      </div>
      <div v-if="loading" class="base-card__loading">
        <div class="spinner"></div>
      </div>
    </div>
    
    <div class="base-card__content">
      <h3 class="base-card__title" :title="title">
        {{ truncatedTitle }}
      </h3>
      
      <div v-if="subtitle" class="base-card__subtitle">
        {{ subtitle }}
      </div>
      
      <div v-if="genres && genres.length" class="base-card__genres">
        <span 
          v-for="genre in displayGenres" 
          :key="genre.mal_id"
          class="base-card__genre"
          :style="{ backgroundColor: getGenreColor(genre.mal_id) }"
        >
          {{ genre.name }}
        </span>
      </div>
      
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBaseCard } from './useBaseCard'
import type { BaseCardProps, BaseCardEmits } from '../../types/shared.types'

const props = withDefaults(defineProps<BaseCardProps>(), {
  loading: false,
  clickable: false,
  maxTitleLength: 50,
  maxGenres: 3
})

const emit = defineEmits<BaseCardEmits>()

const {
  truncatedTitle,
  displayGenres,
  handleClick,
  handleImageError,
  getGenreColor
} = useBaseCard(props, emit)
</script>

<style scoped>
@import './baseCard.styles.scss';
</style> 