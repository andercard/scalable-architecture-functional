<template>
  <div class="anime-grid" data-testid="anime-grid">
    <div v-if="loading" class="anime-grid__loading" data-testid="anime-grid-loading">
      <div class="loading-spinner"></div>
      <p>Cargando animes...</p>
    </div>
    <div v-else-if="error" class="anime-grid__error" data-testid="anime-grid-error">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn" data-testid="retry-button">Intentar de nuevo</button>
    </div>
    <div v-else-if="Array.isArray(animes) && animes.length === 0" class="anime-grid__empty" data-testid="anime-grid-empty">
      <div class="empty-icon">📺</div>
      <p>No se encontraron animes</p>
    </div>
    <div v-else class="anime-grid__content" data-testid="anime-grid-content">
      <AnimeCard
        v-for="anime in animes"
        :key="anime.mal_id"
        :anime="anime"
        class="anime-grid__item"
        data-testid="anime-card"
      />
      <div v-if="showPagination && Array.isArray(animes) && animes.length > 0" class="anime-grid__pagination" data-testid="anime-grid-pagination">
        <el-pagination
          class="anime-pagination"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalItems"
          layout="prev, pager, next, jumper"
          :hide-on-single-page="true"
          @current-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimeGrid } from './useAnimeGrid'
import type { AnimeGridProps, AnimeGridEmits } from './animeGrid.types'
import AnimeCard from '../AnimeCard/index.vue'

const props = withDefaults(defineProps<AnimeGridProps & { pageSize?: number }>(), {
  loading: false,
  error: null,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  showPagination: true,
  totalItems: 0,
  pageSize: 20
})

const emit = defineEmits<AnimeGridEmits>()

const {
  retry,
  handlePageChange
} = useAnimeGrid(props, emit)
</script>

<style scoped>
@import './AnimeGrid.styles.scss';
</style> 