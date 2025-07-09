# Prueba de Concepto de Arquitectura Escalable

Una aplicación de demostración que implementa los lineamientos de arquitectura modular para frontend B2B, construida con Vue 3, TypeScript y siguiendo las mejores prácticas de escalabilidad y mantenibilidad.

## Objetivo

Este proyecto sirve como **prueba de concepto** para validar y demostrar una arquitectura escalable que resuelve los desafíos comunes en aplicaciones frontend empresariales:

- **Complejidad creciente** con el tamaño del proyecto
- **Código disperso** y dependencias complejas
- **Dificultades de testing** y mantenimiento
- **Curva de aprendizaje elevada** para nuevos desarrolladores

## Arquitectura Implementada

### Visión General
La arquitectura es una **fusión de mejores prácticas** que combina patrones probados y modernos para resolver los desafíos de escalabilidad en aplicaciones frontend empresariales:

1. **Arquitectura Modular por Dominios** - Cada funcionalidad encapsulada en su propio módulo independiente con API pública controlada
2. **Atomic Design Adaptado** - Componentes, Sections, Views y Pages organizados jerárquicamente para reutilización efectiva
3. **Separación SCF (Script-Component-File)** - División en tres archivos: template, lógica y estilos para mejorar testabilidad
4. **Estructura Flat Inteligente** - Evita anidamientos excesivos manteniendo archivos relacionados juntos
5. **Core y Shared Centralizados** - Lógica estructural global y recursos compartidos organizados
6. **Patrón Either** - Manejo funcional de errores con type safety garantizado
7. **Patrón Factory para Testing** - Factories centralizadas por módulo para datos de prueba consistentes
8. **Patrón Provide/Inject** - Gestión de estado local complejo entre componentes padre-hijo
9. **Patrón de Servicios HTTP** - Servicios encapsulados por módulo con instancia HTTP centralizada
10. **Reactividad Vue 3** - Sistema de reactividad automática con composables para gestión de estado local


### Estructura del Proyecto

```
src/
├── core/                    # Infraestructura técnica
│   ├── api/                # Instancia global de Axios
│   ├── either/             # Patrón Either para manejo de errores
│   └── router/             # Configuración de rutas
├── modules/                # Módulos de negocio
│   ├── anime/              # Módulo de anime (dominio completo)
│   └── auth/               # Módulo de autenticación
└── shared/                 # Recursos compartidos
    ├── common/             # Componentes y utilidades genéricas
    └── layout/             # Componentes estructurales
```

### Principios Arquitectónicos

#### 1. **Encapsulación y Cohesión**
- Cada módulo es una unidad independiente y cohesiva
- Todo dentro de su módulo: componentes, stores, tipos, servicios, errores y rutas
- Alta cohesión interna, bajo acoplamiento externo

#### 2. **API Pública (`index.ts`)**
- Comunicación entre módulos solo a través de `index.ts`
- Exportaciones explícitas de lo que se expone al resto de la aplicación
- Todo lo no exportado se considera privado

#### 3. **Patrón SCF (Script-Component-File)**
```
components/
├── AnimeCard/
│   ├── index.vue           # Template y presentación
│   ├── useAnimeCard.ts     # Lógica reactiva y composables
│   └── animeCard.styles.scss # Estilos específicos
```

#### 4. **Gestión de Estado Local Complejo**
- Patrón `provide`/`inject` para estado compartido entre componentes
- Composables encapsulados para gestión de estado complejo

## Tecnologías Utilizadas

- **Vue 3** - Framework progresivo con Composition API
- **TypeScript** - Tipado estático completo
- **Pinia** - Gestión de estado reactiva
- **Vue Router** - Enrutamiento modular
- **Element Plus** - Sistema de componentes UI
- **Axios** - Cliente HTTP con interceptores
- **Vite** - Build tool moderno
- **Vitest** - Framework de testing
- **SCSS** - Preprocesador CSS con variables

## Instalación y Desarrollo

```bash
# Clonar y instalar
git clone <repository-url>
cd scalable-architecture-functional
yarn install

# Desarrollo
yarn run dev

# Testing
yarn run test

# Build
yarn run build
```

## 🎯 Beneficios Demostrados

### **Mantenibilidad**
- Cambios y errores se aíslan dentro de sus respectivos módulos
- Corrección y evolución del sistema facilitada

### **Escalabilidad**
- Nuevas funcionalidades como módulos independientes
- Equipos trabajando en paralelo sin conflictos
- Crecimiento del proyecto sin afectar otras áreas

### **Testabilidad**
- Separación SCF simplifica pruebas unitarias
- Patrón Either para testing de casos de éxito y error
- Factories y utilidades de test organizadas

### **Colaboración**
- Estructura modular permite trabajo en paralelo
- Conflictos y dependencias innecesarias minimizadas
- Curva de aprendizaje reducida

### **Predictibilidad**
- Estructura consistente y estandarizada
- Nomenclatura clara y navegación intuitiva
- Incorporación de nuevos desarrolladores facilitada

## Documentación

- **[Lineamientos de Arquitectura](./ARCHITECTURE_GUIDELINES.md)** - Guía completa de la arquitectura
- **[Guía de Testing](./TESTING_GUIDELINES.md)** - Mejores prácticas de testing

## Módulos Implementados

### **Módulo Anime**
- Gestión completa de datos de anime
- Búsqueda, filtros y paginación
- Sistema de favoritos
- Detalles y estadísticas

### **Módulo Auth**
- Sistema de autenticación completo
- Formularios de registro multi-paso
- Validación y manejo de errores
- Protección de rutas

### **Shared Common**
- Componentes base reutilizables (`BaseCard`)
- Utilidades y formateadores
- Tipos TypeScript compartidos
- Manejo de errores común


**Este proyecto demuestra cómo una arquitectura bien diseñada puede transformar una base de código en un sistema de módulos cohesivos e independientes que acelera la entrega de valor y construye una plataforma escalable para el crecimiento del negocio.**
