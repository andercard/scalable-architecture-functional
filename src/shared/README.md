# Shared

Este directorio contiene componentes, utilidades y composables reutilizables en toda la aplicación.

## Estructura

```
src/shared/
├── components/        # Componentes UI reutilizables
│   ├── AppHeader.vue  # Header principal de la aplicación
│   └── BaseCard.vue   # Componente base para tarjetas
├── composables/       # Composables Vue reutilizables
│   ├── useAppHeader.ts # Lógica del header
│   └── useBaseCard.ts  # Lógica de tarjetas base
├── errors/            # Manejo de errores global
│   ├── getReasonMessage.ts # Mapeo de errores por reason
│   └── index.ts       # Exports de errores
├── styles/            # Estilos compartidos
│   ├── AppHeader.styles.scss
│   └── BaseCard.styles.scss
├── types/             # Tipos TypeScript globales
│   ├── AppHeader.types.ts
│   ├── shared.types.ts
│   └── index.ts
├── utils/             # Utilidades globales
│   ├── format.ts      # Funciones de formateo
│   └── logger.ts      # Sistema de logging
└── README.md          # Esta documentación
```

## Propósito

El directorio `shared` contiene recursos que:

- **No pertenecen a un dominio específico**: Componentes y utilidades genéricas
- **Se reutilizan en múltiples módulos**: Header, tarjetas base, formateo
- **Proporcionan funcionalidad cross-cutting**: Logging, manejo de errores

## Uso

```typescript
// Importar componentes
import BaseCard from '@shared/components/BaseCard.vue'
import AppHeader from '@shared/components/AppHeader.vue'

// Importar utilidades
import { formatDate, truncateText } from '@shared/utils/format'
import { logger } from '@shared/utils/logger'

// Importar tipos
import type { BaseCardProps } from '@shared/types'
``` 