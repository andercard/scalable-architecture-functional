# 🎌 Anime Explorer

Una aplicación web moderna para explorar animes de Attack on Titan y Jujutsu Kaisen, construida con Vue 3, TypeScript y siguiendo los lineamientos de arquitectura modular para frontend B2B.

## ✨ Características

- **Arquitectura Modular**: Implementación completa de los lineamientos de arquitectura modular
- **API de Anime**: Integración con Jikan API (MyAnimeList) para datos reales
- **Gestión de Estado**: Pinia para manejo de estado global
- **TypeScript**: Tipado completo para mejor desarrollo
- **Diseño Responsivo**: Interfaz moderna y adaptable
- **Búsqueda en Tiempo Real**: Búsqueda con debounce
- **Sistema de Favoritos**: Guardado local de animes favoritos
- **Paginación**: Navegación eficiente entre páginas

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue una arquitectura modular inspirada en los lineamientos de frontend B2B, separando claramente la infraestructura, los módulos de negocio y los recursos compartidos.

### Estructura principal

```
src/
├── core/      # Infraestructura técnica y servicios base
├── modules/   # Módulos de negocio o features
├── shared/    # Recursos y utilidades compartidas
```

---

## ¿Qué va en cada carpeta?

### 1. `core/`
Infraestructura fundamental de la aplicación. Aquí se ubican:
- **API**: Configuración de instancias, interceptores, servicios base.
- **Router**: Definición de rutas, guards globales.
- **Either**: Utilidades de manejo de errores y resultados.
- **Otros servicios base**: Cualquier recurso técnico que no dependa de un dominio de negocio.

> **Ejemplo:**
> - `core/api/`
> - `core/router/`
> - `core/either/`

### 2. `modules/`
Cada módulo representa una feature o dominio de negocio. Aquí se ubican:
- **Páginas**: Vistas principales de la feature.
- **Componentes**: Componentes específicos del dominio.
- **Composables**: Lógica reutilizable dentro del módulo.
- **Stores**: Estado y lógica de negocio del módulo.
- **Servicios**: Llamadas a API específicas del dominio.
- **Tipos**: Tipos y contratos del dominio.
- **Estilos**: Estilos propios del módulo.

> **Ejemplo:**
> - `modules/anime/`
> - `modules/auth/`

### 3. `shared/`
Contenedor de recursos reutilizables en toda la aplicación, organizados por responsabilidad:
- **common/**: Componentes, utilidades y tipos genéricos (ej: BaseCard, formateadores, logger, errores comunes).
- **layout/**: Componentes y lógica de estructura global de la app (ej: AppHeader, navegación principal).

> **Ejemplo:**
> - `shared/common/components/BaseCard.vue`
> - `shared/layout/components/AppHeader.vue`

---

## Principios
- **Separación de responsabilidades**: Cada carpeta tiene un propósito claro.
- **Escalabilidad**: Permite agregar nuevos módulos y recursos compartidos fácilmente.
- **Reutilización**: Los recursos en `shared/` pueden ser usados por cualquier módulo.
- **Mantenibilidad**: Cambios en infraestructura, negocio o recursos compartidos no se mezclan.

---

## Ejemplo de importaciones

```ts
// Importar un componente de layout global
import { AppHeader } from '@shared/layout'

// Importar un componente común
import { BaseCard } from '@shared/common'

// Importar un store de un módulo
import { useAnimeStore } from '@modules/anime/stores/anime.store'
```

---

¿Dudas sobre la arquitectura? Consulta el archivo `src/shared/README.md` para más detalles sobre los recursos compartidos.

## 🚀 Tecnologías Utilizadas

- **Vue 3** - Framework progresivo
- **TypeScript** - Tipado estático
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento
- **Element Plus** - Componentes UI
- **Axios** - Cliente HTTP
- **Vite** - Build tool
- **Vitest** - Testing framework
- **SCSS** - Preprocesador CSS
- **Jikan API** - API de MyAnimeList

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd anime-explorer
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   # o
   yarn build
   ```

## 🎯 Lineamientos de Arquitectura Modular Implementados

### ✅ Estructura de Módulos
- Cada módulo tiene su propia estructura completa
- Separación clara de responsabilidades
- Componentes específicos por módulo

### ✅ Recursos Compartidos
- Directorio `shared/` con componentes reutilizables
- Utilidades y constantes globales
- Tipos TypeScript organizados

### ✅ Gestión de Estado
- Stores de Pinia por módulo
- Estado local y global bien definido
- Composables para lógica reutilizable

### ✅ Servicios y APIs
- Servicios organizados por módulo
- Interceptores de Axios configurados
- Patrón Either para manejo funcional de errores
- Manejo de errores centralizado con mapeo por reason

### ✅ Testing
- Vitest configurado para testing unitario
- Tests completos para el patrón Either
- Cobertura de funcionalidad crítica

### ✅ Enrutamiento Modular
- Rutas definidas por módulo
- Lazy loading de componentes
- Navegación optimizada

### ✅ Tipos TypeScript
- Tipos específicos por módulo
- Interfaces bien definidas
- Reutilización de tipos comunes

## 🎨 Componentes Principales

### BaseCard
Componente reutilizable para mostrar tarjetas de anime con:
- Imagen con fallback
- Información básica
- Sistema de rating
- Géneros con colores
- Estados de carga

### AnimeGrid
Grid responsivo para mostrar múltiples animes con:
- Paginación
- Estados de carga y error
- Búsqueda y filtros

### AnimeDetail
Página de detalle completa con:
- Hero section con imagen de fondo
- Información detallada
- Estadísticas
- Sistema de favoritos

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_BASE_URL=https://api.jikan.moe/v4
```

### Aliases de TypeScript
```json
{
  "@modules": "./src/modules",
  "@shared": "./src/shared",
  "@core": "./src/core"
}
```

## 📱 Funcionalidades

### Búsqueda y Filtros
- Búsqueda en tiempo real con debounce
- Filtros por popularidad, temporada actual, etc.
- Paginación eficiente

### Gestión de Favoritos
- Agregar/quitar animes de favoritos
- Persistencia local con localStorage
- Interfaz intuitiva con Element Plus

### Información Detallada
- Sinopsis completa
- Estadísticas de popularidad
- Información de producción
- Géneros y clasificaciones
- Personajes y actores de voz
- Trailers (si están disponibles)

### Autenticación
- Sistema de login/registro
- Protección de rutas
- Gestión de estado de usuario

## 🎯 API Endpoints Utilizados

- `GET /anime` - Lista de animes
- `GET /anime/{id}` - Detalle de anime
- `GET /anime/{id}/characters` - Personajes del anime
- `GET /top/anime` - Animes populares
- `GET /seasons/now` - Temporada actual
- `GET /anime/{id}/recommendations` - Recomendaciones

## 🧪 Testing

### Ejecutar Tests
```bash
npm run test
```

### Tests Disponibles
- **Patrón Either**: 15 tests unitarios completos
- **Cobertura**: map, flatMap, fold, right, left
- **Casos**: transformación, encadenamiento, manejo de errores

## 🚀 Despliegue

### Netlify
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

### Vercel
```bash
npm run build
# Conectar repositorio a Vercel
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Jikan API](https://jikan.moe) por proporcionar acceso a los datos de MyAnimeList
- [Vue.js](https://vuejs.org) por el excelente framework
- [Pinia](https://pinia.vuejs.org) por la gestión de estado
- [Vite](https://vitejs.dev) por las herramientas de desarrollo

---

Desarrollado con ❤️ siguiendo los mejores lineamientos de arquitectura modular para frontend B2B.
