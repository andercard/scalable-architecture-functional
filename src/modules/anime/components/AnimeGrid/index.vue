<template>
  <div class="anime-grid">
    <div v-if="loading" class="anime-grid__loading">
      <div class="loading-spinner"></div>
      <p>Cargando animes...</p>
    </div>
    
    <div v-else-if="error" class="anime-grid__error">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn">
        Intentar de nuevo
      </button>
    </div>
    
    <div v-else-if="Array.isArray(animes) && animes.length === 0" class="anime-grid__empty">
      <div class="empty-icon">📺</div>
      <p>No se encontraron animes</p>
    </div>
    
    <div v-else class="anime-grid__content">
      <AnimeCard
        v-for="anime in animes"
        :key="anime.mal_id"
        :anime="anime"
        class="anime-grid__item"
      />
    </div>
    
    <div v-if="showPagination && Array.isArray(animes) && animes.length > 0" class="anime-grid__pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="20"
        :total="totalItems"
        :hide-on-single-page="true"
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
        class="anime-pagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimeGrid } from './useAnimeGrid'
import type { AnimeGridProps, AnimeGridEmits } from './animeGrid.types'
import AnimeCard from '../AnimeCard/index.vue'

const props = withDefaults(defineProps<AnimeGridProps>(), {
  loading: false,
  error: null,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  showPagination: true,
  totalItems: 0
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