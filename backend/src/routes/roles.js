/**
 * ====================================================================
 * ARCHIVO: roles.js
 * ====================================================================
 * Rutas CRUD para la gestión de roles del sistema.
 *
 * Un rol determina los permisos de un usuario dentro del sistema.
 * Roles predefinidos en la base de datos:
 *   1 → Administrador (acceso total)
 *   2 → Supervisor (puede aprobar registros)
 *   3 → Operario (registra horas y actividades)
 *
 * Endpoints:
 *   GET    /api/roles      → Listar todos los roles
 *   GET    /api/roles/:id  → Obtener un rol por ID
 *   POST   /api/roles      → Crear un nuevo rol
 *   PUT    /api/roles/:id  → Actualizar un rol
 *   DELETE /api/roles/:id  → Eliminar un rol
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/roles
   * ------------------------------------------------------------------
   * Retorna todos los roles registrados en el sistema.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM rol');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/roles/:id
   * ------------------------------------------------------------------
   * Retorna un rol específico por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM rol WHERE id_rol = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/roles
   * ------------------------------------------------------------------
   * Crea un nuevo rol en el sistema.
   *
   * Body esperado: { "nombre_rol": "Supervisor" }
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { nombre_rol } = req.body;
      const [result] = await pool.query('INSERT INTO rol (nombre_rol) VALUES (?)', [nombre_rol]);
      res.status(201).json({ id: result.insertId, nombre_rol });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/roles/:id
   * ------------------------------------------------------------------
   * Actualiza el nombre de un rol existente.
   *
   * Body esperado: { "nombre_rol": "Nuevo Nombre" }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { nombre_rol } = req.body;
      const [result] = await pool.query(
        'UPDATE rol SET nombre_rol = ? WHERE id_rol = ?',
        [nombre_rol, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json({ message: 'Rol actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/roles/:id
   * ------------------------------------------------------------------
   * Elimina un rol por su ID.
   * Nota: Fallará si hay usuarios asociados a este rol (FK constraint).
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM rol WHERE id_rol = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json({ message: 'Rol eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
