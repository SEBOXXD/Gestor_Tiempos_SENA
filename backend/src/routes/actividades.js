/**
 * ====================================================================
 * ARCHIVO: actividades.js
 * ====================================================================
 * Rutas CRUD para la gestión de actividades del sistema.
 *
 * Una actividad representa una tarea asignada a un usuario dentro
 * de una sede. Cada actividad tiene un estado (Pendiente, En Progreso,
 * Completada, Aprobada, Cancelada, Rechazada), una fecha límite y
 * un tiempo estimado de duración.
 *
 * Las consultas incluyen JOIN con las tablas 'estado_actividad',
 * 'usuario' y 'sede' para devolver información completa.
 *
 * Endpoints:
 *   GET    /api/actividades                  → Listar todas
 *   GET    /api/actividades/:id              → Obtener una por ID
 *   GET    /api/actividades/usuario/:id      → Actividades de un usuario
 *   POST   /api/actividades                  → Crear una actividad
 *   PUT    /api/actividades/:id              → Actualizar (parcial)
 *   DELETE /api/actividades/:id              → Eliminar una actividad
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/actividades
   * ------------------------------------------------------------------
   * Retorna todas las actividades con estado, usuario y sede.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, e.nombre_estado, u.nombre AS usuario, s.nombre AS sede
         FROM actividad a
         JOIN estado_actividad e ON a.id_estado = e.id_estado
         JOIN usuario u ON a.id_usuario = u.id_usuario
         JOIN sede s ON a.id_sede = s.id_sede`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/actividades/:id
   * ------------------------------------------------------------------
   * Retorna una actividad específica por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, e.nombre_estado, u.nombre AS usuario, s.nombre AS sede
         FROM actividad a
         JOIN estado_actividad e ON a.id_estado = e.id_estado
         JOIN usuario u ON a.id_usuario = u.id_usuario
         JOIN sede s ON a.id_sede = s.id_sede
         WHERE a.id_actividad = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Actividad no encontrada' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/actividades/usuario/:id_usuario
   * ------------------------------------------------------------------
   * Retorna todas las actividades asignadas a un usuario específico.
   * Útil para mostrar las tareas de un operario en particular.
   * ------------------------------------------------------------------
   */
  router.get('/usuario/:id_usuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, e.nombre_estado
         FROM actividad a
         JOIN estado_actividad e ON a.id_estado = e.id_estado
         WHERE a.id_usuario = ?`,
        [req.params.id_usuario]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/actividades
   * ------------------------------------------------------------------
   * Crea una nueva actividad.
   *
   * Body esperado:
   *   {
   *     "nombre": "Instalar cableado",
   *     "descripcion": "Cableado estructurado piso 3",
   *     "fecha_limite": "2026-08-30",
   *     "tiempo_estimado": 16.5,
   *     "id_estado": 1,
   *     "id_usuario": 1,
   *     "id_sede": 1
   *   }
   *
   * Nota: fecha_creacion se asigna automáticamente con CURRENT_TIMESTAMP.
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede } = req.body;
      const [result] = await pool.query(
        'INSERT INTO actividad (nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede]
      );
      res.status(201).json({
        id: result.insertId, nombre, descripcion, fecha_limite,
        tiempo_estimado, id_estado, id_usuario, id_sede
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/actividades/:id
   * ------------------------------------------------------------------
   * Actualiza una actividad existente (parcial update).
   * Solo se actualizan los campos enviados en el body.
   *
   * Body esperado (campos opcionales):
   *   {
   *     "nombre": "Nuevo nombre",
   *     "id_estado": 2,
   *     "tiempo_estimado": 20.0
   *   }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede } = req.body;

      // Construir la consulta dinámicamente solo con los campos enviados
      const fields = [];
      const values = [];

      if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
      if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
      if (fecha_limite !== undefined) { fields.push('fecha_limite = ?'); values.push(fecha_limite); }
      if (tiempo_estimado !== undefined) { fields.push('tiempo_estimado = ?'); values.push(tiempo_estimado); }
      if (id_estado !== undefined) { fields.push('id_estado = ?'); values.push(id_estado); }
      if (id_usuario !== undefined) { fields.push('id_usuario = ?'); values.push(id_usuario); }
      if (id_sede !== undefined) { fields.push('id_sede = ?'); values.push(id_sede); }

      if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

      values.push(req.params.id);
      const [result] = await pool.query(
        `UPDATE actividad SET ${fields.join(', ')} WHERE id_actividad = ?`,
        values
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Actividad no encontrada' });
      res.json({ message: 'Actividad actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/actividades/:id
   * ------------------------------------------------------------------
   * Elimina una actividad por su ID.
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM actividad WHERE id_actividad = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Actividad no encontrada' });
      res.json({ message: 'Actividad eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
