# Módulo Auth

Este módulo implementa el sistema de autenticación de la aplicación, incluyendo login, registro, gestión de estado de usuario y protección de rutas.

## Estructura

```
src/modules/auth/
├── composables/        # Lógica de autenticación
│   ├── useLogin.ts     # Lógica de inicio de sesión
│   └── useRegister.ts  # Lógica de registro
├── pages/              # Páginas de autenticación
│   ├── Login.vue       # Página de inicio de sesión
│   └── Register.vue    # Página de registro
├── routes/             # Configuración de rutas
│   ├── index.ts        # Exports de rutas
│   ├── routes.private.ts # Rutas protegidas
│   ├── routes.public.ts  # Rutas públicas
│   └── auth.guards.ts  # Guards de autenticación
├── stores/             # Stores de Pinia
│   └── authStore.ts    # Store de autenticación
├── styles/             # Estilos del módulo
│   ├── Login.styles.scss
│   └── Register.styles.scss
├── types/              # Tipos TypeScript específicos
│   ├── Auth.types.ts   # Tipos principales de auth
│   ├── Login.types.ts  # Tipos de login
│   ├── Register.types.ts # Tipos de registro
│   └── index.ts        # Exports de tipos
├── index.ts            # Exports del módulo
└── README.md           # Esta documentación
```

## Características

### 🔐 Funcionalidades Principales
- **Login**: Inicio de sesión con validación
- **Registro**: Creación de cuenta con validación
- **Gestión de Estado**: Persistencia de sesión
- **Protección de Rutas**: Guards de navegación
- **Logout**: Cierre de sesión seguro
- **Guards Personalizados**: Rate limiting y validaciones

### 🏗️ Arquitectura
- **Store Pinia**: Gestión centralizada del estado de usuario
- **Composables**: Lógica reutilizable de autenticación
- **Route Guards**: Protección automática de rutas
- **TypeScript**: Tipado completo y seguro

### 🎨 UI/UX
- **Element Plus**: Formularios y componentes UI
- **Validación**: Reglas de validación en tiempo real
- **Feedback**: Mensajes de error y éxito
- **Responsive**: Diseño adaptable

## Uso

### Importar Páginas
```vue
<template>
  <Login />
  <Register />
</template>

<script setup>
import Login from '@modules/auth/pages/Login.vue'
import Register from '@modules/auth/pages/Register.vue'
</script>
```

### Usar Composables
```typescript
import { useLogin } from '@modules/auth/composables/useLogin'
import { useRegister } from '@modules/auth/composables/useRegister'

const { loginForm, handleLogin, isLoading } = useLogin()
const { registerForm, handleRegister, rules } = useRegister()
```

### Usar Store
```typescript
import { useAuthStore } from '@modules/auth/stores/authStore'

const authStore = useAuthStore()

// Verificar autenticación
if (authStore.isAuthenticated) {
  // Usuario autenticado
}

// Login
const success = await authStore.login(credentials)

// Logout
authStore.logout()
```

### Usar Guards de Autenticación
```typescript
import { 
  authRateLimitGuard, 
  authRegistrationGuard,
  authRequiresAuthGuard,
  authRequiresGuestGuard
} from '@modules/auth/routes/auth.guards'

// Guards específicos para diferentes casos
// - authRequiresAuthGuard: Verifica que el usuario esté autenticado
// - authRequiresGuestGuard: Verifica que el usuario NO esté autenticado
// - authRateLimitGuard: Previene spam de intentos de login
// - authRegistrationGuard: Valida registro de usuarios
```

## Configuración de Rutas

### Rutas Públicas
```typescript
// Rutas que requieren NO estar autenticado
const publicRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@modules/auth/pages/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@modules/auth/pages/Register.vue'),
    meta: { requiresGuest: true }
  }
]
```

### Protección de Rutas
```typescript
// Los guards se ejecutan automáticamente desde el core
// Para rutas que requieren autenticación:
{
  path: '/protected',
  name: 'Protected',
  component: () => import('@modules/auth/pages/Protected.vue'),
  meta: { 
    requiresAuth: true,
    guards: ['authRequiresAuthGuard']
  }
}

// Para rutas que requieren ser invitado:
{
  path: '/login',
  name: 'Login',
  component: () => import('@modules/auth/pages/Login.vue'),
  meta: { 
    requiresGuest: true,
    guards: ['authRequiresGuestGuard', 'authRateLimitGuard']
  }
}
```

## Validación de Formularios

### Login
```typescript
const rules = {
  username: [
    { required: true, message: 'Por favor ingresa tu usuario', trigger: 'blur' },
    { min: 3, message: 'El usuario debe tener al menos 3 caracteres', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Por favor ingresa tu contraseña', trigger: 'blur' },
    { min: 6, message: 'La contraseña debe tener al menos 6 caracteres', trigger: 'blur' }
  ]
}
```

### Registro
```typescript
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Por favor confirma tu contraseña'))
  } else if (value !== registerForm.password) {
    callback(new Error('Las contraseñas no coinciden'))
  } else {
    callback()
  }
}
```

## Guards de Autenticación

### Tipos de Guards Disponibles

#### `authRequiresAuthGuard`
- **Propósito**: Verifica que el usuario esté autenticado
- **Uso**: Para rutas que requieren login
- **Comportamiento**: Redirige a Login si no está autenticado

#### `authRequiresGuestGuard`
- **Propósito**: Verifica que el usuario NO esté autenticado
- **Uso**: Para páginas de login/registro
- **Comportamiento**: Redirige a AnimeList si ya está autenticado

#### `authRateLimitGuard`
- **Propósito**: Previene spam de intentos de login
- **Uso**: En páginas de autenticación
- **Comportamiento**: Bloquea después de 5 intentos en 1 minuto

#### `authRegistrationGuard`
- **Propósito**: Valida el proceso de registro
- **Uso**: En páginas de registro
- **Comportamiento**: Verifica que el usuario no esté ya registrado

### Configuración en Rutas
```typescript
// Ejemplo de uso en routes.public.ts
export const authPublicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: {
      requiresGuest: true,
      guards: ['authRequiresGuestGuard', 'authRateLimitGuard']
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
    meta: {
      requiresGuest: true,
      guards: ['authRequiresGuestGuard', 'authRegistrationGuard']
    }
  }
]
```

## Estado de Usuario

### Estructura del Usuario
```typescript
interface User {
  id: string
  username: string
  email: string
  avatar: string
}
```

### Persistencia
- **localStorage**: Almacenamiento local de sesión
- **Auto-login**: Restauración automática al recargar
- **Logout**: Limpieza completa de datos

## Testing

El módulo incluye:
- **Composables Testeables**: Lógica aislada y mockeable
- **Store Testeable**: Estado predecible
- **Validación**: Reglas de validación verificables
- **Guards**: Protección de rutas testeable

## Dependencias

### Internas
- `@shared/utils` - Utilidades globales
- `@shared/types` - Tipos compartidos

### Externas
- **Vue 3** - Framework base
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento
- **Element Plus** - Componentes UI
- **Element Plus Icons** - Iconos

## Seguridad

### Consideraciones
- **Validación Cliente**: Validación en tiempo real
- **Validación Servidor**: Validación en backend (cuando esté disponible)
- **Persistencia Segura**: Almacenamiento local seguro
- **Logout Automático**: Limpieza de datos al cerrar sesión

### Demo Credenciales
Para propósitos de demostración:
- **Usuario**: `demo`
- **Contraseña**: `demo123`

## Arquitectura del Formulario de Registro

El formulario de registro utiliza una arquitectura escalable basada en **Provider/Inject** con las siguientes características:

### Características Principales

- **Formulario Multi-Sección**: Dividido en 4 secciones lógicas
- **Provider/Inject Pattern**: Estado compartido entre componentes
- **Validación por Sección**: Cada sección se valida independientemente
- **Navegación Intuitiva**: Progreso visual y navegación entre secciones
- **Escalable**: Fácil agregar nuevas secciones
- **Testeable**: Cada componente es independiente y testeable

### Estructura de Archivos

```
auth/
├── components/
│   ├── RegisterForm.vue              # Componente principal (orquestador)
│   ├── RegisterBasicSection.vue      # Sección: Datos básicos
│   ├── RegisterResidenceSection.vue  # Sección: Residencia
│   ├── RegisterContactSection.vue    # Sección: Información de contacto
│   ├── RegisterPreferencesSection.vue # Sección: Preferencias
│   └── index.ts                      # Exportaciones
├── composables/
│   ├── useRegisterForm.ts            # Provider/Inject logic
│   └── useRegister.ts                # Lógica anterior (legacy)
├── types/
│   ├── Register.types.ts             # Tipos del formulario
│   └── Auth.types.ts                 # Tipos de autenticación
└── stores/
    └── auth.store.ts                 # Estado global de auth
```

### Secciones del Formulario

1. **Datos Básicos** (`basic`)
   - Nombre y apellido
   - Usuario y email
   - Contraseña y confirmación
   - Fecha de nacimiento

2. **Residencia** (`residence`)
   - País, estado, ciudad
   - Dirección completa
   - Código postal

3. **Información de Contacto** (`contact`)
   - Teléfono personal
   - Contacto de emergencia
   - Teléfono de emergencia

4. **Preferencias** (`preferences`)
   - Newsletter
   - Marketing
   - Términos y condiciones

### Provider/Inject Pattern

El composable `useRegisterForm.ts` proporciona:

```typescript
interface RegisterFormProvider {
  form: RegisterForm                    // Estado del formulario
  sections: RegisterSection[]           // Configuración de secciones
  currentSection: Ref<number>           // Sección actual
  isFormValid: ComputedRef<boolean>     // Validación global
  isLoading: Ref<boolean>               // Estado de carga
  updateField: Function                 // Actualizar campo
  updateSection: Function               // Actualizar sección
  nextSection: Function                 // Siguiente sección
  previousSection: Function             // Sección anterior
  goToSection: Function                 // Ir a sección específica
  validateSection: Function             // Validar sección
  validateForm: Function                // Validar formulario completo
  submitForm: Function                  // Enviar formulario
}
```

### Uso

```vue
<template>
  <RegisterForm />
</template>

<script setup>
import { RegisterForm } from '@/modules/auth/components'
</script>
```

### Validación

- **Validación por Sección**: Cada sección valida sus campos independientemente
- **Validación Global**: El formulario completo se valida antes del envío
- **Validación en Tiempo Real**: Los campos se validan al cambiar
- **Estado Visual**: Indicadores de progreso y completitud

### Escalabilidad

Para agregar una nueva sección:

1. Crear el componente de la sección
2. Agregar la configuración en `sections` array
3. Implementar la validación en `validateSection`
4. Agregar los campos al tipo `RegisterForm`
5. Actualizar el store si es necesario

### Testing

Cada componente es testeable de forma independiente:

- **Componentes de Sección**: Pruebas unitarias de validación
- **Provider**: Pruebas de estado y lógica de negocio
- **Formulario Principal**: Pruebas de integración
- **Store**: Pruebas de persistencia y API

### Ventajas de esta Arquitectura

- ✅ **Separación de Responsabilidades**: Cada componente tiene una responsabilidad específica
- ✅ **Reutilización**: Los componentes de sección pueden reutilizarse
- ✅ **Mantenibilidad**: Cambios en una sección no afectan otras
- ✅ **Testeabilidad**: Cada parte es testeable independientemente
- ✅ **Escalabilidad**: Fácil agregar nuevas secciones
- ✅ **UX Mejorada**: Progreso visual y navegación intuitiva 