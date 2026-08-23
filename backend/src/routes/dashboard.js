/**
 * ====================================================================
 * ARCHIVO: dashboard.js
 * ====================================================================
 * Rutas del panel de control (dashboard).
 *
 * Este archivo expone endpoints que devuelven KPIs y resúmenes
 * necesarios para las gráficas y tarjetas del Dashboard en el frontend.
 *
 * Endpoints:
 *   GET /api/dashboard/resumen      → Totales generales
 *   GET /api/dashboard/actividades  → Conteo de actividades por estado
 *   GET /api/dashboard/turnos       → Horas trabajadas por turno
 *   GET /api/dashboard/recientes    → Últimas 10 actividades creadas
 *   GET /api/dashboard/horas        → Horas trabajadas por usuario
 *   GET /api/dashboard/aprobaciones → Resumen de aprobaciones
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/dashboard/resumen
   * ------------------------------------------------------------------
   * Devuelve totales generales del sistema:
   *   - total_usuarios
   *   - total_actividades
   *   - total_registros
   *   - total_aprobaciones
   *   - horas_totales_trabajadas
   *   - usuarios_activos
   * ------------------------------------------------------------------
   */
  router.get('/resumen', async (req, res) => {
    try {
      // Ejecutamos las 6 consultas en paralelo para máxima eficiencia
      const [
        [usuarios],
        [actividades],
        [registros],
        [aprobaciones],
        [horas],
        [activos]
      ] = await Promise.all([
        pool.query('SELECT COUNT(*) AS total FROM usuario'),
        pool.query('SELECT COUNT(*) AS total FROM actividad'),
        pool.query('SELECT COUNT(*) AS total FROM registro_hora'),
        pool.query('SELECT COUNT(*) AS total FROM aprobacion'),
        pool.query('SELECT COALESCE(SUM(total_horas), 0) AS total FROM registro_hora'),
        pool.query('SELECT COUNT(*) AS total FROM usuario WHERE estado_usuario = 1')
      ]);

      res.json({
        total_usuarios: usuarios[0].total,
        total_actividades: actividades[0].total,
        total_registros: registros[0].total,
        total_aprobaciones: aprobaciones[0].total,
        horas_totales: parseFloat(horas[0].total),
        usuarios_activos: activos[0].total
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/dashboard/actividades
   * ------------------------------------------------------------------
   * Retorna el número de actividades agrupadas por estado.
   * Útil para gráficas de torta/barras en el dashboard.
   * Ejemplo de respuesta:
   *   [
   *     { nombre_estado: "Pendiente", cantidad: 5 },
   *     { nombre_estado: "En Progreso", cantidad: 3 },
   *     ...
   *   ]
   * ------------------------------------------------------------------
   */
  router.get('/actividades', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT e.nombre_estado, COUNT(a.id_actividad) AS cantidad
         FROM estado_actividad e
         LEFT JOIN actividad a ON e.id_estado = a.id_estado
         GROUP BY e.id_estado, e.nombre_estado
         ORDER BY cantidad DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/dashboard/turnos
   * ------------------------------------------------------------------
   * Retorna las horas totales trabajadas agrupadas por turno.
   * Útil para gráficas de distribución de jornada laboral.
   * Ejemplo de respuesta:
   *   [
   *     { nombre_turno: "Manana", total_horas: 120.50, registros: 15 },
   *     ...
   *   ]
   * ------------------------------------------------------------------
   */
  router.get('/turnos', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT t.nombre_turno,
                COALESCE(SUM(r.total_horas), 0) AS total_horas,
                COUNT(r.id_registro) AS registros
         FROM turno t
         LEFT JOIN registro_hora r ON t.id_turno = r.id_turno
         GROUP BY t.id_turno, t.nombre_turno
         ORDER BY total_horas DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/dashboard/recientes
   * ------------------------------------------------------------------
   * Retorna las 10 actividades más recientes con su estado y usuario.
   * Se usa para mostrar actividad reciente en el dashboard.
   * ------------------------------------------------------------------
   */
  router.get('/recientes', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.id_actividad, a.nombre, a.fecha_creacion, a.fecha_limite,
                e.nombre_estado, u.nombre AS usuario
         FROM actividad a
         JOIN estado_actividad e ON a.id_estado = e.id_estado
         JOIN usuario u ON a.id_usuario = u.id_usuario
         ORDER BY a.fecha_creacion DESC
         LIMIT 10`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/dashboard/horas
   * ------------------------------------------------------------------
   * Retorna las horas trabajadas por cada usuario.
   * Útil para gráficas de rendimiento individual.
   * Ejemplo de respuesta:
   *   [
   *     { nombre: "Juan Perez", total_horas: 40.5, registros: 5 },
   *     ...
   *   ]
   * ------------------------------------------------------------------
   */
  router.get('/horas', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT u.nombre,
                COALESCE(SUM(r.total_horas), 0) AS total_horas,
                COUNT(r.id_registro) AS registros
         FROM usuario u
         LEFT JOIN registro_hora r ON u.id_usuario = r.id_usuario
         GROUP BY u.id_usuario, u.nombre
         ORDER BY total_horas DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/dashboard/aprobaciones
   * ------------------------------------------------------------------
   * Retorna el conteo de aprobaciones agrupadas por resultado
   * (Aprobado / Rechazado / Pendiente).
   * Útil para indicadores de eficiencia del proceso de aprobación.
   * ------------------------------------------------------------------
   */
  router.get('/aprobaciones', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT resultado, COUNT(*) AS cantidad
         FROM aprobacion
         GROUP BY resultado`
      );

      // Consultamos también los registros que aún no tienen aprobación
      const [pendientes] = await pool.query(
        `SELECT COUNT(*) AS cantidad FROM registro_hora WHERE id_estado = 1`
      );

      res.json({
        por_resultado: rows,
        pendientes_aprobacion: pendientes[0].cantidad
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
