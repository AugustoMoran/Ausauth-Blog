
# Ausauth Blog

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
