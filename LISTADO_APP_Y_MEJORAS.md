# Estado actual de la app y mejoras sugeridas

## Lo que ya tiene implementado

### Backend (Node + Express + MongoDB + JWT)
- API REST para:
  - usuarios (`/api/users`)
  - login (`/api/login`)
  - blogs (`/api/blogs`)
- Autenticación con token JWT.
- Hash de contraseña con `bcrypt`.
- Protección de rutas sensibles (crear/eliminar blog).
- Regla de ownership: solo el creador borra su blog.
- Validaciones básicas:
  - username mínimo y único
  - password mínima
  - blog con `title` y `url`
  - `likes` default `0`
- Middleware de:
  - extracción de token
  - manejo de errores
  - endpoint desconocido
- Endpoint de testing (`/api/testing/reset`) para E2E/dev.

### Frontend (React + Vite)
- Login/logout funcional.
- Persistencia de sesión en `localStorage`.
- Listado de blogs ordenados por likes.
- Crear, dar like y eliminar blogs.
- Componentes separados (`Blog`, `BlogForm`, `BlogList`, `LoginForm`, `Notification`, etc.).
- UX base con feedback y notificaciones.

### Calidad / Testing
- Tests backend pasando (`node:test + supertest`).
- Tests unitarios frontend pasando (`Vitest + Testing Library`).
- Tests E2E pasando (`Playwright`).
- Lint frontend limpio.

---

## Qué se puede agregar (priorizado)

### 1) Mejoras de producto (alto impacto, poco esfuerzo)
- Registro desde UI.
- Mensajes de éxito/error más claros por caso.
- Loading states (spinners/skeletons) en login/carga/lista.
- Confirmaciones UX mejores (modal UI para borrar, en vez de `window.confirm`).

### 2) Features core para app “real”
- Editar blog (título/autor/url).
- Comentarios por blog.
- Búsqueda y filtros (por título/autor, top likes).
- Paginación o infinite scroll.
- Perfil de usuario (blogs creados, estadísticas).

### 3) Seguridad y robustez
- JWT con expiración (`expiresIn`) + manejo de re-login.
- Rate limit en login.
- Helmet + hardening de headers.
- Sanitización/validación más estricta (Zod/Joi).
- Evitar logs con datos sensibles en producción.

### 4) Escalabilidad técnica
- ✅ Mejor separación por capas en backend (controlador + servicio en autenticación).
- ✅ Documentación API con OpenAPI/Swagger (`/api/docs`).
- ✅ CI (lint + test + e2e smoke) con GitHub Actions.
- ✅ Docker para levantar entorno con un comando (`docker-compose.yml`).

**Pendiente dentro del punto 4:**
- Extender separación por capas al resto de dominios (blogs/usuarios) de forma completa.
- Endurecer pipeline CI con cobertura y más casos e2e.

### 5) UX/UI pro
- Tema oscuro/claro.
- Diseño consistente por sistema de componentes.
- Toasts y transiciones mejores.
- Empty states más trabajados.

---

## Siguiente sprint recomendado
1. Registro en frontend
2. Editar blog
3. Comentarios
4. JWT con expiración
5. CI automática en GitHub Actions
