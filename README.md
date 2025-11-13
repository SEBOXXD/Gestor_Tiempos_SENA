# Proyecto: Sistema de Registro de Turnos para Microempresas

## Descripción General

Este proyecto consiste en el desarrollo de un software dirigido a **microempresas y negocios pequeños**, con el objetivo de **gestionar los turnos de trabajo** de sus empleados. La herramienta permitirá registrar entradas y salidas, asignar actividades, aprobar registros y mantener control de asistencia, adaptándose a estructuras organizativas simples pero funcionales.

El sistema busca optimizar la gestión de horarios, ofrecer transparencia en las horas trabajadas y facilitar la supervisión de turnos.

---

## Objetivos del Proyecto

* Permitir el **registro de entrada y salida** de los empleados de manera digital.
* Implementar un flujo de **aprobación de registros** por parte de los supervisores.
* Gestionar la información relacionada con **sedes, horarios, usuarios y actividades**.
* Facilitar la **evaluación y control de asistencia** en cada sede.
* Mejorar la **eficiencia administrativa** de pequeñas empresas sin necesidad de herramientas complejas.

---

## Alcance del Proyecto

El sistema estará compuesto por los siguientes módulos:

1. **Gestor de Sedes:** Definición de las sedes o puntos de trabajo.
2. **Gestor de Horarios:** Creación de turnos, jornadas laborales y franjas horarias.
3. **Gestor de Usuarios:** Registro de empleados, supervisores y administradores.
4. **Registro de Entrada y Salida:** Registro digital de horas con aprobación.
5. **Módulo de Actividades:** Registro de tareas realizadas durante el turno. (Los Supervisores o Administradores podrán asignar las tareas a cada empleado, y el empleado, al registrar el turno, podrá agregar actividades adicionales que le hayan asignado durante dicho turno)
6. **Módulo de Aprobaciones:** Validación de registros por supervisores.
7. **Módulo de Evaluación:** Reportes de asistencia y cumplimiento.

---

## Clasificación de Procesos

| Tipo de Proceso              | Procesos Asociados                                                          |
| ---------------------------- | --------------------------------------------------------------------------- |
| **Estratégicos**             | Planificación de horarios, asignación de roles, análisis de productividad   |
| **Misionales (Principales)** | Registro de entrada y salida, registro de actividades, aprobación de turnos |
| **De Apoyo**                 | Gestión de usuarios, mantenimiento del sistema, soporte técnico             |
| **De Evaluación o Control**  | Generación de reportes, verificación de registros, auditorías de asistencia |

---

## Descripción del Proceso Principal: Registro de Entrada y Salida

### Objetivo

Registrar de forma precisa la **hora de entrada y salida** de cada empleado, asociando sus actividades diarias y garantizando su validación por parte del supervisor.

### Participantes

* **Empleado:** Realiza el registro de entrada, actividades y salida.
* **Sistema:** Valida horarios y almacena los datos.
* **Supervisor:** Revisa y aprueba los registros enviados.

### Flujo BPMN del Proceso

1. El **empleado** inicia sesión en el sistema.
2. Se **validan las credenciales**.
3. Selecciona **sede y turno asignado**.
4. Registra la **hora de entrada**.
5. Durante el turno, **registra actividades**.
6. Al finalizar, registra la **hora de salida**.
7. El sistema **envía el registro al supervisor**.
8. El supervisor **aprueba o rechaza** el registro.
9. El sistema **actualiza el estado** (Aprobado/Rechazado).
10. Se **genera un resumen** de horas trabajadas y actividades.

---

## Entradas, Salidas y Reglas del Proceso

| Elemento              | Descripción                                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Entradas**          | Datos del empleado, horario asignado, sede, hora de entrada, hora de salida, actividades realizadas                                                                                                                                                                       |
| **Salidas**           | Registro validado, resumen de jornada, estado de aprobación                                                                                                                                                                                                               |
| **Reglas de Negocio** | 1. Solo se puede registrar entrada si el turno está activo. <br> 2. Cada registro debe ser aprobado por un supervisor. <br> 3. Los registros pueden ser modificados antes de ser enviados. <br> 4. Los reportes se generan automáticamente según el estado de aprobación. |

---

## Tecnologías Propuestas

* **Backend:** Node.js / Express.js
* **Base de Datos:** MySQL / phpMyAdmin
* **Frontend:** HTML, CSS, JavaScript, EJS (para vistas dinámicas)
* **Integraciones:** Correo electrónico para notificaciones de aprobación

---

## Diagrama BPMN (Resumen)

El proceso BPMN incluye los siguientes actores y pasos principales:

* **Empleado:** Inicia sesión, selecciona sede, registra entrada/salida, registra actividades.
* **Sistema:** Valida horarios, almacena registros, genera reportes.
* **Supervisor:** Revisa y aprueba o rechaza registros.

El flujo garantiza trazabilidad y control sobre cada acción realizada dentro del sistema.

---

## Indicadores Clave (KPIs)

* Porcentaje de registros aprobados vs rechazados.
* Tiempo promedio de aprobación por supervisor.
* Porcentaje de asistencia por sede.
* Promedio de horas trabajadas por empleado.

---

## Beneficios Esperados

* Reducción de errores manuales en los registros.
* Mayor transparencia y control de asistencia.
* Aumento en la eficiencia administrativa.
* Trazabilidad completa de cada registro.
* Informes claros para la toma de decisiones.

---

## Próximos Pasos

1. Diseñar las tablas base de datos (Usuarios, Turnos, Actividades, Aprobaciones, Sedes, Registros).
2. Crear prototipo de interfaz para el registro de horarios.
3. Implementar el flujo de aprobación.
4. Generar reportes automáticos y panel de control.

---

**Autor:** Papasito
**Versión:** 1.0
**Propósito:** Documento base para la planificación y desarrollo del Sistema de Registro de Turnos.

---
#Adicionales
1. Modulo de Gestor de Recursos: El módulo de Gestión de Recursos en tu proyecto tiene la función de administrar y controlar los recursos (humanos, materiales y temporales) que se utilizan en las actividades o tareas asignadas dentro del sistema.
Supón que hay una actividad llamada “Revisión de inventario en Sede A”.
El coordinador la crea y asigna los siguientes recursos:

Humano: María López.

Material: Tablet Samsung.

Tiempo: 2 horas estimadas.

El sistema:

Marca la tablet como “En uso” durante el rango asignado.

Guarda el registro en el historial de uso del recurso.

Una vez finalizada la actividad, cambia su estado a “Disponible” y calcula el tiempo real utilizado.
