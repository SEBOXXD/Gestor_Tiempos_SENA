/**
 * ====================================================================
 * ARCHIVO: auth.js
 * ====================================================================
 * Rutas de autenticación del sistema.
 *
 * Este módulo maneja el registro de nuevos usuarios y el inicio
 * de sesión. Utiliza bcrypt para hashear contraseñas y JWT
 * (JSON Web Tokens) para generar tokens de sesión.
 *
 * Seguridad:
 *   - Las contraseñas NUNCA se almacenan en texto plano.
 *   - Se usa bcrypt con 10 rounds de salt ( bcrypt.genSalt(10) ).
 *   - Los tokens JWT expiran en 24 horas.
 *   - El payload del token contiene: id, correo y rol del usuario.
 *
 * Endpoints:
 *   POST /api/auth/register → Registrar nuevo usuario
 *   POST /api/auth/login    → Iniciar sesión (devuelve token)
 * ====================================================================
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Clave secreta para firmar tokens JWT.
// En producción, esta clave debe estar en las variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET || 'chronos_secret_key';

module.exports = function (pool) {

  /**
   * POST /api/auth/register
   * ------------------------------------------------------------------
   * Registra un nuevo usuario en el sistema.
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
   *   3. Inserta el usuario en la tabla 'usuario'
   *   4. Genera y devuelve un token JWT válido por 24h
   *
   * Respuestas:
   *   201 → Registro exitoso (devuelve token)
   *   400 → El correo ya está registrado
   *   500 → Error del servidor
   * ------------------------------------------------------------------
   */
  router.post('/register', async (req, res) => {
    try {
      const { nombre, correo, contrasena, id_rol, id_sede } = req.body;

      // Verificar si el correo ya existe en la base de datos
      const [existing] = await pool.query(
        'SELECT id_usuario FROM usuario WHERE correo = ?',
        [correo]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      // Hashear la contraseña antes de guardarla
      // genSalt(10) genera 10 rondas de salt → seguro contra rainbow tables
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);

      // Insertar el usuario en la base de datos
      const [result] = await pool.query(
        'INSERT INTO usuario (nombre, correo, contrasena, id_rol, id_sede) VALUES (?, ?, ?, ?, ?)',
        [nombre, correo, hashedPassword, id_rol, id_sede]
      );

      // Generar token JWT con el id y correo del usuario nuevo
      const token = jwt.sign(
        { id: result.insertId, correo },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ id: result.insertId, nombre, correo, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/auth/login
   * ------------------------------------------------------------------
   * Inicia sesión y devuelve un token JWT.
   *
   * Body esperado:
   *   {
   *     "correo": "juan@mail.com",
   *     "contrasena": "123456"
   *   }
   *
   * Flujo:
   *   1. Busca el usuario por correo (incluye rol y sede via JOIN)
   *   2. Verifica que el usuario exista
   *   3. Verifica que el usuario esté activo (estado_usuario = 1)
   *   4. Compara la contraseña hasheada con bcrypt.compare()
   *   5. Genera token JWT con id, correo y rol
   *
   * Respuestas:
   *   200 → Login exitoso (devuelve datos del usuario + token)
   *   401 → Credenciales incorrectas
   *   403 → Usuario desactivado
   *   500 → Error del servidor
   * ------------------------------------------------------------------
   */
  router.post('/login', async (req, res) => {
    try {
      const { correo, contrasena } = req.body;

      // Buscar usuario por correo, incluyendo nombre del rol y sede
      const [rows] = await pool.query(
        `SELECT u.*, r.nombre_rol, s.nombre AS sede
         FROM usuario u
         JOIN rol r ON u.id_rol = r.id_rol
         JOIN sede s ON u.id_sede = s.id_sede
         WHERE u.correo = ?`,
        [correo]
      );

      // Si no se encontró ningún usuario con ese correo
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      const user = rows[0];

      // Verificar si el usuario está activo (estado_usuario = 1)
      if (!user.estado_usuario) {
        return res.status(403).json({ error: 'Usuario desactivado' });
      }

      // Comparar la contraseña ingresada con la hasheada en la DB
      // bcrypt.compare() maneja el salt automáticamente
      const validPassword = await bcrypt.compare(contrasena, user.contrasena);
      if (!validPassword) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      // Generar token JWT con información del usuario
      // El token expira en 24 horas
      const token = jwt.sign(
        { id: user.id_usuario, correo: user.correo, rol: user.nombre_rol },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Devolver datos del usuario y el token
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
