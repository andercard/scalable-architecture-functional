<template>
  <div class="anime-favorites">
    <h1>Mis Favoritos</h1>
    <div v-if="isLoading" class="loading">
      <p>Cargando favoritos...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="favorites.length === 0" class="empty">
      <p>No tienes animes favoritos aún.</p>
      <router-link to="/" class="browse-link">
        Explorar animes
      </router-link>
    </div>
    <div v-else class="favorites-grid">
      <div 
        v-for="anime in favorites" 
        :key="anime.mal_id" 
        class="favorite-item"
      >
        <AnimeCard
          :anime="anime"
          @click="goToDetail(anime.mal_id)"
        />
        <el-button
          type="danger"
          size="small"
          @click="removeFromFavorites(anime.mal_id)"
          class="remove-btn"
        >
          <el-icon><Delete /></el-icon>
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
</script>

<style scoped>
@import './AnimeFavorites.styles.scss';
</style> 