/**
 * ====================================================================
 * ARCHIVO: sedes.js
 * ====================================================================
 * Rutas CRUD para la gestión de sedes del sistema.
 *
 * Una sede representa una ubicación física donde trabajan los
 * operarios. Cada sede tiene un nombre, ubicación y teléfono.
 *
 * Endpoints:
 *   GET    /api/sedes      → Listar todas las sedes
 *   GET    /api/sedes/:id  → Obtener una sede por ID
 *   POST   /api/sedes      → Crear una sede
 *   PUT    /api/sedes/:id  → Actualizar una sede
 *   DELETE /api/sedes/:id  → Eliminar una sede
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/sedes
   * ------------------------------------------------------------------
   * Retorna todas las sedes registradas en el sistema.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM sede');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/sedes/:id
   * ------------------------------------------------------------------
   * Retorna una sede específica por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM sede WHERE id_sede = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Sede no encontrada' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/sedes
   * ------------------------------------------------------------------
   * Crea una nueva sede.
   *
   * Body esperado:
   *   {
   *     "nombre": "Sede Principal",
   *     "ubicacion": "Calle 123 #45-67",
   *     "telefono": "3001234567"
   *   }
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { nombre, ubicacion, telefono } = req.body;
      const [result] = await pool.query(
        'INSERT INTO sede (nombre, ubicacion, telefono) VALUES (?, ?, ?)',
        [nombre, ubicacion, telefono]
      );
      res.status(201).json({ id: result.insertId, nombre, ubicacion, telefono });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/sedes/:id
   * ------------------------------------------------------------------
   * Actualiza una sede existente (update completo).
   *
   * Body esperado (todos los campos requeridos):
   *   {
   *     "nombre": "Sede Actualizada",
   *     "ubicacion": "Calle 456 #78-90",
   *     "telefono": "3009876543"
   *   }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { nombre, ubicacion, telefono } = req.body;
      const [result] = await pool.query(
        'UPDATE sede SET nombre = ?, ubicacion = ?, telefono = ? WHERE id_sede = ?',
        [nombre, ubicacion, telefono, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Sede no encontrada' });
      res.json({ message: 'Sede actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/sedes/:id
   * ------------------------------------------------------------------
   * Elimina una sede por su ID.
   * Nota: Fallará si hay usuarios o actividades asociadas
   * a esta sede (FK constraint con ON DELETE RESTRICT).
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM sede WHERE id_sede = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Sede no encontrada' });
      res.json({ message: 'Sede eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
