# Historial de Desarrollo — CHRONOS (Gestor de Tiempos SENA)

Este documento resume todo el trabajo realizado durante el desarrollo del proyecto.

---

## Fase 1 — Autenticación y Base

### Archivos creados/modificados
- `backend/src/routes/auth.js` — Registro e inicio de sesión con bcrypt + JWT
- `backend/src/routes/sedes.js` — CRUD de sedes
- `backend/src/routes/roles.js` — CRUD de roles
- `backend/src/middleware/auth.js` — Middleware verifyToken + verifyRole
- `backend/seed.js` — Script para datos iniciales

### Base de datos
- Tablas: `rol`, `sede`, `estado_actividad`, `turno`, `usuario`, `actividad`, `registro_hora`, `aprobacion`, `historial`, `reporte`
- Credenciales Railway: host `caboose.proxy.rlwy.net`, port `25164`, user `root`, password `ITlAeHrEsNRzqQEBqnQChgWEaHYkAAjj`, database `railway`
- MySQL requiere SSL con `rejectUnauthorized: false`

---

## Fase 2 — CRUD Principal

### Archivos creados
- `backend/src/routes/usuarios.js` — CRUD + cambio de contraseña
- `backend/src/routes/actividades.js` — CRUD + filtro por usuario
- `backend/src/routes/turnos.js` — CRUD
- `backend/src/routes/estados.js` — CRUD

---

## Fase 3 — Lógica de Negocio

### Archivos creados
- `backend/src/routes/registros.js` — Registro entrada/salida con cálculo automático via `TIME_TO_SEC`
- `backend/src/routes/aprobaciones.js` — Aprobar/rechazar actualiza estado del registro

### Notas técnicas
- Route ordering en Express: rutas específicas (`/salida/:id`, `/usuario/:id`, `/pendientes`) DEBEN ir ANTES de `/:id`

---

## Fase 4 — Dashboard y Reportes

### Archivos creados
- `backend/src/routes/dashboard.js` — 6 endpoints KPI: resumen, actividades by estado, turnos hours, recientes, horas by user, aprobaciones summary
- `backend/src/routes/reportes.js` — CRUD + `/generar` para datos en tiempo real

---

## Fase 5 — Auditoría y Notificaciones

### Archivos creados
- `backend/src/routes/historial.js` — CRUD de auditoría
- `backend/src/routes/notificaciones.js` — CRUD + no-leidas + mark read/read-all
- `backend/src/routes/contacto.js` — Nodemailer Gmail SMTP
- Tabla `notificacion` creada en DB

---

## Comentado completo (Fase 4+)
- Todos los 14 archivos backend tienen documentación JSDoc con:
  - Header descriptivo del archivo
  - Documentación de cada endpoint
  - Explicación de la lógica de negocio
  - Comentarios inline en código complejo

---

## Frontend — Conexión con API

### Servicio API
- `frontend/src/services/api.js` — Soporte JWT automático en headers, `API_URL` usa proxy de Vite en local (`''`) y `VITE_API_URL` en producción
- `handleResponse()` valida `content-type` antes de parsear JSON, dando error claro si el backend no responde

### Autenticación
- `frontend/src/context/AuthContext.jsx` — Login, registro, logout con localStorage
- `frontend/src/App.jsx` — Envuelto con `<AuthProvider>`
- `frontend/src/routes/AppRoutes.jsx` — Rutas protegidas con `ProtectedRoute`

### Páginas conectadas a la API
| Página | Endpoint(s) |
|--------|------------|
| Login | `POST /api/auth/login` |
| Registro | `POST /api/auth/register` |
| Dashboard | `GET /api/dashboard/resumen`, `/recientes` |
| Inicio | `GET /api/actividades`, `/api/registros/usuario/:id` |
| Usuarios | `GET /api/usuarios` |
| Actividades | `GET /api/actividades` |
| Jornada | `GET /api/registros` |
| Aprobaciones | `GET /api/aprobaciones/pendientes`, `POST /api/aprobaciones` |
| Reportes | `GET /api/dashboard/resumen`, `/turnos`, `/horas` |
| Notificaciones | `GET /api/notificaciones/usuario/:id`, `PUT /leer/:id`, `PUT /leer-todas/:id` |
| Auditoria | `GET /api/historial` |
| Contacto | `POST /api/contacto` |
| Configuracion | `PUT /api/usuarios/:id`, `PUT /usuarios/:id/password` |

### Sidebar refactorizado
- `frontend/src/components/Sidebar.jsx` — Usa `useAuth()` directamente, sin props
- Incluye botón "Cerrar sesión"
- Se eliminaron imports innecesarios de `useAuth` en 5 páginas

---

## Páginas Públicas (Landing)

### Creadas
- `frontend/src/pages/Caracteristicas.jsx` + `Caracteristicas.css` — 6 módulos del sistema
- `frontend/src/pages/Precios.jsx` + `Precios.css` — 3 planes + FAQ
- `frontend/src/pages/Soporte.jsx` + `Soporte.css` — Canales + FAQ + CTA

### Contacto (fix)
- Eliminado import de `Sidebar` no utilizado
- Agregada barra de navegación con logo y botón de regreso
- Layout corregido a `flex-direction: column`

### Landing actualizado
- Links de nav ahora navegan a `/caracteristicas`, `/precios`, `/soporte`

---

## Scripts

### `package.json` raíz
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && node index.js",
    "dev:frontend": "cd frontend && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  }
}
```

---

## Bugs Corregidos

1. **Login 404 en local** — `API_URL` usaba `http://localhost:3000` que bypassaba el proxy de Vite. Cambiado a `''` para usar proxy.

2. **handleResponse sin validación de content-type** — Intentaba parsear HTML como JSON. Agregada validación de `content-type`.

3. **Registro FK constraint** — `id_sede: 1` hardcodeado pero la sede en DB tenía `id: 2`. Backend ahora busca sede por defecto automáticamente.

4. **Contacto layout roto** — Import de `Sidebar` no utilizado + sin navegación. Reescrito como página pública standalone.

5. **Railway 404** — `VITE_API_URL` no configurada en el servicio Frontend de Railway. Requiere agregar la variable en el panel de Railway.

---

## Git Commits (en orden)

1. `feat: auth y base - registro, login, sedes, roles con JWT y bcrypt`
2. `feat: crud principal - usuarios, actividades, turnos y estados`
3. `feat: logica de negocio - registros de jornada y aprobaciones`
4. `feat: dashboard y reportes - 6 endpoints KPI y generacion`
5. `feat: auditoria y notificaciones - historial, notificaciones y contacto`
6. `docs: documentacion completa - JSDoc en todos los archivos backend`
7. `feat: conectar todo el frontend al backend`
8. `fix: corregir URL del API en frontend`
9. `refactor: sidebar usa AuthContext directamente`
10. `feat: crear paginas de Caracteristicas, Precios y Soporte`
11. `fix: registro funciona sin id_sede requerido`
12. `fix: registro no envia id_sede hardcodeado`
13. `docs: actualizar README con documentacion completa`

---

## Pendiente

- Configurar `VITE_API_URL` en Railway Frontend service
- Configurar `EMAIL_USER` y `EMAIL_PASS` en Railway Backend service
- Probar envío de emails de contacto
- Probar despliegue completo en Railway

---

**Última actualización:** Agosto 2026
