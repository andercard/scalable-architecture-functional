# Guía de Testing

**Última actualización**: Julio 10 2025  
**Autor actualización**: Anderson Mesa  
**Autor**: Andersson Mesa  
**Responsable**: Equipo de Desarrollo  
**Versión**: 1.0.0 

## Introducción

Esta guía reúne las mejores prácticas, patrones y ejemplos para escribir tests efectivos y mantenibles en este proyecto. Su objetivo es facilitar la incorporación de nuevos desarrolladores, estandarizar la calidad de las pruebas y asegurar que el código sea confiable y fácil de evolucionar. Está inspirada en los principios de la comunidad Vue y en referentes como Kent C. Dodds, priorizando la experiencia del usuario final y la robustez de la lógica de negocio.

¿A quién está dirigida esta guía?
- A cualquier desarrollador que trabaje en el proyecto, sin importar su nivel de experiencia.
- A quienes deseen entender el porqué de las decisiones de testing y cómo aplicarlas en la práctica.

Esta documentación es un recurso vivo: se actualiza y mejora continuamente con la experiencia del equipo y los avances de la comunidad. Si tienes sugerencias o detectas áreas de mejora, ¡no dudes en contribuir!

---

Este es el índice principal de la documentación de testing. Selecciona la sección que deseas consultar:

- [Tipos de usuario](./user-types.md)
- [Mejores prácticas](./best-practices.md)
- [LocalStorage](./localstorage.md)
- [Vue Router](./vue-router.md)
- [Factories](./factories.md)
- [Formularios](./forms.md)
- [userEvent](./user-event.md)
- [Stores Pinia](./stores.md)
- [Mockeo de composables](./composables-mocking.md)
- [Cobertura](./coverage.md)
- [Herramientas y configuración](./tools-config.md)
- [Preguntas de calidad](./quality-questions.md)

---

## Recursos y Referencias

### **Artículos Fundamentales**
- [Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests) - Kent C. Dodds
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) - Kent C. Dodds
- [The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy) - Kent C. Dodds

### **Documentación Oficial**
- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing) - Guía oficial de testing en Vue
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/) - Herramienta recomendada para component testing
- [User Event Documentation](https://testing-library.com/docs/user-event/v13/) - Documentación oficial de user-event
- [User Event GitHub Repository](https://github.com/testing-library/user-event) - Repositorio oficial con ejemplos y issues

### **Vue 3 Testing Específico**
- [Vue Testing Guide](https://vuejs.org/guide/scaling-up/testing) - Documentación oficial de Vue
- [Testing Vue Components with Vitest](https://dev.to/jacobandrewsky/testing-vue-components-with-vitest-5c21) - Jacob Andrewsky
- [Testing Vue Composables Lifecycle](https://dylanbritz.dev/writing/testing-vue-composables-lifecycle/) - Dylan Britz
- [Good Practices for Vue Composables](https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk) - Jacob Andrewsky
- [How to Test Vue Composables](https://alexop.dev/posts/how-to-test-vue-composables/) - Alex Op
- [How to Write Clean Vue Components](https://alexop.dev/posts/how-to-write-clean-vue-components/) - Alex Op
- [Vue Test Utils Advanced Guide](https://test-utils.vuejs.org/guide/advanced/reusability-composition) - Documentación oficial

### **Vue Router Testing**
- [Vue Test Utils - Using with Vue Router](https://v1.test-utils.vuejs.org/guides/using-with-vue-router.html) - Documentación oficial
- [Vue Testing Library - Vue Router Example](https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/vue-router.js) - Ejemplo oficial de Vue Testing Library
- [Vue Testing Handbook - Vue Router](https://lmiller1990.github.io/vue-testing-handbook/vue-router.html) - Guía completa de testing de router
- [Focused.io - Vue Router Testing Strategies](https://focused.io/lab/vue-router-testing-strategies) - Estrategias avanzadas de testing
- [Unit Testing Vue Router](https://medium.com/js-dojo/unit-testing-vue-router-1d091241312) - Mejores prácticas específicas

### **Mejores Prácticas de Testing**
- [How I Started Writing Unit Tests for Vue Components](https://www.byteminds.co.uk/blog/how-i-started-writing-unit-tests-for-vue-components) - Byteminds
- [Vue.js Testing with Vue Test Utils and Vitest](https://vueschool.io/articles/vuejs-tutorials/vue-js-testing-with-vue-test-utils-and-vitest/) - Vue School
- [Realiza Pruebas Unitarias con Vitest y Vue Test Utils](https://codingpr.com/es/realiza-pruebas-unitarias-con-vitest-y-vue-test-utils/) - CodingPR

**Nota sobre las referencias**: Esta documentación está basada en las mejores prácticas establecidas por la comunidad Vue y los principios de testing moderno. Todas las referencias han sido seleccionadas por su relevancia y autoridad en el tema. La frase clave "Si un usuario no puede hacerlo, tu prueba tampoco debería poder hacerlo" es fundamental para entender el enfoque de testing centrado en el usuario.

### **Pinia Testing**
- [Pinia Testing Documentation](https://pinia.vuejs.org/cookbook/testing.html) - Documentación oficial de Pinia
- [Unit Testing a Pinia Component](https://fadamakis.com/unit-testing-a-pinia-component-37d045582aed?gi=644ecb388b0a) - Fotis Adamakis - Mejores prácticas específicas
- [Testing Vuex/Pinia Stores](https://test-utils.vuejs.org/guide/advanced/vuex.html) - Vue Test Utils - Guía oficial

