/**
 * ====================================================================
 * ARCHIVO: usuarios.js
 * ====================================================================
 * Rutas CRUD para la gestión de usuarios del sistema.
 *
 * Cada usuario tiene un nombre, correo (único), contraseña hasheada,
 * un rol y una sede. Las consultas incluyen JOIN con las tablas
 * 'rol' y 'sede' para devolver los nombres en lugar de solo IDs.
 *
 * Endpoints:
 *   GET    /api/usuarios              → Listar todos los usuarios
 *   GET    /api/usuarios/:id          → Obtener un usuario por ID
 *   POST   /api/usuarios              → Crear un usuario
 *   PUT    /api/usuarios/:id          → Actualizar datos del usuario
 *   PUT    /api/usuarios/:id/password → Cambiar contraseña
 *   DELETE /api/usuarios/:id          → Eliminar un usuario
 * ====================================================================
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/usuarios
   * ------------------------------------------------------------------
   * Retorna todos los usuarios con su rol y sede.
   * La contraseña NO se incluye en la respuesta por seguridad.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT u.id_usuario, u.nombre, u.correo, u.estado_usuario, u.id_rol, u.id_sede,
                r.nombre_rol, s.nombre AS sede
         FROM usuario u
         JOIN rol r ON u.id_rol = r.id_rol
         JOIN sede s ON u.id_sede = s.id_sede`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/usuarios/:id
   * ------------------------------------------------------------------
   * Retorna un usuario específico por su ID, con rol y sede.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT u.id_usuario, u.nombre, u.correo, u.estado_usuario, u.id_rol, u.id_sede,
                r.nombre_rol, s.nombre AS sede
         FROM usuario u
         JOIN rol r ON u.id_rol = r.id_rol
         JOIN sede s ON u.id_sede = s.id_sede
         WHERE u.id_usuario = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/usuarios
   * ------------------------------------------------------------------
   * Crea un nuevo usuario con contraseña hasheada.
   *
   * Body esperado:
   *   {
   *     "nombre": "Juan Perez",
   *     "correo": "juan@mail.com",
   *     "contrasena": "123456",
   *     "id_rol": 3,
   *     "id_sede": 1
   *   }
   *
   * Flujo:
   *   1. Verifica que el correo no esté registrado
   *   2. Hashea la contraseña con bcrypt (10 rounds)
   *   3. Inserta el usuario en la base de datos
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { nombre, correo, contrasena, id_rol, id_sede } = req.body;

      // Verificar unicidad del correo
      const [existing] = await pool.query(
        'SELECT id_usuario FROM usuario WHERE correo = ?',
        [correo]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      // Hashear la contraseña con 10 rondas de salt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);

      const [result] = await pool.query(
        'INSERT INTO usuario (nombre, correo, contrasena, id_rol, id_sede) VALUES (?, ?, ?, ?, ?)',
        [nombre, correo, hashedPassword, id_rol, id_sede]
      );

      res.status(201).json({ id: result.insertId, nombre, correo, id_rol, id_sede });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/usuarios/:id
   * ------------------------------------------------------------------
   * Actualiza los datos de un usuario (parcial update).
   * Solo se actualizan los campos enviados en el body.
   *
   * Body esperado (campos opcionales):
   *   {
   *     "nombre": "Nuevo Nombre",
   *     "correo": "nuevo@mail.com",
   *     "id_rol": 2,
   *     "id_sede": 1,
   *     "estado_usuario": 0   // 0=inactivo, 1=activo
   *   }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { nombre, correo, id_rol, id_sede, estado_usuario } = req.body;

      // Construir la consulta dinámicamente solo con los campos enviados
      const fields = [];
      const values = [];

      if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
      if (correo !== undefined) { fields.push('correo = ?'); values.push(correo); }
      if (id_rol !== undefined) { fields.push('id_rol = ?'); values.push(id_rol); }
      if (id_sede !== undefined) { fields.push('id_sede = ?'); values.push(id_sede); }
      if (estado_usuario !== undefined) { fields.push('estado_usuario = ?'); values.push(estado_usuario); }

      // Si no se envió ningún campo, retornar error
      if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

      values.push(req.params.id);
      const [result] = await pool.query(
        `UPDATE usuario SET ${fields.join(', ')} WHERE id_usuario = ?`,
        values
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/usuarios/:id/password
   * ------------------------------------------------------------------
   * Cambia la contraseña de un usuario.
   * La nueva contraseña se hashea antes de guardarse.
   *
   * Body esperado: { "contrasena": "nueva_contrasena" }
   * ------------------------------------------------------------------
   */
  router.put('/:id/password', async (req, res) => {
    try {
      const { contrasena } = req.body;
      // Hashear la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);

      const [result] = await pool.query(
        'UPDATE usuario SET contrasena = ? WHERE id_usuario = ?',
        [hashedPassword, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Contraseña actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/usuarios/:id
   * ------------------------------------------------------------------
   * Elimina un usuario por su ID.
   * Nota: Fallará si el usuario tiene registros o actividades
   * asociadas (FK constraint con ON DELETE RESTRICT).
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM usuario WHERE id_usuario = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
