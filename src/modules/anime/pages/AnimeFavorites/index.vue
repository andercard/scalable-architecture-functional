<template>
  <div class="anime-favorites">
    <h1>Mis Favoritos</h1>
    <div v-if="isLoading" data-testid="anime-favorites-loading">
      <p>Cargando favoritos...</p>
    </div>
    <div v-else-if="error" data-testid="anime-favorites-error">
      <p>{{ error }}</p>
      <button @click="reloadPage" data-testid="retry-button">Reintentar</button>
    </div>
    <div v-else-if="favorites.length === 0" data-testid="anime-favorites-empty">
      <p>No tienes animes favoritos aún.</p>
      <router-link to="/" data-testid="explore-link">Explorar animes</router-link>
    </div>
    <div v-else data-testid="anime-favorites-list" class="favorites-grid">
      <div v-for="anime in favorites" :key="anime.mal_id" class="favorite-item">
        <AnimeCard :anime="anime" data-testid="anime-card" />
        <el-button type="danger" size="small" class="remove-btn" @click="($event: any) => removeFromFavorites(anime.mal_id)">
          <el-icon><svg><!-- icon --></svg></el-icon>
          Eliminar
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimeFavorites } from './useAnimeFavorites'
import AnimeCard from '../../components/AnimeCard/index.vue'
import { Delete } from '@element-plus/icons-vue'

const {
  favorites,
  isLoading,
  error,
  goToDetail,
  removeFromFavorites
} = useAnimeFavorites()

function reloadPage() {
  window.location.reload()
}
</script>

<style scoped>
@import './AnimeFavorites.styles.scss';
</style> 