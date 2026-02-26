
# Ausauth Blog

[Ver la app desplegada — Ausauth Blog](https://ausauth-blog.fly.dev/)

## Resumen

Aplicación full-stack de ejemplo para crear, editar, comentar y dar "like" a blogs.

Stack principal

- Backend: Node.js + Express + Mongoose
- Autenticación: JWT (access + refresh con rotación de JTI)
- Frontend: React + Vite
- Tests: Vitest (frontend), supertest (backend), Playwright (E2E)

### Agregados

Tecnologías y medidas adicionales aplicadas en esta aplicación:

- Seguridad y autenticación
  - JWT de acceso (short-lived) y Refresh Tokens (httpOnly cookie) con rotación de JTI (single-use refresh tokens).
  - Revocación de refresh tokens en logout y verificación de JTI en la base de datos.
  - Helmet para políticas de cabeceras HTTP seguras.
  - rate-limiting en rutas críticas para mitigar abuso/DoS.
  - Validación de entrada con Zod (schemas para peticiones críticas).
  - Cookies con SameSite, Secure (en producción) y httpOnly para mayor seguridad.

- Backend
  - Node.js + Express, MongoDB + Mongoose.
  - Controladores y servicios separados (service layer) para mejor mantenibilidad.
  - Manejo centralizado de middleware (token extractor, user extractor, gestión de errores JWT).
  - Tests de integración con supertest y unitarios para lógica crítica.

- Frontend
  - React + Vite, axios con credenciales habilitadas para llamadas con cookie de refresh.
  - Interceptor/Retry en `blogService` que llama a `/api/login/refresh` y reintenta la petición original en 401.
  - Componentes con tema oscuro por defecto y variables CSS para personalización (`--bg`, `--surface`, `--text`, `--card`, etc.).
  - Tests unitarios con Vitest y pruebas E2E con Playwright.

- DevOps / CI / Infra
  - Docker y docker-compose (configurados para backend y frontend) — posibilidad de ejecutar todo en contenedores.
  - GitHub Actions workflow para ejecutar tests y linters (CI básica).
  - OpenAPI / documentación de endpoints (cuando disponible en el backend).

- Otras mejoras de DX / seguridad
  - Logger y sanitización de información sensible (p. ej. contraseñas) en logs.
  - Buenas prácticas en manejo de errores y mensajes de respuesta para evitar fugas de información.
  - Recomendación: eliminar `node_modules` del historial git y usar `.gitignore` para no subir dependencias.

## Listado completo de tecnologías y herramientas

A continuación se muestra un inventario categorizado de las tecnologías, librerías y prácticas utilizadas en este proyecto.

- Seguridad & Autenticación
  - JWT (access tokens cortos) y Refresh Tokens con rotación (JTI)
  - Cookies httpOnly, SameSite y Secure (en producción)
  - Helmet (cabeceras de seguridad / CSP)
  - express-rate-limit (limitación de intentos, p. ej. login)
  - Validación de entrada con Zod

- Backend / API
  - Node.js (v18+/v20 compatible) y Express
  - Mongoose (ODM) + MongoDB (Atlas o local)
  - Estructura por controladores y servicios
  - OpenAPI / swagger-ui para documentación de endpoints
  - body-parser / express.json

- Frontend
  - React (18+) y Vite
  - CSS variables para theming (tema oscuro por defecto)
  - Componentización con Hooks y pequeños componentes reutilizables

- HTTP / Cliente
  - axios (cliente HTTP) con withCredentials para cookies
  - Estrategia de refresh automático: interceptor que llama `/api/login/refresh` y reintenta peticiones 401

- Testing
  - Unit / Integration backend: Jest + supertest (tests de endpoints)
  - Unit frontend: Vitest + Testing Library (componentes)
  - E2E: Playwright Test (tests en `frontend/e2e`)

- DevOps / CI / Deploy
  - Fly.io para hosting y despliegue (imagen Docker)
  - Dockerfile para el backend; imagen construida y push a registry.fly.io
  - GitHub Actions (workflows de CI) — ejecutar tests y linters

- Linting / Calidad
  - ESLint (configuración en frontend/backend)
  - Prettier (formato consistente)

- Observability / Logs
  - Logger (módulo centralizado) — registra eventos y errores
  - Soporte para ver logs remotos (fly logs) y health endpoint (`/health`)

- Otras librerías y utilidades notables
  - bcrypt (hashing de contraseñas)
  - cookie-parser
  - helmet
  - express-rate-limit
  - zod (validaciones)
  - swagger-ui-express

Si quieres, puedo añadir esta sección también al `frontend/README.md` o generar un archivo `TECH.md` más detallado con versiones y enlaces a la documentación.

## Ejecutar en desarrollo

1) Backend

```bash
cd backend
npm install
# configurar variables de entorno (MONGODB_URI, SECRET, REFRESH_SECRET)
npm run dev
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 (Vite) y el backend en http://localhost:3001 según configuración.

## Tests

```bash
# backend
cd backend
npm test

# frontend
cd frontend
npm run test:run

# E2E
cd frontend
npm run test:e2e
```

## Docker

Si quieres ejecutar con Docker, usa los archivos Docker/Docker Compose incluidos (si los hay):

```bash
# docker-compose up --build
```

## Contribuir

1. Crea una rama feature/...
2. Haz commits descriptivos
3. Abre un PR

## Notas

- Asegúrate de no subir `node_modules` al repositorio; añade `.gitignore` si aún no existe.
- En producción, define `REFRESH_SECRET` distinto de `SECRET`.

---

Puedo hacer el commit y push ahora si quieres.
Puedo hacer el commit y push ahora si quieres.
