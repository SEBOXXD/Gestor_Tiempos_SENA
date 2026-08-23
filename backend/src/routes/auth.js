const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'chronos_secret_key';

module.exports = function(pool) {

  router.post('/register', async (req, res) => {
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

      const token = jwt.sign({ id: result.insertId, correo }, JWT_SECRET, { expiresIn: '24h' });

      res.status(201).json({ id: result.insertId, nombre, correo, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { correo, contrasena } = req.body;

      const [rows] = await pool.query(
        'SELECT u.*, r.nombre_rol, s.nombre AS sede FROM usuario u JOIN rol r ON u.id_rol = r.id_rol JOIN sede s ON u.id_sede = s.id_sede WHERE u.correo = ?',
        [correo]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      const user = rows[0];

      if (!user.estado_usuario) {
        return res.status(403).json({ error: 'Usuario desactivado' });
      }

      const validPassword = await bcrypt.compare(contrasena, user.contrasena);
      if (!validPassword) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      const token = jwt.sign(
        { id: user.id_usuario, correo: user.correo, rol: user.nombre_rol },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.nombre_rol,
        sede: user.sede,
        token
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
