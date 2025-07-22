[⬅️ Volver al índice](./README.md)

## Preguntas para Crear Tests de Calidad

### ¿Vale la pena testear esto?

#### Preguntas de Valor de Negocio
- ¿Qué pasa si esto falla en producción? Si la respuesta es "nada grave", probablemente no necesita test
- ¿Cuántos usuarios se verían afectados? Funcionalidad crítica para muchos usuarios = alta prioridad
- ¿Cuánto dinero se perdería si falla? Checkout, pagos, facturación = testing obligatorio
- ¿Qué tan difícil es detectar el error manualmente? Errores sutiles o casos edge necesitan tests

#### Preguntas de Complejidad
- ¿Tiene lógica de negocio compleja? Cálculos, validaciones, transformaciones = sí testear
- ¿Es un getter/setter simple? `get name() { return this.name }` = no testear
- ¿Tiene múltiples condiciones o casos edge? Más de 2-3 `if/else` = probablemente sí
- ¿Es código que escribiste rápido y no estás 100% seguro? Mejor testearlo

#### ¿Solo Lógica o También UX?
- Solo lógica si: Es una función pura, cálculo, validación, transformación de datos
- También UX si: El usuario interactúa directamente, hay formularios, navegación, o estados visuales
- Ejemplo lógica: `calculateTax(price, rate)` → test unitario
- Ejemplo UX: Formulario de login → test de componente
- Ejemplo mixto: Carrito de compras → test lógica (cálculos) + UX (agregar/quitar items)

#### Preguntas de Costo/Beneficio
- ¿Cuánto tiempo tomaría escribir el test? Si es más de 30 min, evalúa si vale la pena
- ¿Cuánto tiempo tomaría arreglar bugs sin test? Si es mucho tiempo de debugging, mejor testear
- ¿Estás en modo "ship rápido"? Si necesitas lanzar urgente, prioriza tests de flujos críticos
- ¿Es código que cambia mucho? Si cambia semanalmente, los tests pueden ser contraproducentes

### ¿Está bien arquitecturado mi test?
- ¿Puedo entender qué hace el test en 5 segundos? Si no, necesita ser más claro
- ¿El test falla con un mensaje útil? El mensaje de error debe explicar qué salió mal, no solo que falló
- ¿Es fácil de mantener? Si cambias la implementación (sin cambiar el comportamiento), ¿el test sigue funcionando?
- ¿Usa factories para datos complejos? Evita crear objetos mock enormes inline

### ¿Está bien estructurado mi test?
- ¿Sigue el patrón AAA? Arrange, Act, Assert debe ser claro
- ¿Tiene un solo propósito? Un test debe probar una sola cosa
- ¿El nombre del test explica qué hace? Debe ser descriptivo: `should calculate total price with tax when item is taxable`
- ¿Es independiente de otros tests? Debe poder ejecutarse solo sin depender de orden o estado

### ¿Está optimizado para debugging?
- ¿Si falla, sabré inmediatamente por qué? Los mensajes de error deben ser claros y específicos
- ¿Usa `expect().toBe()` en lugar de `expect().toBeTruthy()`? Aserciones específicas dan mejor feedback
- ¿Evita lógica compleja en el test? Los tests deben ser simples y lineales 