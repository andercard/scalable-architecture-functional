[⬅️ Volver al índice](./README.md)

## Testing de eventos de usuario (userEvent)

#### ¿Por qué recomendamos userEvent?

Este proyecto usa `userEvent` como enfoque principal para simular interacciones reales del usuario. Esta decisión está basada en los principios de testing centrado en el usuario y las mejores prácticas de Testing Library.

```typescript
import userEvent from '@testing-library/user-event'

it('should handle user interaction', async () => {
  const user = userEvent.setup()
  
  // Simula interacción real del usuario
  await user.click(screen.getByRole('button'))
  await user.type(screen.getByRole('textbox'), 'test')
  
  // Más realista, simula el flujo completo
})
```

#### Beneficios de userEvent  
- Simula el flujo completo de interacción del usuario
- Incluye eventos de focus, blur, hover y navegación por teclado
- Detecta problemas de UX que otros enfoques podrían pasar por alto
- Reduce falsos positivos y negativos en los tests
- Identifica eventos que faltan o están mal configurados
- Detecta problemas de focus y navegación

#### Sobre fireEvent

`fireEvent` es una alternativa más directa que simula eventos DOM específicos:

```typescript
import { fireEvent } from '@testing-library/vue'

it('should handle DOM events', async () => {
  // Simula eventos DOM directos
  fireEvent.click(screen.getByRole('button'))
  fireEvent.input(screen.getByRole('textbox'), { target: { value: 'test' } })
})
```

Beneficios de fireEvent:
- Más rápido, Menos overhead de procesamiento
- Más directo, Control preciso sobre eventos específicos

¿Por qué no lo usamos como enfoque principal?
- **Menos realista**: No simula el flujo completo de interacción
- **Limitado para accesibilidad**: No incluye navegación por teclado
- **Puede ocultar problemas**: No detecta eventos faltantes o mal configurados
- **Menos alineado con testing centrado en usuario**: Se enfoca en eventos DOM en lugar de comportamiento observable 

### Ejemplo de uso

Puedes ver ejemplos prácticos del uso de userEvent en:

- [`src/modules/anime/test/components/AnimeCard/index.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/components/AnimeCard/index.spec.ts)
- [`src/modules/anime/test/pages/AnimeList/index.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/pages/AnimeList/index.spec.ts) 