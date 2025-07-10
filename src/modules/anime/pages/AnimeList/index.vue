<template>
  <div class="anime-list-page" data-testid="anime-list-page">
    <header class="anime-list-page__header" data-testid="anime-list-header">
      <h1 class="anime-list-page__title" data-testid="anime-list-title">AnimeExplorer</h1>
      <p class="anime-list-page__subtitle" data-testid="anime-list-subtitle">
        Explora el universo del anime con los mejores títulos de la temporada
      </p>
    </header>

    <div class="anime-list-page__filters" data-testid="anime-list-filters">
      <div class="search-container" data-testid="search-container">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar animes..."
          class="search-input"
          data-testid="search-input"
        />
        <button @click="clearSearch" class="clear-search-btn" data-testid="clear-search-btn">
          ✕
        </button>
      </div>

      <div class="filter-buttons" data-testid="filter-buttons">
        <button 
          @click="loadTopAnime"
          :class="{ 'filter-btn--active': activeFilter === 'top' }"
          class="filter-btn"
          data-testid="filter-btn-popular"
        >
          🏆 Populares
        </button>
        <button 
          @click="loadSeasonalAnime"
          :class="{ 'filter-btn--active': activeFilter === 'seasonal' }"
          class="filter-btn"
          data-testid="filter-btn-seasonal"
        >
          📺 Temporada Actual
        </button>
        <button 
          @click="loadAllAnime"
          :class="{ 'filter-btn--active': activeFilter === 'all' }"
          class="filter-btn"
          data-testid="filter-btn-all"
        >
          📚 Todos
        </button>
      </div>
    </div>

    <AnimeGrid
      :animes="animes"
      :loading="isLoading"
      :error="error"
      :current-page="currentPage"
      :total-items="totalItems"
      @retry="retry"
      @page-change="handlePageChange"
      data-testid="anime-grid"
    />

    <div v-if="!isLoading && animes.length > 0" class="anime-list-page__info" data-testid="anime-list-info">
      <p>
        Mostrando {{ animes.length }} animes de {{ totalItems }} totales
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimeList } from './useAnimeList'
import AnimeGrid from '../../components/AnimeGrid/index.vue'

const {
  searchQuery,
  activeFilter,
  animes,
  isLoading,
  error,
  currentPage,
  totalItems,
  handleSearch,
  clearSearch,
  loadTopAnime,
  loadSeasonalAnime,
  loadAllAnime,
  retry,
  handlePageChange
} = useAnimeList()
</script>

<style scoped>
@import './AnimeList.styles.scss';
</style> 