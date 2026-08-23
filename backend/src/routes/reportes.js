/**
 * ====================================================================
 * ARCHIVO: reportes.js
 * ====================================================================
 * Rutas para la gestión de reportes del sistema.
 *
 * Un reporte es un registro de que se generó un tipo de informe
 * en una fecha específica, asociado a un usuario.
 *
 * Tipos de reporte soportados:
 *   - "horas_trabajadas"   → Resumen de horas por usuario/rango
 *   - "actividades"        → Listado de actividades por estado
 *   - "aprobaciones"       → Historial de aprobaciones
 *   - "asistencia"         → Registro de asistencia diaria
 *
 * Endpoints:
 *   GET    /api/reportes              → Listar todos los reportes
 *   GET    /api/reportes/:id          → Obtener un reporte
 *   GET    /api/reportes/usuario/:id  → Reportes de un usuario
 *   POST   /api/reportes              → Crear/registrar un reporte
 *   DELETE /api/reportes/:id          → Eliminar un reporte
 *
 * Endpoint especial:
 *   POST /api/reportes/generar        → Genera datos de reporte en vivo
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/reportes
   * ------------------------------------------------------------------
   * Lista todos los reportes registrados, con el nombre del usuario
   * que los generó ordenados por fecha de generación descendente.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.id_reporte, r.tipo, r.fecha_generacion,
                u.nombre AS usuario, u.correo
         FROM reporte r
         JOIN usuario u ON r.id_usuario = u.id_usuario
         ORDER BY r.fecha_generacion DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/reportes/usuario/:id_usuario
   * ------------------------------------------------------------------
   * Retorna solo los reportes generados por un usuario específico.
   * Útil para ver el historial de reportes de un operario o supervisor.
   * ------------------------------------------------------------------
   */
  router.get('/usuario/:id_usuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.id_reporte, r.tipo, r.fecha_generacion
         FROM reporte r
         WHERE r.id_usuario = ?
         ORDER BY r.fecha_generacion DESC`,
        [req.params.id_usuario]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/reportes/:id
   * ------------------------------------------------------------------
   * Retorna un reporte específico por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.id_reporte, r.tipo, r.fecha_generacion,
                u.nombre AS usuario, u.correo
         FROM reporte r
         JOIN usuario u ON r.id_usuario = u.id_usuario
         WHERE r.id_reporte = ?`,
        [req.params.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/reportes
   * ------------------------------------------------------------------
   * Registra un nuevo reporte en la base de datos.
   *
   * Body esperado:
   *   {
   *     "tipo": "horas_trabajadas",  // tipo de reporte
   *     "id_usuario": 1              // usuario que genera el reporte
   *   }
   *
   * La fecha_generacion se asigna automáticamente con CURRENT_TIMESTAMP.
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { tipo, id_usuario } = req.body;

      const [result] = await pool.query(
        'INSERT INTO reporte (tipo, id_usuario) VALUES (?, ?)',
        [tipo, id_usuario]
      );

      res.status(201).json({
        id: result.insertId,
        tipo,
        id_usuario,
        mensaje: 'Reporte registrado exitosamente'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/reportes/generar
   * ------------------------------------------------------------------
   * Genera los datos de un reporte en tiempo real SIN guardar en la
   * tabla reporte. El frontend usa este endpoint para previsualizar
   * o descargar un reporte antes de registrarlo.
   *
   * Body esperado:
   *   {
   *     "tipo": "horas_trabajadas",
   *     "id_usuario": 1,          // opcional: filtrar por usuario
   *     "fecha_inicio": "2026-08-01",  // opcional: filtro rango
   *     "fecha_fin": "2026-08-31"      // opcional: filtro rango
   *   }
   *
   * Tipos soportados y su lógica:
   *   - horas_trabajadas: Suma total_horas agrupado por usuario
   *   - actividades:     Listado de actividades con estado y usuario
   *   - aprobaciones:    Historial completo de aprobaciones
   *   - asistencia:      Registros de entrada/salida por usuario
   * ------------------------------------------------------------------
   */
  router.post('/generar', async (req, res) => {
    try {
      const { tipo, id_usuario, fecha_inicio, fecha_fin } = req.body;

      let datos = [];

      switch (tipo) {

        /**
         * REPORTE: Horas Trabajadas
         * Agrupa las horas totales por usuario, filtrando opcionalmente
         * por rango de fechas.
         */
        case 'horas_trabajadas':
          let queryHoras = `
            SELECT u.nombre, u.correo,
                   COALESCE(SUM(r.total_horas), 0) AS total_horas,
                   COUNT(r.id_registro) AS registros
            FROM usuario u
            LEFT JOIN registro_hora r ON u.id_usuario = r.id_usuario`;
          const paramsHoras = [];
          const conditionsHoras = [];

          if (id_usuario) {
            conditionsHoras.push('u.id_usuario = ?');
            paramsHoras.push(id_usuario);
          }
          if (fecha_inicio) {
            conditionsHoras.push('r.fecha >= ?');
            paramsHoras.push(fecha_inicio);
          }
          if (fecha_fin) {
            conditionsHoras.push('r.fecha <= ?');
            paramsHoras.push(fecha_fin);
          }
          if (conditionsHoras.length > 0) {
            queryHoras += ' WHERE ' + conditionsHoras.join(' AND ');
          }
          queryHoras += ' GROUP BY u.id_usuario, u.nombre, u.correo ORDER BY total_horas DESC';

          [datos] = await pool.query(queryHoras, paramsHoras);
          break;

        /**
         * REPORTE: Actividades
         * Retorna todas las actividades con estado, usuario y sede.
         */
        case 'actividades':
          let queryAct = `
            SELECT a.nombre, a.descripcion, a.fecha_limite, a.tiempo_estimado,
                   e.nombre_estado, u.nombre AS usuario, s.nombre AS sede
            FROM actividad a
            JOIN estado_actividad e ON a.id_estado = e.id_estado
            JOIN usuario u ON a.id_usuario = u.id_usuario
            JOIN sede s ON a.id_sede = s.id_sede`;
          const paramsAct = [];
          const conditionsAct = [];

          if (id_usuario) {
            conditionsAct.push('a.id_usuario = ?');
            paramsAct.push(id_usuario);
          }
          if (conditionsAct.length > 0) {
            queryAct += ' WHERE ' + conditionsAct.join(' AND ');
          }
          queryAct += ' ORDER BY a.fecha_creacion DESC';

          [datos] = await pool.query(queryAct, paramsAct);
          break;

        /**
         * REPORTE: Aprobaciones
         * Retorna el historial completo de aprobaciones con datos
         * del supervisor y del empleado.
         */
        case 'aprobaciones':
          let queryAprob = `
            SELECT a.fecha_aprobacion, a.nivel_aprobacion, a.resultado, a.observaciones,
                   sup.nombre AS supervisor, emp.nombre AS empleado,
                   r.fecha, r.hora_entrada, r.hora_salida, r.total_horas
            FROM aprobacion a
            JOIN usuario sup ON a.id_supervisor = sup.id_usuario
            JOIN registro_hora r ON a.id_registro = r.id_registro
            JOIN usuario emp ON r.id_usuario = emp.id_usuario`;
          const paramsAprob = [];
          const conditionsAprob = [];

          if (fecha_inicio) {
            conditionsAprob.push('a.fecha_aprobacion >= ?');
            paramsAprob.push(fecha_inicio);
          }
          if (fecha_fin) {
            conditionsAprob.push('a.fecha_aprobacion <= ?');
            paramsAprob.push(fecha_fin);
          }
          if (conditionsAprob.length > 0) {
            queryAprob += ' WHERE ' + conditionsAprob.join(' AND ');
          }
          queryAprob += ' ORDER BY a.fecha_aprobacion DESC';

          [datos] = await pool.query(queryAprob, paramsAprob);
          break;

        /**
         * REPORTE: Asistencia
         * Retorna registros de entrada/salida por usuario.
         */
        case 'asistencia':
          let queryAsist = `
            SELECT u.nombre, r.fecha, r.hora_entrada, r.hora_salida,
                   r.total_horas, e.nombre_estado, t.nombre_turno
            FROM registro_hora r
            JOIN usuario u ON r.id_usuario = u.id_usuario
            JOIN estado_actividad e ON r.id_estado = e.id_estado
            JOIN turno t ON r.id_turno = t.id_turno`;
          const paramsAsist = [];
          const conditionsAsist = [];

          if (id_usuario) {
            conditionsAsist.push('r.id_usuario = ?');
            paramsAsist.push(id_usuario);
          }
          if (fecha_inicio) {
            conditionsAsist.push('r.fecha >= ?');
            paramsAsist.push(fecha_inicio);
          }
          if (fecha_fin) {
            conditionsAsist.push('r.fecha <= ?');
            paramsAsist.push(fecha_fin);
          }
          if (conditionsAsist.length > 0) {
            queryAsist += ' WHERE ' + conditionsAsist.join(' AND ');
          }
          queryAsist += ' ORDER BY r.fecha DESC, r.hora_entrada DESC';

          [datos] = await pool.query(queryAsist, paramsAsist);
          break;

        default:
          return res.status(400).json({
            error: 'Tipo de reporte no válido. Use: horas_trabajadas, actividades, aprobaciones, asistencia'
          });
      }

      res.json({
        tipo,
        total_registros: datos.length,
        generado_en: new Date().toISOString(),
        datos
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/reportes/:id
   * ------------------------------------------------------------------
   * Elimina un reporte registrado por su ID.
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM reporte WHERE id_reporte = ?',
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
      }
      res.json({ message: 'Reporte eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
