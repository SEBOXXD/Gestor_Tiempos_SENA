const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

module.exports = function(pool) {

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

  router.post('/', async (req, res) => {
    try {
      const { nombre, correo, contrasena, id_rol, id_sede } = req.body;

      const [existing] = await pool.query('SELECT id_usuario FROM usuario WHERE correo = ?', [correo]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

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

  router.put('/:id', async (req, res) => {
    try {
      const { nombre, correo, id_rol, id_sede, estado_usuario } = req.body;

      const fields = [];
      const values = [];

      if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
      if (correo !== undefined) { fields.push('correo = ?'); values.push(correo); }
      if (id_rol !== undefined) { fields.push('id_rol = ?'); values.push(id_rol); }
      if (id_sede !== undefined) { fields.push('id_sede = ?'); values.push(id_sede); }
      if (estado_usuario !== undefined) { fields.push('estado_usuario = ?'); values.push(estado_usuario); }

      if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

      values.push(req.params.id);
      const [result] = await pool.query(`UPDATE usuario SET ${fields.join(', ')} WHERE id_usuario = ?`, values);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id/password', async (req, res) => {
    try {
      const { contrasena } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);
      const [result] = await pool.query('UPDATE usuario SET contrasena = ? WHERE id_usuario = ?', [hashedPassword, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Contraseña actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

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
