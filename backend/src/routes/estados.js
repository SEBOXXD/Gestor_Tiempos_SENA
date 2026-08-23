/**
 * ====================================================================
 * ARCHIVO: estados.js
 * ====================================================================
 * Rutas CRUD para la gestión de estados de actividad.
 *
 * Los estados definen en qué fase se encuentra una actividad o
 * registro de hora. Estados predefinidos en la base de datos:
 *   1 → Pendiente
 *   2 → En Progreso
 *   3 → Completada
 *   4 → Cancelada
 *   5 → Aprobada
 *   6 → Rechazada
 *
 * Endpoints:
 *   GET    /api/estados      → Listar todos los estados
 *   GET    /api/estados/:id  → Obtener un estado por ID
 *   POST   /api/estados      → Crear un estado
 *   PUT    /api/estados/:id  → Actualizar un estado
 *   DELETE /api/estados/:id  → Eliminar un estado
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/estados
   * ------------------------------------------------------------------
   * Retorna todos los estados de actividad registrados.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM estado_actividad');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/estados/:id
   * ------------------------------------------------------------------
   * Retorna un estado específico por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM estado_actividad WHERE id_estado = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/estados
   * ------------------------------------------------------------------
   * Crea un nuevo estado de actividad.
   *
   * Body esperado: { "nombre_estado": "En Revisión" }
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { nombre_estado } = req.body;
      const [result] = await pool.query(
        'INSERT INTO estado_actividad (nombre_estado) VALUES (?)',
        [nombre_estado]
      );
      res.status(201).json({ id: result.insertId, nombre_estado });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/estados/:id
   * ------------------------------------------------------------------
   * Actualiza el nombre de un estado existente.
   *
   * Body esperado: { "nombre_estado": "Nuevo Nombre" }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { nombre_estado } = req.body;
      const [result] = await pool.query(
        'UPDATE estado_actividad SET nombre_estado = ? WHERE id_estado = ?',
        [nombre_estado, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json({ message: 'Estado actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/estados/:id
   * ------------------------------------------------------------------
   * Elimina un estado por su ID.
   * Nota: Fallará si hay actividades o registros asociados.
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM estado_actividad WHERE id_estado = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json({ message: 'Estado eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
