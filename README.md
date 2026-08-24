# CHRONOS — Sistema de Gestión de Tiempos SENA

Plataforma web para la gestión de turnos, actividades y reportes de microempresas. Permite registrar entrada y salida de empleados, asignar tareas, aprobar registros y generar reportes automáticos.

---

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Módulos del Sistema](#módulos-del-sistema)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Arranque Local](#instalación-y-arranque-local)
- [Variables de Entorno](#variables-de-entorno)
- [Despliegue en Railway](#despliegue-en-railway)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Rutas del Frontend](#rutas-del-frontend)
- [Roles y Permisos](#roles-y-permisos)
- [Flujo del Sistema](#flujo-del-sistema)
- [Próximos Pasos](#próximos-pasos)

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite | React 19 / Vite 5 |
| Backend | Node.js + Express | Node 18+ |
| Base de Datos | MySQL | Railway MySQL |
| Autenticación | JWT (JSON Web Tokens) | — |
| Hash de Contraseñas | bcryptjs | — |
| Email | Nodemailer (Gmail SMTP) | — |
| Despliegue | Railway | — |

---

## Módulos del Sistema

### 1. Autenticación y Seguridad
- Registro de nuevos usuarios con validación de correo único
- Inicio de sesión con JWT (tokens de 24 horas)
- Contraseñas hasheadas con bcrypt (10 rounds de salt)
- Rutas protegidas que requieren autenticación
- Cierre de sesión con limpieza de token

### 2. Gestión de Usuarios
- CRUD completo de usuarios (Crear, Leer, Actualizar, Eliminar)
- Asignación de roles (Administrador, Supervisor, Operario)
- Asignación de sedes
- Cambio de contraseña
- Búsqueda y filtrado de usuarios

### 3. Gestión de Sedes
- Registro de sedes con nombre, ubicación y teléfono
- Las sedes se asignan a usuarios y actividades

### 4. Gestión de Turnos
- CRUD de turnos con nombre, hora de inicio y hora de fin
- Cada turno define la franja horaria laboral

### 5. Gestión de Actividades
- CRUD de actividades con nombre, descripción y fecha límite
- Asignación de actividades a usuarios específicos
- Estados: Pendiente, En Progreso, Completada
- Filtrado de actividades por usuario

### 6. Registro de Jornada (Entrada/Salida)
- Registro de entrada con timestamp automático
- Registro de salida con cálculo automático de horas trabajadas
- El sistema usa `TIME_TO_SEC` para calcular la diferencia entre entrada y salida
- Cada registro se asocia a un turno y un usuario

### 7. Aprobaciones
- Los supervisores revisan registros pendientes
- Opción de aprobar o rechazar con comentario
- Al aprobar, se actualiza automáticamente el estado del registro a "Completada"
- Al rechazar, se actualiza a "Rechazada"
- Historial de todas las decisiones

### 8. Dashboard y Reportes
- **Resumen ejecutivo**: horas totales, usuarios activos, aprobaciones, actividades
- **Actividades por estado**: conteo de pendientes, en progreso y completadas
- **Horas por turno**: distribución de horas trabajadas por cada turno
- **Horas por empleado**: ranking de horas trabajadas por usuario
- **Registros recientes**: últimas 10 entradas/salidas
- **Resumen de aprobaciones**: pendientes, aprobadas y rechazadas
- **Generación de reportes**: horas trabajadas, actividades y asistencia en tiempo real

### 9. Notificaciones
- Creación automática de notificaciones para eventos del sistema
- Conteo de notificaciones no leídas
- Marcado individual como leída
- Marcado de todas como leídas
- Filtrado: todas vs. no leídas

### 10. Auditoría (Historial)
- Registro automático de cada acción realizada en el sistema
- Qué acción se realizó, por quién y cuándo
- Tabla completa con filtros por usuario

### 11. Contacto
- Formulario público de contacto (nombre, correo, asunto, mensaje)
- Envío de email al soporte vía Nodemailer + Gmail SMTP
- Página independiente sin necesidad de iniciar sesión

### 12. Páginas Públicas (Landing)
- **Inicio**: presentación del sistema con estadísticas y funcionalidades destacadas
- **Características**: descripción detallada de los 6 módulos principales
- **Precios**: 3 planes (Básico gratis, Profesional, Empresarial) con FAQ
- **Soporte**: canales de contacto y preguntas frecuentes
- **Contacto**: formulario de soporte con información de contacto

---

## Estructura del Proyecto

```
Gestor_Tiempos_SENA/
├── backend/                    # API REST con Node.js + Express
│   ├── index.js                # Punto de entrada del servidor
│   ├── package.json            # Dependencias del backend
│   ├── database/
│   │   └── chronos_db.sql      # Esquema completo de la base de datos
│   └── src/
│       ├── middleware/
│       │   └── auth.js         # Middleware de autenticación JWT
│       └── routes/
│           ├── auth.js         # Registro e inicio de sesión
│           ├── sedes.js        # CRUD de sedes
│           ├── roles.js        # CRUD de roles
│           ├── usuarios.js     # CRUD de usuarios + cambio de contraseña
│           ├── actividades.js  # CRUD de actividades + filtrado
│           ├── turnos.js       # CRUD de turnos
│           ├── estados.js      # CRUD de estados de actividad
│           ├── registros.js    # Registro de entrada/salida + cálculo
│           ├── aprobaciones.js # Aprobación/rechazo de registros
│           ├── dashboard.js    # Endpoints de KPIs y reportes
│           ├── reportes.js     # CRUD de reportes + generación
│           ├── historial.js    # Registro de auditoría
│           ├── notificaciones.js # CRUD de notificaciones
│           └── contacto.js     # Envío de email de contacto
├── frontend/                   # UI con React + Vite
│   ├── index.html
│   ├── package.json            # Dependencias del frontend
│   ├── vite.config.js          # Configuración de Vite + proxy API
│   └── src/
│       ├── main.jsx            # Punto de entrada de React
│       ├── App.jsx             # Componente raíz con AuthProvider
│       ├── context/
│       │   └── AuthContext.jsx # Estado global de autenticación
│       ├── routes/
│       │   └── AppRoutes.jsx   # Definición de rutas públicas y protegidas
│       ├── services/
│       │   └── api.js          # Cliente HTTP con soporte JWT
│       ├── components/
│       │   ├── Sidebar.jsx     # Menú lateral de navegación
│       │   └── Background.jsx  # Fondo animado con partículas
│       ├── pages/
│       │   ├── Login.jsx           # Inicio de sesión
│       │   ├── Registro.jsx        # Creación de cuenta
│       │   ├── Landing.jsx         # Página de presentación
│       │   ├── Inicio.jsx          # Panel principal del usuario
│       │   ├── Dashboard.jsx       # Resumen ejecutivo con KPIs
│       │   ├── Usuarios.jsx        # Gestión de empleados
│       │   ├── Actividades.jsx     # Gestión de tareas
│       │   ├── Jornada.jsx         # Registro de entrada/salida
│       │   ├── Aprobaciones.jsx    # Aprobación de registros
│       │   ├── Reportes.jsx        # Reportes y estadísticas
│       │   ├── Notificaciones.jsx  # Centro de notificaciones
│       │   ├── Auditoria.jsx       # Historial de acciones
│       │   ├── Configuracion.jsx   # Perfil y ajustes
│       │   ├── Contacto.jsx        # Formulario de contacto
│       │   ├── Caracteristicas.jsx # Módulos del sistema
│       │   ├── Precios.jsx         # Planes y precios
│       │   └── Soporte.jsx         # Centro de ayuda
│       └── styles/                 # Archivos CSS por página
│           ├── index.css           # Variables globales y reset
│           ├── Background.css      # Estilos del canvas animado
│           ├── login.css
│           ├── register.css
│           ├── Landing.css
│           ├── Inicio.css
│           ├── Dashboard.css
│           ├── Usuarios.css
│           ├── Actividades.css
│           ├── Jornada.css
│           ├── Aprobaciones.css
│           ├── Reportes.css
│           ├── Notificaciones.css
│           ├── Auditoria.css
│           ├── Configuracion.css
│           ├── Contacto.css
│           ├── Caracteristicas.css
│           ├── Precios.css
│           └── Soporte.css
├── package.json                # Script raíz para arrancar ambos servicios
├── .gitignore
└── README.md
```

---

## Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **Cuenta de Gmail** (para enviar emails de contacto, opcional)

---

## Instalación y Arranque Local

### Opción 1: Arrancar ambos servicios con un solo comando

```bash
# Clonar el repositorio
git clone https://github.com/SEBOXXD/Gestor_Tiempos_SENA.git
cd Gestor_Tiempos_SENA

# Instalar dependencias raíz (concurrently)
npm install

# Arrancar backend y frontend simultáneamente
npm run dev
```

Esto inicia:
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

### Opción 2: Arrancar cada servicio por separado

**Terminal 1 — Backend:**
```bash
cd backend
npm install
node index.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Verificar que funciona

1. Abre `http://localhost:5173` en tu navegador
2. Deberías ver la pantalla de inicio de sesión
3. Regístrate con un correo nuevo y contraseña
4. Inicia sesión y navega por el sistema

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|------------|---------|
| `DB_HOST` | Host de la base de datos MySQL | `caboose.proxy.rlwy.net` |
| `DB_PORT` | Puerto de la base de datos | `25164` |
| `DB_USER` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | `***` |
| `DB_NAME` | Nombre de la base de datos | `railway` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `mi_clave_secreta` |
| `EMAIL_USER` | Correo de Gmail para enviar emails | `tu@gmail.com` |
| `EMAIL_PASS` | Contraseña de aplicación de Gmail | `xxxx xxxx xxxx xxxx` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Valor en Local | Valor en Railway |
|----------|------------|----------------|------------------|
| `VITE_API_URL` | URL base del backend | *(vacío — usa proxy de Vite)* | `https://backend-production-xxxx.up.railway.app` |

---

## Despliegue en Railway

### Servicios necesarios

Railway despliega 3 servicios independientes:

| Servicio | Source Directory | Puerto | Descripción |
|----------|-----------------|--------|-------------|
| **Backend** | `backend` | 3000 | API REST |
| **Frontend** | `frontend` | $PORT | Aplicación React |
| **MySQL** | — | — | Base de datos |

### Pasos para configurar

1. **Crear proyecto en Railway** y conectar el repositorio de GitHub
2. **Agregar servicio MySQL** desde el panel de Railway
3. **Agregar servicio Backend**:
   - Source Directory: `backend`
   - Las variables de entorno de MySQL se inyectan automáticamente
4. **Agregar servicio Frontend**:
   - Source Directory: `frontend`
   - Agregar variable: `VITE_API_URL` = URL pública del servicio Backend
5. **Configurar variables de entorno** del Backend:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (de MySQL)
   - `JWT_SECRET`
   - `EMAIL_USER`, `EMAIL_PASS` (opcional, para contacto)

### Variables de entorno críticas

> **Nota importante:** `VITE_API_URL` es una variable de **build time** en Vite. Si no se configura antes del build, el frontend no podrá comunicarse con el backend en producción. Después de agregar la variable, ejecuta un **Redeploy** del servicio Frontend.

---

## Base de Datos

### Tablas principales

| Tabla | Descripción |
|-------|------------|
| `rol` | Roles del sistema (Administrador, Supervisor, Operario) |
| `sede` | Sedes o puntos de trabajo |
| `estado_actividad` | Estados posibles de una actividad |
| `turno` | Turnos laborales con horario definido |
| `usuario` | Usuarios del sistema con credenciales |
| `actividad` | Tareas asignadas a usuarios |
| `registro_hora` | Registros de entrada y salida |
| `aprobacion` | Decisiones de aprobación/rechazo |
| `historial` | Auditoría de acciones del sistema |
| `reporte` | Reportes generados |
| `notificacion` | Notificaciones del sistema |

### Vistas

| Vista | Descripción |
|-------|------------|
| `vista_horas_por_usuario` | Total de horas trabajadas por cada usuario |
| `vista_actividades_pendientes` | Actividades con estado Pendiente |
| `vista_resumen_aprobaciones` | Resumen de aprobaciones por estado |

### Script de creación

El esquema completo se encuentra en `backend/database/chronos_db.sql`.

---

## API Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario | No |
| `POST` | `/api/auth/login` | Iniciar sesión | No |

### Usuarios

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/usuarios` | Listar todos los usuarios | Sí |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID | Sí |
| `POST` | `/api/usuarios` | Crear usuario | Sí |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario | Sí |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario | Sí |
| `PUT` | `/api/usuarios/:id/password` | Cambiar contraseña | Sí |

### Sedes

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/sedes` | Listar sedes | Sí |
| `POST` | `/api/sedes` | Crear sede | Sí |
| `PUT` | `/api/sedes/:id` | Actualizar sede | Sí |
| `DELETE` | `/api/sedes/:id` | Eliminar sede | Sí |

### Turnos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/turnos` | Listar turnos | Sí |
| `POST` | `/api/turnos` | Crear turno | Sí |
| `PUT` | `/api/turnos/:id` | Actualizar turno | Sí |
| `DELETE` | `/api/turnos/:id` | Eliminar turno | Sí |

### Actividades

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/actividades` | Listar actividades | Sí |
| `GET` | `/api/actividades/usuario/:id` | Actividades de un usuario | Sí |
| `POST` | `/api/actividades` | Crear actividad | Sí |
| `PUT` | `/api/actividades/:id` | Actualizar actividad | Sí |
| `DELETE` | `/api/actividades/:id` | Eliminar actividad | Sí |

### Registro de Jornada

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/registros` | Listar registros | Sí |
| `GET` | `/api/registros/usuario/:id` | Registros de un usuario | Sí |
| `POST` | `/api/registros/entrada` | Registrar entrada | Sí |
| `PUT` | `/api/registros/salida/:id` | Registrar salida | Sí |

### Aprobaciones

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/aprobaciones` | Listar aprobaciones | Sí |
| `GET` | `/api/aprobaciones/pendientes` | Aprobaciones pendientes | Sí |
| `POST` | `/api/aprobaciones` | Aprobar/rechazar registro | Sí |

### Dashboard

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/dashboard/resumen` | KPIs generales | Sí |
| `GET` | `/api/dashboard/actividades` | Actividades por estado | Sí |
| `GET` | `/api/dashboard/turnos` | Horas por turno | Sí |
| `GET` | `/api/dashboard/recientes` | Registros recientes | Sí |
| `GET` | `/api/dashboard/horas` | Horas por usuario | Sí |
| `GET` | `/api/dashboard/aprobaciones` | Resumen de aprobaciones | Sí |

### Reportes

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/reportes` | Listar reportes | Sí |
| `POST` | `/api/reportes/generar` | Generar reporte en tiempo real | Sí |

### Notificaciones

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/notificaciones/usuario/:id` | Notificaciones de un usuario | Sí |
| `GET` | `/api/notificaciones/no-leidas/:id` | Conteo de no leídas | Sí |
| `POST` | `/api/notificaciones` | Crear notificación | Sí |
| `PUT` | `/api/notificaciones/leer/:id` | Marcar como leída | Sí |
| `PUT` | `/api/notificaciones/leer-todas/:id` | Marcar todas como leídas | Sí |

### Auditoría

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/historial` | Listar historial | Sí |
| `POST` | `/api/historial` | Registrar acción | Sí |

### Contacto

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/contacto` | Enviar email de contacto | No |

---

## Rutas del Frontend

### Páginas Públicas (no requieren sesión)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Login | Inicio de sesión |
| `/register` | Registro | Creación de cuenta nueva |
| `/landing` | Landing | Página de presentación del sistema |
| `/caracteristicas` | Características | Descripción de los módulos |
| `/precios` | Precios | Planes y tarifas |
| `/soporte` | Soporte | Centro de ayuda y FAQ |
| `/contacto` | Contacto | Formulario de soporte |

### Páginas Protegidas (requieren sesión)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/inicio` | Inicio | Panel principal con actividad reciente |
| `/dashboard` | Dashboard | Resumen ejecutivo con KPIs |
| `/usuarios` | Usuarios | Gestión de empleados |
| `/actividades` | Actividades | Gestión de tareas asignadas |
| `/jornada` | Turnos | Registro de entrada y salida |
| `/aprobaciones` | Aprobaciones | Revisión y aprobación de registros |
| `/reportes` | Reportes | Estadísticas e informes |
| `/notificaciones` | Notificaciones | Centro de alertas |
| `/auditoria` | Auditoría | Historial de acciones del sistema |
| `/configuracion` | Configuración | Perfil y ajustes del usuario |

---

## Roles y Permisos

| Rol | Descripción | Acciones |
|-----|------------|----------|
| **Administrador** | Control total del sistema | Crear, editar y eliminar usuarios, sedes, turnos, actividades. Aprobar registros. Ver reportes y auditoría completa. |
| **Supervisor** | Supervisión de equipo | Aprobar/rechazar registros. Asignar actividades. Ver reportes de su equipo. |
| **Operario** | Empleado estándar | Registrar entrada/salida. Ver sus actividades y notificaciones. Actualizar su perfil. |

---

## Flujo del Sistema

1. El **Empleado** inicia sesión y va a **Jornada**
2. Registra su **hora de entrada** (asociada a un turno)
3. Durante el turno, visualiza sus **actividades asignadas**
4. Al finalizar, registra su **hora de salida**
5. El sistema **calcula automáticamente** las horas trabajadas
6. El **Supervisor** revisa los registros en **Aprobaciones**
7. **Aprueba o rechaza** cada registro con un comentario
8. El **Administrador** revisa **Dashboard** y **Reportes** para tomar decisiones
9. Todas las quedar registradas en **Auditoría**

---

## Próximos Pasos

- [ ] Conectar variables de entorno en Railway (`VITE_API_URL`)
- [ ] Configurar envío de emails con Nodemailer (Gmail SMTP)
- [ ] Agregar paginación y búsqueda avanzada
- [ ] Implementar exportación de reportes a PDF/Excel
- [ ] Agregar filtros por fecha en reportes
- [ ] Notificaciones en tiempo real (WebSocket)
- [ ] Modo oscuro / personalización de temas

---

**Autor:** Papasito
**Versión:** 2.0
**Proyecto SENA** — Gestor de Tiempos para Microempresas
