[⬅️ Volver al índice](./README.md)

## Métricas de Cobertura

¿Qué es Coverage?
El coverage mide qué porcentaje del código está siendo ejecutado por los tests. Es una métrica que ayuda a identificar código no probado, pero no garantiza calidad.

Importante: En proyectos en migración, es normal tener coverage bajo inicialmente. Los siguientes porcentajes son metas a alcanzar gradualmente.

#### Objetivos

* Stores: 70-80% (Lógica de negocio crítica)
* Composables: 60-75% (Lógica de UI y transformaciones)
* Utils: 70-80% (Funciones puras y transformaciones)
* Components: 40-60% (Interacciones de usuario y lógica de template)
* Services: 20-40% (Solo casos edge y validaciones específicas)

#### Criterios de Exclusión

Lo que NO contar en coverage:
- Archivos de configuración: `vite.config.ts`, `vitest.config.ts`
- Archivos de tipos: `*.d.ts`, `types.ts` (solo definiciones)
- Setup de tests: `test/setup.ts`, `test/utils/*`
- Factories de testing: `test/factories/*`
- Mocks y stubs: Archivos que solo contienen mocks
- Componentes de presentación: Solo template sin lógica no reciben ni props (solo muestran datos)

#### Métricas de Calidad vs Cantidad

Importante: Es mejor tener 70% de coverage en código que realmente importa, que 90% incluyendo código trivial.

Priorizar testing de:
1. Lógica de negocio crítica (stores, utils complejas)
2. Composables con transformaciones (filtros, cálculos)
3. Componentes con interacciones complejas (formularios, validaciones)
4. Casos edge en servicios (validaciones, errores específicos)

No priorizar testing de:
1. Componentes de presentación (solo muestran datos)
2. Getters simples (solo retornan estado)
3. Métodos triviales (solo asignan valores)
4. Configuración y setup (no lógica de negocio)

### Comandos y Scripts de Testing
Los comandos de testing están organizados para facilitar diferentes escenarios de desarrollo.

Comandos básicos
```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests con coverage
yarn test --coverage

# Ejecutar tests en modo watch
yarn test --watch

# Ejecutar tests con UI (interfaz visual de Vitest)
yarn test --ui

# Ejecutar tests en modo verbose
yarn test --reporter=verbose
```

Comandos específicos por módulo
```bash
# Testear solo un módulo específico
yarn test src/modules/anime/test/

# Testear solo lógica de un componente
yarn test src/modules/anime/test/components/AnimeCard/useAnimeCard.spec.ts

# Testear solo template de un componente
yarn test src/modules/anime/test/components/AnimeCard/index.spec.ts

# Testear solo stores
yarn test src/modules/anime/test/stores/

# Testear solo servicios
yarn test src/modules/anime/test/services/
```

Scripts de package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:unit": "vitest --run src/**/*.spec.ts",
  }
}
``` 