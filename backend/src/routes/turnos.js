/**
 * ====================================================================
 * ARCHIVO: turnos.js
 * ====================================================================
 * Rutas CRUD para la gestión de turnos laborales.
 *
 * Un turno define el horario programado de trabajo. Ejemplos:
 *   - Mañana:  07:00 - 15:00 (8 horas)
 *   - Tarde:   14:00 - 22:00 (8 horas)
 *   - Noche:   22:00 - 06:00 (8 horas)
 *
 * Endpoints:
 *   GET    /api/turnos      → Listar todos los turnos
 *   GET    /api/turnos/:id  → Obtener un turno por ID
 *   POST   /api/turnos      → Crear un turno
 *   PUT    /api/turnos/:id  → Actualizar un turno
 *   DELETE /api/turnos/:id  → Eliminar un turno
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/turnos
   * ------------------------------------------------------------------
   * Retorna todos los turnos registrados.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM turno');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/turnos/:id
   * ------------------------------------------------------------------
   * Retorna un turno específico por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM turno WHERE id_turno = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/turnos
   * ------------------------------------------------------------------
   * Crea un nuevo turno laboral.
   *
   * Body esperado:
   *   {
   *     "nombre_turno": "Mañana",
   *     "hora_inicio_programada": "07:00:00",
   *     "hora_fin_programada": "15:00:00",
   *     "horas_jornada": 8.00
   *   }
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada } = req.body;
      const [result] = await pool.query(
        'INSERT INTO turno (nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada) VALUES (?, ?, ?, ?)',
        [nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada]
      );
      res.status(201).json({
        id: result.insertId, nombre_turno, hora_inicio_programada,
        hora_fin_programada, horas_jornada
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/turnos/:id
   * ------------------------------------------------------------------
   * Actualiza un turno existente (update completo).
   *
   * Body esperado (todos los campos requeridos):
   *   {
   *     "nombre_turno": "Mañana",
   *     "hora_inicio_programada": "06:00:00",
   *     "hora_fin_programada": "14:00:00",
   *     "horas_jornada": 8.00
   *   }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada } = req.body;
      const [result] = await pool.query(
        'UPDATE turno SET nombre_turno = ?, hora_inicio_programada = ?, hora_fin_programada = ?, horas_jornada = ? WHERE id_turno = ?',
        [nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json({ message: 'Turno actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/turnos/:id
   * ------------------------------------------------------------------
   * Elimina un turno por su ID.
   * Nota: Fallará si hay registros de hora asociados a este turno.
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM turno WHERE id_turno = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json({ message: 'Turno eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
