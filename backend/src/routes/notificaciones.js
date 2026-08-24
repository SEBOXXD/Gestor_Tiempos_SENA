/**
 * ====================================================================
 * ARCHIVO: notificaciones.js
 * ====================================================================
 * Rutas CRUD para el sistema de notificaciones internas.
 *
 * Las notificaciones permiten informar a los usuarios sobre
 * eventos importantes: aprobaciones, cambios de estado, tareas
 * asignadas, etc. Cada notificación tiene un título, mensaje,
 * estado de lectura y está asociada a un usuario.
 *
 * Tabla notificacion (creada en la DB):
 *   id_notificacion  → ID único
 *   titulo           → Asunto de la notificación
 *   mensaje          → Cuerpo del mensaje
 *   leida            → 0=No leída, 1=Leída
 *   fecha            → Fecha y hora de creación
 *   id_usuario       → Usuario destinatario
 *
 * Endpoints:
 *   GET    /api/notificaciones/usuario/:id  → Notificaciones de un usuario
 *   GET    /api/notificaciones/no-leidas/:id → Conteo de no leídas
 *   GET    /api/notificaciones/:id          → Obtener una notificación
 *   POST   /api/notificaciones              → Crear notificación
 *   PUT    /api/notificaciones/leer/:id     → Marcar como leída
 *   PUT    /api/notificaciones/leer-todas/:id → Marcar todas como leídas
 *   DELETE /api/notificaciones/:id          → Eliminar notificación
 *
 * NOTA: Las rutas con prefijo (usuario/:id, no-leidas/:id,
 *       leer/:id, leer-todas/:id) se definen ANTES de /:id.
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/notificaciones/usuario/:id_usuario
   * ------------------------------------------------------------------
   * Retorna todas las notificaciones de un usuario, ordenadas
   * por fecha descendente (más recientes primero).
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id para que
   * Express no capture "usuario" como un parámetro dinámico.
   * ------------------------------------------------------------------
   */
  router.get('/usuario/:id_usuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM notificacion
         WHERE id_usuario = ?
         ORDER BY fecha DESC`,
        [req.params.id_usuario]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/notificaciones/no-leidas/:id_usuario
   * ------------------------------------------------------------------
   * Retorna el conteo de notificaciones no leídas de un usuario.
   * Útil para mostrar un badge/contador en la campanita del frontend.
   *
   * Respuesta ejemplo: { "no_leidas": 3 }
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id.
   * ------------------------------------------------------------------
   */
  router.get('/no-leidas/:id_usuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) AS no_leidas FROM notificacion WHERE id_usuario = ? AND leida = 0',
        [req.params.id_usuario]
      );
      res.json({ no_leidas: rows[0].no_leidas });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/notificaciones/:id
   * ------------------------------------------------------------------
   * Retorna una notificación específica por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM notificacion WHERE id_notificacion = ?',
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Notificación no encontrada' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/notificaciones
   * ------------------------------------------------------------------
   * Crea una nueva notificación para un usuario.
   *
   * Body esperado:
   *   {
   *     "titulo": "Actividad aprobada",
   *     "mensaje": "Tu actividad 'Instalar cableado' fue aprobada",
   *     "id_usuario": 1
   *   }
   *
   * La notificación se crea con leida = 0 (no leída por defecto).
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { titulo, mensaje, id_usuario } = req.body;

      const [result] = await pool.query(
        'INSERT INTO notificacion (titulo, mensaje, id_usuario) VALUES (?, ?, ?)',
        [titulo, mensaje, id_usuario]
      );

      res.status(201).json({
        id: result.insertId,
        titulo,
        mensaje,
        id_usuario,
        leida: 0,
        mensaje_respuesta: 'Notificación creada exitosamente'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/notificaciones/leer/:id
   * ------------------------------------------------------------------
   * Marca una notificación como leída.
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id.
   * ------------------------------------------------------------------
   */
  router.put('/leer/:id', async (req, res) => {
    try {
      const [result] = await pool.query(
        'UPDATE notificacion SET leida = 1 WHERE id_notificacion = ?',
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      res.json({ message: 'Notificación marcada como leída' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/notificaciones/leer-todas/:id_usuario
   * ------------------------------------------------------------------
   * Marca todas las notificaciones de un usuario como leídas.
   * Útil cuando el usuario abre el centro de notificaciones.
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id.
   * ------------------------------------------------------------------
   */
  router.put('/leer-todas/:id_usuario', async (req, res) => {
    try {
      const [result] = await pool.query(
        'UPDATE notificacion SET leida = 1 WHERE id_usuario = ? AND leida = 0',
        [req.params.id_usuario]
      );
      res.json({
        message: 'Notificaciones marcadas como leídas',
        actualizadas: result.affectedRows
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/notificaciones/:id
   * ------------------------------------------------------------------
   * Elimina una notificación por su ID.
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM notificacion WHERE id_notificacion = ?',
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }
      res.json({ message: 'Notificación eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
