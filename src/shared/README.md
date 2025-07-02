# Shared Module

Contenedor de elementos compartidos en toda la aplicación, organizados por responsabilidad.

## Estructura

```
shared/
├── common/              # Componentes y utilidades genéricas
│   ├── components/
│   │   └── BaseCard.vue
│   ├── composables/
│   │   └── useBaseCard.ts
│   ├── types.ts
│   ├── errors.ts
│   ├── utils/
│   │   ├── format.ts
│   │   └── logger.ts
│   ├── styles/
│   │   └── BaseCard.styles.scss
│   └── index.ts
├── layout/              # Componentes de estructura de la aplicación
│   ├── components/
│   │   └── AppHeader.vue
│   ├── composables/
│   │   └── useAppHeader.ts
│   ├── types/
│   │   ├── AppHeader.types.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── AppHeader.styles.scss
│   │   └── index.scss
│   ├── index.ts
│   └── README.md
└── index.ts
```

## Uso

### Importar desde common
```typescript
import { BaseCard, useBaseCard, formatDate } from '@shared/common'
```

### Importar desde layout
```typescript
import { AppHeader, useAppHeader } from '@shared/layout'
```

### Importar todo
```typescript
import { BaseCard, AppHeader, formatDate } from '@shared'
```

## Submódulos

### Common
Componentes y utilidades genéricas reutilizables:
- **BaseCard**: Card base reutilizable
- **formatDate**: Utilidades de formateo
- **logger**: Sistema de logging
- **Tipos comunes**: BaseEntity, PaginatedResponse, etc.

### Layout
Componentes de estructura de la aplicación:
- **AppHeader**: Header principal con navegación
- **useAppHeader**: Lógica del header

## Principios de Organización

1. **Separación por responsabilidad**: Common vs Layout
2. **Reutilización**: Common para elementos genéricos
3. **Estructura**: Layout para componentes estructurales
4. **Escalabilidad**: Fácil agregar nuevos submódulos

## Componentes

### AppHeader
Header principal de la aplicación con navegación y funcionalidades de usuario.

### BaseCard
Card base reutilizable para mostrar contenido en diferentes partes de la aplicación.

## Composable

### useAppHeader
Composable que maneja la lógica del header, incluyendo navegación y estado del usuario.

### useBaseCard
Composable que maneja la lógica de las cards base.

## Tipos

### AppHeaderProps
Propiedades del componente AppHeader.

### BaseEntity
Interfaz base para entidades con id.

### PaginatedResponse
Interfaz para respuestas paginadas de la API.

### LoadingState
Estado de carga para componentes.

## Estilos

Los estilos están organizados por módulo y se importan automáticamente al usar los componentes. 