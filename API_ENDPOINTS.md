# Endpoints API — CHRONOS (Gestor de Tiempos SENA)

Pruebas con Bruno. Copiar cada request directamente.

**URL Base:** `http://localhost:3000`

---

## 1. AUTENTICACIÓN

### POST /api/auth/register
```
Nombre: Registrar Usuario
Método: POST
URL: http://localhost:3000/api/auth/register
Headers: Content-Type: application/json

Body:
{
  "nombre": "Juan Perez",
  "correo": "juan@test.com",
  "contrasena": "123456"
}
```
Respuesta 201:
```json
{ "id": 1, "nombre": "Juan Perez", "correo": "juan@test.com", "token": "eyJ..." }
```

---

### POST /api/auth/login
```
Nombre: Login
Método: POST
URL: http://localhost:3000/api/auth/login
Headers: Content-Type: application/json

Body:
{
  "correo": "juan@test.com",
  "contrasena": "123456"
}
```
Respuesta 200:
```json
{ "id": 1, "nombre": "Juan Perez", "correo": "juan@test.com", "rol": "Operario", "sede": "Sede Principal", "token": "eyJ..." }
```

> **Nota:** Guardar el `token` de la respuesta. Usarlo en todos los endpoints protegidos como header: `Authorization: Bearer <token>`

---

## 2. SEDES

### GET /api/sedes
```
Nombre: Listar Sedes
Método: GET
URL: http://localhost:3000/api/sedes
Headers: Authorization: Bearer <token>
```

### POST /api/sedes
```
Nombre: Crear Sede
Método: POST
URL: http://localhost:3000/api/sedes
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre": "Sede Norte",
  "ubicacion": "Cali",
  "telefono": "6012345678"
}
```

### PUT /api/sedes/:id
```
Nombre: Actualizar Sede
Método: PUT
URL: http://localhost:3000/api/sedes/1
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre": "Sede Norte Actualizada",
  "ubicacion": "Cali",
  "telefono": "6019999999"
}
```

### DELETE /api/sedes/:id
```
Nombre: Eliminar Sede
Método: DELETE
URL: http://localhost:3000/api/sedes/1
Headers: Authorization: Bearer <token>
```

---

## 3. ROLES

### GET /api/roles
```
Nombre: Listar Roles
Método: GET
URL: http://localhost:3000/api/roles
Headers: Authorization: Bearer <token>
```
Respuesta:
```json
[
  { "id_rol": 1, "nombre_rol": "Administrador" },
  { "id_rol": 2, "nombre_rol": "Supervisor" },
  { "id_rol": 3, "nombre_rol": "Operario" }
]
```

---

## 4. USUARIOS

### GET /api/usuarios
```
Nombre: Listar Usuarios
Método: GET
URL: http://localhost:3000/api/usuarios
Headers: Authorization: Bearer <token>
```

### GET /api/usuarios/:id
```
Nombre: Obtener Usuario
Método: GET
URL: http://localhost:3000/api/usuarios/1
Headers: Authorization: Bearer <token>
```

### POST /api/usuarios
```
Nombre: Crear Usuario
Método: POST
URL: http://localhost:3000/api/usuarios
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre": "Maria Lopez",
  "correo": "maria@test.com",
  "contrasena": "123456",
  "id_rol": 3,
  "id_sede": 1
}
```

### PUT /api/usuarios/:id
```
Nombre: Actualizar Usuario
Método: PUT
URL: http://localhost:3000/api/usuarios/1
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre": "Maria Lopez Garcia",
  "correo": "maria@test.com",
  "id_rol": 2,
  "id_sede": 1
}
```

### PUT /api/usuarios/:id/password
```
Nombre: Cambiar Contraseña
Método: PUT
URL: http://localhost:3000/api/usuarios/1/password
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "contrasena": "nueva123"
}
```

### DELETE /api/usuarios/:id
```
Nombre: Eliminar Usuario
Método: DELETE
URL: http://localhost:3000/api/usuarios/3
Headers: Authorization: Bearer <token>
```

---

## 5. TURNOS

### GET /api/turnos
```
Nombre: Listar Turnos
Método: GET
URL: http://localhost:3000/api/turnos
Headers: Authorization: Bearer <token>
```

### POST /api/turnos
```
Nombre: Crear Turno
Método: POST
URL: http://localhost:3000/api/turnos
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre_turno": "Turno Mañana",
  "hora_inicio": "06:00:00",
  "hora_fin": "14:00:00"
}
```

### PUT /api/turnos/:id
```
Nombre: Actualizar Turno
Método: PUT
URL: http://localhost:3000/api/turnos/1
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre_turno": "Turno Mañana (editado)",
  "hora_inicio": "07:00:00",
  "hora_fin": "15:00:00"
}
```

### DELETE /api/turnos/:id
```
Nombre: Eliminar Turno
Método: DELETE
URL: http://localhost:3000/api/turnos/1
Headers: Authorization: Bearer <token>
```

---

## 6. ESTADOS DE ACTIVIDAD

### GET /api/estados
```
Nombre: Listar Estados
Método: GET
URL: http://localhost:3000/api/estados
Headers: Authorization: Bearer <token>
```

### POST /api/estados
```
Nombre: Crear Estado
Método: POST
URL: http://localhost:3000/api/estados
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre_estado": "En Revisión"
}
```

---

## 7. ACTIVIDADES

### GET /api/actividades
```
Nombre: Listar Actividades
Método: GET
URL: http://localhost:3000/api/actividades
Headers: Authorization: Bearer <token>
```

### GET /api/actividades/usuario/:id
```
Nombre: Actividades por Usuario
Método: GET
URL: http://localhost:3000/api/actividades/usuario/1
Headers: Authorization: Bearer <token>
```

### POST /api/actividades
```
Nombre: Crear Actividad
Método: POST
URL: http://localhost:3000/api/actividades
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre": "Revisión de inventario",
  "descripcion": "Contar productos del almacén",
  "id_usuario": 1,
  "id_estado": 1,
  "fecha_limite": "2026-08-30"
}
```

### PUT /api/actividades/:id
```
Nombre: Actualizar Actividad
Método: PUT
URL: http://localhost:3000/api/actividades/1
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "nombre": "Revisión de inventario (actualizada)",
  "descripcion": "Contar productos del almacén principal",
  "id_estado": 2
}
```

### DELETE /api/actividades/:id
```
Nombre: Eliminar Actividad
Método: DELETE
URL: http://localhost:3000/api/actividades/1
Headers: Authorization: Bearer <token>
```

---

## 8. REGISTRO DE JORNADA

### GET /api/registros
```
Nombre: Listar Registros
Método: GET
URL: http://localhost:3000/api/registros
Headers: Authorization: Bearer <token>
```

### GET /api/registros/usuario/:id
```
Nombre: Registros por Usuario
Método: GET
URL: http://localhost:3000/api/registros/usuario/1
Headers: Authorization: Bearer <token>
```

### POST /api/registros/entrada
```
Nombre: Registrar Entrada
Método: POST
URL: http://localhost:3000/api/registros/entrada
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "id_usuario": 1,
  "id_turno": 1
}
```
Respuesta 201:
```json
{
  "id_registro": 1,
  "id_usuario": 1,
  "id_turno": 1,
  "hora_entrada": "2026-08-25T08:00:00.000Z",
  "mensaje": "Entrada registrada exitosamente"
}
```

### PUT /api/registros/salida/:id
```
Nombre: Registrar Salida
Método: PUT
URL: http://localhost:3000/api/registros/salida/1
Headers: Authorization: Bearer <token>
```
Respuesta 200:
```json
{
  "id_registro": 1,
  "hora_salida": "2026-08-25T16:00:00.000Z",
  "total_horas": 8.00,
  "mensaje": "Salida registrada. Horas trabajadas: 8.00"
}
```

---

## 9. APROBACIONES

### GET /api/aprobaciones
```
Nombre: Listar Aprobaciones
Método: GET
URL: http://localhost:3000/api/aprobaciones
Headers: Authorization: Bearer <token>
```

### GET /api/aprobaciones/pendientes
```
Nombre: Aprobaciones Pendientes
Método: GET
URL: http://localhost:3000/api/aprobaciones/pendientes
Headers: Authorization: Bearer <token>
```

### POST /api/aprobaciones
```
Nombre: Aprobar Registro
Método: POST
URL: http://localhost:3000/api/aprobaciones
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body (Aprobar):
{
  "id_registro": 1,
  "id_supervisor": 2,
  "decision": "Aprobada",
  "comentario": "Registro correcto"
}

Body (Rechazar):
{
  "id_registro": 1,
  "id_supervisor": 2,
  "decision": "Rechazada",
  "comentario": "Horas no coinciden"
}
```

---

## 10. DASHBOARD

### GET /api/dashboard/resumen
```
Nombre: Resumen KPIs
Método: GET
URL: http://localhost:3000/api/dashboard/resumen
Headers: Authorization: Bearer <token>
```

### GET /api/dashboard/actividades
```
Nombre: Actividades por Estado
Método: GET
URL: http://localhost:3000/api/dashboard/actividades
Headers: Authorization: Bearer <token>
```

### GET /api/dashboard/turnos
```
Nombre: Horas por Turno
Método: GET
URL: http://localhost:3000/api/dashboard/turnos
Headers: Authorization: Bearer <token>
```

### GET /api/dashboard/recientes
```
Nombre: Registros Recientes
Método: GET
URL: http://localhost:3000/api/dashboard/recientes
Headers: Authorization: Bearer <token>
```

### GET /api/dashboard/horas
```
Nombre: Horas por Usuario
Método: GET
URL: http://localhost:3000/api/dashboard/horas
Headers: Authorization: Bearer <token>
```

### GET /api/dashboard/aprobaciones
```
Nombre: Resumen Aprobaciones
Método: GET
URL: http://localhost:3000/api/dashboard/aprobaciones
Headers: Authorization: Bearer <token>
```

---

## 11. REPORTES

### GET /api/reportes
```
Nombre: Listar Reportes
Método: GET
URL: http://localhost:3000/api/reportes
Headers: Authorization: Bearer <token>
```

### POST /api/reportes/generar
```
Nombre: Generar Reporte
Método: POST
URL: http://localhost:3000/api/reportes/generar
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "tipo": "horas_trabajadas"
}
```
Tipos válidos: `horas_trabajadas`, `actividades`, `aprobaciones`, `asistencia`

---

## 12. NOTIFICACIONES

### GET /api/notificaciones/usuario/:id
```
Nombre: Notificaciones por Usuario
Método: GET
URL: http://localhost:3000/api/notificaciones/usuario/1
Headers: Authorization: Bearer <token>
```

### GET /api/notificaciones/no-leidas/:id
```
Nombre: Conteo No Leídas
Método: GET
URL: http://localhost:3000/api/notificaciones/no-leidas/1
Headers: Authorization: Bearer <token>
```

### POST /api/notificaciones
```
Nombre: Crear Notificación
Método: POST
URL: http://localhost:3000/api/notificaciones
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "id_usuario": 1,
  "titulo": "Actividad asignada",
  "mensaje": "Se te asignó la actividad Revisión de inventario"
}
```

### PUT /api/notificaciones/leer/:id
```
Nombre: Marcar como Leída
Método: PUT
URL: http://localhost:3000/api/notificaciones/leer/1
Headers: Authorization: Bearer <token>
```

### PUT /api/notificaciones/leer-todas/:id
```
Nombre: Marcar Todas como Leídas
Método: PUT
URL: http://localhost:3000/api/notificaciones/leer-todas/1
Headers: Authorization: Bearer <token>
```

---

## 13. HISTORIAL (AUDITORÍA)

### GET /api/historial
```
Nombre: Listar Historial
Método: GET
URL: http://localhost:3000/api/historial
Headers: Authorization: Bearer <token>
```

### POST /api/historial
```
Nombre: Registrar Acción
Método: POST
URL: http://localhost:3000/api/historial
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "id_usuario": 1,
  "accion": "Creó la actividad Revisión de inventario"
}
```

---

## 14. CONTACTO

### POST /api/contacto
```
Nombre: Enviar Contacto
Método: POST
URL: http://localhost:3000/api/contacto
Headers: Content-Type: application/json

Body:
{
  "nombre": "Juan Perez",
  "correo": "juan@test.com",
  "asunto": "Soporte técnico",
  "mensaje": "Necesito ayuda con el módulo de reportes"
}
```
> **Nota:** Requiere `EMAIL_USER` y `EMAIL_PASS` configurados en el backend.

---

## ORDEN DE PRUEBA RECOMENDADO

1. Registrar usuario (POST /register)
2. Login (POST /login) → copiar token
3. Crear sede (POST /sedes)
4. Listar roles (GET /roles)
5. Crear turno (POST /turnos)
6. Crear actividad (POST /actividades)
7. Registrar entrada (POST /registros/entrada)
8. Registrar salida (PUT /registros/salida/:id)
9. Verificar dashboard (GET /dashboard/resumen)
10. Aprobar registro (POST /aprobaciones)
11. Verificar reportes (GET /dashboard/horas)
12. Verificar auditoría (GET /historial)
13. Crear notificación (POST /notificaciones)
14. Verificar notificaciones (GET /notificaciones/usuario/:id)
