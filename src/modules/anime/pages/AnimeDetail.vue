<template>
  <div class="anime-detail-page">
    <div v-if="isLoading" class="anime-detail-page__loading">
      <div class="loading-spinner"></div>
      <p>Cargando detalles del anime...</p>
    </div>

    <div v-else-if="error" class="anime-detail-page__error">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn">
        Intentar de nuevo
      </button>
    </div>

    <div v-else-if="anime" class="anime-detail-page__content">
      <!-- Header con imagen de fondo -->
      <div class="anime-detail-page__hero">
        <div class="hero-background" :style="heroStyle"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-image">
            <img 
              :src="anime.images?.jpg?.large_image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='" 
              :alt="anime.title"
              @error="handleImageError"
            />
          </div>
          <div class="hero-info">
            <h1 class="hero-title">{{ anime.title }}</h1>
            <div class="hero-meta">
              <span class="meta-item">{{ anime.type }}</span>
              <span class="meta-item">{{ anime.status }}</span>
              <span v-if="anime.episodes" class="meta-item">{{ anime.episodes }} episodios</span>
              <span v-if="anime.duration" class="meta-item">{{ anime.duration }}</span>
            </div>
            <div class="hero-rating">
              <span class="rating-stars">{{ ratingStars }}</span>
              <span class="rating-score">{{ anime.score }}/10</span>
              <span class="rating-votes">({{ formatNumber(anime.scored_by) }} votos)</span>
            </div>
            <div class="hero-actions">
              <button 
                @click="toggleFavorite"
                :class="{ 'favorite-btn--active': isFavorite }"
                class="favorite-btn"
              >
                <i class="icon-heart"></i>
                {{ isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
              </button>
              <router-link to="/" class="back-btn">
                ← Volver a la lista
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="anime-detail-page__main">
        <div class="main-content">
          <!-- Sinopsis -->
          <section class="content-section">
            <h2>Sinopsis</h2>
            <p class="synopsis">{{ anime.synopsis || 'Sin sinopsis disponible.' }}</p>
          </section>

          <!-- Información adicional -->
          <section class="content-section">
            <h2>Información</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Géneros:</span>
                <div class="info-value">
                  <span 
                    v-for="genre in anime.genres" 
                    :key="genre.mal_id"
                    class="genre-tag"
                    :style="{ backgroundColor: getGenreColor(genre.mal_id) }"
                  >
                    {{ genre.name }}
                  </span>
                </div>
              </div>
              
              <div v-if="anime.producers.length" class="info-item">
                <span class="info-label">Productores:</span>
                <span class="info-value">{{ anime.producers.map(p => p.name).join(', ') }}</span>
              </div>
              
              <div v-if="anime.studios.length" class="info-item">
                <span class="info-label">Estudios:</span>
                <span class="info-value">{{ anime.studios.map(s => s.name).join(', ') }}</span>
              </div>
              
              <div v-if="anime.source" class="info-item">
                <span class="info-label">Fuente:</span>
                <span class="info-value">{{ anime.source }}</span>
              </div>
              
              <div v-if="anime.rating" class="info-item">
                <span class="info-label">Clasificación:</span>
                <span class="info-value">{{ anime.rating }}</span>
              </div>
              
              <div v-if="anime.broadcast.string" class="info-item">
                <span class="info-label">Emisión:</span>
                <span class="info-value">{{ anime.broadcast.string }}</span>
              </div>
            </div>
          </section>

          <!-- Trailer -->
          <section v-if="anime?.trailer?.youtube_id" class="content-section">
            <h2>Trailer</h2>
            <div class="trailer-container">
              <iframe
                :src="`https://www.youtube.com/embed/${anime.trailer?.youtube_id}`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="trailer-iframe"
              ></iframe>
            </div>
          </section>

          <!-- Personajes -->
          <section class="content-section">
            <h2>Personajes Principales</h2>
            <div v-if="characters.length > 0" class="characters-grid">
              <div 
                v-for="character in characters" 
                :key="character.character.mal_id"
                class="character-card"
              >
                <div class="character-image">
                  <img 
                    :src="character.character.images?.jpg?.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'" 
                    :alt="character.character.name"
                    @error="handleImageError"
                  />
                </div>
                <div class="character-info">
                  <h3 class="character-name">{{ character.character.name }}</h3>
                  <p class="character-role">{{ character.role }}</p>
                  <p v-if="character.voice_actors.length" class="character-voice">
                    Voz: {{ character.voice_actors[0].person.name }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="characters-empty">
              <p>No hay información de personajes disponible.</p>
              <p v-if="charactersError">Error: {{ charactersError }}</p>
            </div>
          </section>

          <!-- Estadísticas -->
          <section class="content-section">
            <h2>Estadísticas</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-value">{{ formatNumber(anime.members) }}</span>
                <span class="stat-label">Miembros</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ formatNumber(anime.favorites) }}</span>
                <span class="stat-label">Favoritos</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">#{{ anime.rank }}</span>
                <span class="stat-label">Ranking</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">#{{ anime.popularity }}</span>
                <span class="stat-label">Popularidad</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimeDetail } from '../composables/useAnimeDetail'

const {
  anime,
  isLoading,
  error,
  isFavorite,
  ratingStars,
  heroStyle,
  characters,
  charactersError,
  toggleFavorite,
  retry,
  formatNumber,
  getGenreColor,
  handleImageError
} = useAnimeDetail()
</script>

<style scoped>
@import '../styles/AnimeDetail.styles.scss';
</style> 