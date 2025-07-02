# Módulo Anime

Este módulo implementa toda la funcionalidad relacionada con la exploración y gestión de animes, incluyendo listado, búsqueda, detalles, favoritos y autenticación.

## Estructura

```
src/modules/anime/
├── components/         # Componentes específicos del módulo
│   ├── AnimeCard.vue   # Tarjeta individual de anime
│   └── AnimeGrid.vue   # Grid de animes con paginación
├── composables/        # Lógica de negocio reutilizable
│   ├── useAnimeCard.ts      # Lógica de tarjetas de anime
│   ├── useAnimeDetail.ts    # Lógica de detalles de anime
│   ├── useAnimeFavorites.ts # Lógica de favoritos
│   ├── useAnimeGrid.ts      # Lógica de grid y paginación
│   └── useAnimeList.ts      # Lógica de listado principal
├── errors/             # Errores específicos del módulo
│   ├── anime.errors.ts # Definición de errores de anime
│   └── index.ts        # Exports de errores
├── pages/              # Páginas del módulo
│   ├── AnimeDetail.vue    # Página de detalle de anime
│   ├── AnimeFavorites.vue # Página de favoritos
│   └── AnimeList.vue      # Página principal de listado
├── routes/             # Configuración de rutas
│   ├── index.ts        # Exports de rutas
│   ├── private.ts      # Rutas protegidas
│   └── public.ts       # Rutas públicas
├── services/           # Servicios de API
│   └── anime.services.ts # Servicios de anime con Either
├── stores/             # Stores de Pinia
│   └── animeStore.ts   # Store principal de anime
├── styles/             # Estilos del módulo
│   ├── AnimeCard.styles.scss
│   ├── AnimeDetail.styles.scss
│   ├── AnimeFavorites.styles.scss
│   ├── AnimeGrid.styles.scss
│   └── AnimeList.styles.scss
├── types/              # Tipos TypeScript específicos
│   ├── AnimeCard.types.ts
│   ├── AnimeCharacter.types.ts
│   ├── AnimeDetail.types.ts
│   ├── AnimeFavorites.types.ts
│   ├── AnimeGrid.types.ts
│   ├── AnimeList.types.ts
│   └── index.ts
└── README.md           # Esta documentación
```

## Características

### 🎯 Funcionalidades Principales
- **Listado de Animes**: Grid responsivo con paginación
- **Búsqueda en Tiempo Real**: Con debounce y filtros
- **Detalles Completos**: Información, personajes, trailers
- **Sistema de Favoritos**: Persistencia local con localStorage
- **Autenticación**: Protección de rutas y funcionalidades

### 🏗️ Arquitectura
- **Patrón Either**: Manejo funcional de errores
- **Composables**: Lógica reutilizable y testeable
- **Stores Pinia**: Gestión de estado global
- **TypeScript**: Tipado completo y seguro

### 🎨 UI/UX
- **Element Plus**: Componentes UI modernos
- **SCSS**: Estilos modulares y variables CSS
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Accesibilidad**: Atributos de prueba y navegación por teclado

## Uso

### Importar Componentes
```vue
<template>
  <AnimeGrid :animes="animes" @page-change="handlePageChange" />
  <AnimeCard :anime="anime" @click="goToDetail" />
</template>

<script setup>
import AnimeGrid from '@modules/anime/components/AnimeGrid.vue'
import AnimeCard from '@modules/anime/components/AnimeCard.vue'
</script>
```

### Usar Composables
```typescript
import { useAnimeList } from '@modules/anime/composables/useAnimeList'
import { useAnimeFavorites } from '@modules/anime/composables/useAnimeFavorites'

const { animes, isLoading, searchAnimes } = useAnimeList()
const { favorites, addToFavorites } = useAnimeFavorites()
```

### Usar Store
```typescript
import { useAnimeStore } from '@modules/anime/stores/animeStore'

const animeStore = useAnimeStore()
await animeStore.loadAnimeList()
```

## API Integration

### Endpoints Utilizados
- `GET /anime` - Lista paginada de animes
- `GET /anime/{id}` - Detalle completo de anime
- `GET /anime/{id}/characters` - Personajes del anime
- `GET /top/anime` - Animes más populares
- `GET /seasons/now` - Temporada actual

### Manejo de Errores
```typescript
import { getReasonMessage } from '@shared/errors'
import { ErrorAnime } from '@modules/anime/errors'

const result = await animeService.getAnime(id)
result.fold(
  (failure) => {
    const message = getReasonMessage(failure, ErrorAnime)
    showError(message)
  },
  (success) => {
    displayAnime(success.data)
  }
)
```

## Testing

El módulo incluye:
- **Tests Unitarios**: Para el patrón Either (15 tests)
- **Componentes Testeables**: Con atributos data-test
- **Composables Aislados**: Fáciles de testear
- **Stores Mockeables**: Para testing de estado

## Dependencias

### Internas
- `@core/either` - Patrón Either para errores
- `@core/api` - Configuración de API
- `@shared/components` - Componentes base
- `@shared/utils` - Utilidades globales

### Externas
- **Vue 3** - Framework base
- **Pinia** - Gestión de estado
- **Element Plus** - Componentes UI
- **Axios** - Cliente HTTP
- **SCSS** - Preprocesador CSS 