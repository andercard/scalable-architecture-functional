// Common Module - Componentes, utilidades y tipos genéricos compartidos

// Componentes
export { default as BaseCard } from './components/BaseCard.vue'

// Composables
export { useBaseCard } from './composables/useBaseCard'

// Utilidades
export { formatDate, truncateText } from './utils/format'
export { logger } from './utils/logger'

// Errores
export { getReasonMessage } from './getReasonMessage'

// Tipos
export * from './types/shared.types'

// Estilos
import './styles/BaseCard.styles.scss' 