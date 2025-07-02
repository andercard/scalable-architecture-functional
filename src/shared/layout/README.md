# Layout Module

Módulo que contiene todos los componentes y lógica relacionada con el layout de la aplicación.

## Estructura

```
layout/
├── components/
│   └── AppHeader.vue  # Header principal de la aplicación
├── composables/
│   └── useAppHeader.ts # Lógica del header
├── types/
│   ├── AppHeader.types.ts
│   └── index.ts
├── styles/
│   ├── AppHeader.styles.scss
│   └── index.scss
├── index.ts
└── README.md
```

## Componentes

### AppHeader
Header principal de la aplicación que incluye:
- Logo y navegación principal
- Búsqueda de anime
- Menú de usuario
- Navegación a favoritos

## Composables

### useAppHeader
Maneja la lógica del header:
- Estado de autenticación del usuario
- Navegación
- Búsqueda
- Logout

## Uso

### Importación directa
```typescript
import AppHeader from '@shared/layout/components/AppHeader.vue'
import { useAppHeader } from '@shared/layout/composables/useAppHeader'
```

### Importación desde el módulo
```typescript
import { AppHeader, useAppHeader } from '@shared/layout'
```

## Tipos

### AppHeaderProps
```typescript
interface AppHeaderProps {
  // Propiedades del header
}
```

### AppHeaderEmits
```typescript
interface AppHeaderEmits {
  // Eventos emitidos por el header
}
```

## Estilos

Los estilos se importan automáticamente al usar el módulo. Cada componente tiene sus propios estilos en archivos `.scss` separados. 