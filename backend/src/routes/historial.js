/**
 * ====================================================================
 * ARCHIVO: historial.js
 * ====================================================================
 * Rutas CRUD para la auditoría del sistema (tabla historial).
 *
 * El historial registra todas las acciones importantes realizadas
 * por los usuarios: creaciones, actualizaciones, eliminaciones,
 * aprobaciones, etc. Cada registro incluye:
 *   - Una descripción de la acción realizada
 *   - La fecha y hora en que ocurrió
 *   - El usuario que ejecutó la acción
 *
 * Este módulo es fundamental para:
 *   - Rastrear quién hizo qué y cuándo
 *   - Investigar incidentes o cambios no autorizados
 *   - Cumplir con requisitos de auditoría
 *
 * Endpoints:
 *   GET    /api/historial              → Listar todo el historial
 *   GET    /api/historial/usuario/:id  → Historial de un usuario
 *   GET    /api/historial/:id          → Obtener un registro
 *   POST   /api/historial              → Registrar una acción
 *   DELETE /api/historial/:id          → Eliminar un registro
 *
 * NOTA: La ruta /usuario/:id se define ANTES de /:id para
 *       evitar conflictos con Express Router.
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/historial
   * ------------------------------------------------------------------
   * Retorna todos los registros de auditoría ordenados por fecha
   * descendente (más recientes primero). Incluye el nombre del
   * usuario que ejecutó la acción.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT h.*, u.nombre AS usuario
         FROM historial h
         JOIN usuario u ON h.id_usuario = u.id_usuario
         ORDER BY h.fecha DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/historial/usuario/:id_usuario
   * ------------------------------------------------------------------
   * Retorna solo las acciones realizadas por un usuario específico.
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id para que
   * Express no capture "usuario" como un parámetro dinámico.
   *
   * Respuesta ejemplo:
   *   [
   *     {
   *       id_historial: 1,
   *       accion: "Creó actividad: Instalar cableado",
   *       fecha: "2026-08-23T10:30:00.000Z",
   *       id_usuario: 1
   *     }
   *   ]
   * ------------------------------------------------------------------
   */
  router.get('/usuario/:id_usuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT h.*, u.nombre AS usuario
         FROM historial h
         JOIN usuario u ON h.id_usuario = u.id_usuario
         WHERE h.id_usuario = ?
         ORDER BY h.fecha DESC`,
        [req.params.id_usuario]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/historial/:id
   * ------------------------------------------------------------------
   * Retorna un registro de auditoría específico por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT h.*, u.nombre AS usuario
         FROM historial h
         JOIN usuario u ON h.id_usuario = u.id_usuario
         WHERE h.id_historial = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Registro de historial no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/historial
   * ------------------------------------------------------------------
   * Registra una nueva acción en el historial de auditoría.
   *
   * Body esperado:
   *   {
   *     "accion": "Creó actividad: Instalar cableado",
   *     "id_usuario": 1
   *   }
   *
   * La fecha se asigna automáticamente con CURRENT_TIMESTAMP.
   *
   * Nota: Este endpoint es interno. Normalmente se llama desde
   * otros módulos del backend cuando se realiza una acción importante.
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { accion, id_usuario } = req.body;

      const [result] = await pool.query(
        'INSERT INTO historial (accion, id_usuario) VALUES (?, ?)',
        [accion, id_usuario]
      );

      res.status(201).json({
        id: result.insertId,
        accion,
        id_usuario,
        mensaje: 'Acción registrada en historial'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/historial/:id
   * ------------------------------------------------------------------
   * Elimina un registro de auditoría por su ID.
   *
   * Nota: En sistemas de producción, esta acción debería estar
   * restringida solo a administradores y también registrarse
   * en el propio historial antes de eliminar.
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM historial WHERE id_historial = ?',
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registro de historial no encontrado' });
      }
      res.json({ message: 'Registro de historial eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
