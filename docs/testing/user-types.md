[⬅️ Volver al índice](./README.md)

## Enfoque: Dos Tipos de Usuarios

El testing efectivo requiere entender que no todos los usuarios de tu aplicación son iguales. Esta sección explica cómo adaptar nuestras estrategias de testing a las necesidades específicas de cada tipo de usuario.

### ¿Por qué separar por tipos de usuarios?

En el desarrollo de software, tenemos dos audiencias principales con necesidades muy diferentes:

1. **El usuario final** - Quien interactúa con la interfaz de usuario
2. **El desarrollador** - Quien escribe y mantiene el código

Cada uno tiene expectativas distintas sobre qué debe funcionar y cómo debe comportarse la aplicación. Nuestro enfoque de testing reconoce esta diferencia y adapta las estrategias de prueba en consecuencia.

### Desarrollador: Testing Unitario

¿Quién es?  
El desarrollador es quien escribe, mantiene y evoluciona el código. Necesita confianza en que los cambios que hace no rompen funcionalidad existente.

¿Qué necesita?  
El desarrollador necesita tests rápidos y específicos que le ayuden a:
- Verificar que la lógica funciona correctamente
- Detectar regresiones cuando hace cambios
- Entender cómo se comporta el código en diferentes escenarios
- Refactorizar con confianza

¿Qué probamos?  
Verificamos funciones puras, composables y lógica de negocio:

- Composables con lógica compleja
- Funciones de utilidad y transformación de datos
- Stores y manejo de estado
- Validaciones y cálculos
- Manejo de errores y casos edge

Características técnicas:
- **DOM mínimo**: Usan jsdom para reactividad de Vue y APIs del navegador, pero no renderizan templates completos
- **Aisladas**: Sin dependencias externas o efectos secundarios
- **Rápidas**: < 1ms por test (funciones puras) o < 10ms (composables)
- **Determinísticas**: Mismo input siempre produce el mismo output

Ejemplo práctico:
```typescript
// Test unitario - Prueba lógica pura de composable
it('should compute anime subtitle correctly', () => {
  const props = { anime: createMockAnime({ type: 'TV', status: 'Airing' }) }
  const emit = vi.fn()
  
  const { result, app } = withSetup(() => useAnimeCard(props, emit))
  
  expect(result.animeSubtitle.value).toBe('TV • Airing')
  app.unmount()
})
```

### Usuario Final: Testing de Componentes

**¿Quién es?**  
El usuario final es quien interactúa directamente con la interfaz de usuario de tu aplicación. Puede ser un cliente, un administrador, o cualquier persona que use la aplicación para realizar tareas específicas.

**¿Qué necesita?**  
El usuario final necesita que la aplicación funcione como espera. No le importa cómo está implementado el código, solo quiere poder completar sus tareas de manera eficiente y sin errores.

**¿Qué probamos?**  
Simulamos las interacciones reales que un usuario tendría con la aplicación:

- Clicks en botones, enlaces y elementos interactivos
- Llenado y envío de formularios
- Navegación entre páginas
- Verificación de que la información se muestra correctamente
- Validación de accesibilidad y usabilidad

Características técnicas:
- **Con DOM**: Renderizan componentes reales en un entorno de testing
- **Centradas en el usuario**: Simulan interacciones reales del usuario
- **Más lentas**: 10-50ms por test debido al renderizado
- **Validación de UX**: Verifican comportamiento observable en la interfaz

**Guía conceptual:**
- **Mal**: Verificar detalles internos como `store.favorites.length` o `isFavorite.value`
- **Bien**: Verificar lo que el usuario realmente ve y puede hacer:
  - Botón con texto "Agregar a favoritos" visible
  - Al hacer click, el ícono cambia a corazón lleno
  - Se muestra mensaje de confirmación
  - El contador de favoritos aumenta

### Beneficios de esta separación

- **Claridad de responsabilidades**
Cada tipo de test tiene un propósito específico y bien definido. Los tests de componentes validan la experiencia del usuario, mientras que los tests unitarios validan la lógica de negocio.
- **Mantenibilidad mejorada**
Los desarrolladores pueden refactorizar lógica interna sin romper tests de UI. Los tests unitarios siguen siendo válidos mientras la interfaz pública se mantenga consistente.
- **Confianza en la calidad**
Los usuarios finales tienen garantía de que la interfaz funciona como esperan, mientras que los desarrolladores tienen confianza en que la lógica es robusta y correcta.
- **Eficiencia en el desarrollo**
Los tests unitarios son rápidos y permiten desarrollo iterativo, mientras que los tests de componentes validan la integración completa cuando es necesario.
- **Validación completa del sistema**
Cubrimos tanto la lógica interna como la experiencia de usuario, nos ayuda a tener mas estable la aplicación.
- **Detección temprana de problemas**
Los tests de componentes detectan problemas de integración entre lógica y template que los tests unitarios no pueden identificar.

### ¿Por qué no solo pruebas unitarias?

Aunque algunos enfoques sugieren usar únicamente pruebas unitarias para maximizar la velocidad, nuestro enfoque híbrido es superior por las siguientes razones, basándonos en los principios de [Kent C. Dodds](https://kentcdodds.com/blog/testing-implementation-details):

Los tests de componentes validan UX real
Los tests unitarios pueden pasar mientras la interfaz de usuario está rota. Los tests de componentes garantizan que el usuario puede realmente usar la aplicación.

Detectan problemas de integración
Los tests de componentes prueban la funcionalidad de un componente específico y sus hijos directos (si no son complejos). Si los hijos son complejos, se mockean para enfocarse en la lógica del componente padre, pero se integra la mayor parte de la funcionalidad real.

Validan accesibilidad naturalmente
Al usar selectores como `getByLabelText()`, los tests de componentes promueven y validan la accesibilidad de la aplicación.

Evitan falsos positivos y falsos negativos
Los tests unitarios pueden generar dos tipos de errores problemáticos:

- **Falsos positivos**: El test pasa pero la funcionalidad está rota para el usuario. Por ejemplo, un test unitario puede verificar que `toggleFavorite()` se llama correctamente, pero si el botón no está visible o no responde al click, el usuario no puede usar la funcionalidad.

- **Falsos negativos**: El test falla pero la funcionalidad funciona correctamente. Esto sucede cuando testeas detalles de implementación que cambian durante el desarrollo, como nombres de variables internas o estructura de datos específica. 

### Ejemplo de uso

Puedes ver ejemplos de tests orientados a usuario final y desarrollador en:

- [`src/modules/anime/test/components/AnimeCard/useAnimeCard.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/components/AnimeCard/useAnimeCard.spec.ts)
- [`src/modules/anime/test/pages/AnimeList/useAnimeList.spec.ts`](https://github.com/andercard/scalable-architecture-functional/blob/main/src/modules/anime/test/pages/AnimeList/useAnimeList.spec.ts) 