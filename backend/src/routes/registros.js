/**
 * ====================================================================
 * ARCHIVO: registros.js
 * ====================================================================
 * Rutas CRUD para la gestión de registros de hora (jornada laboral).
 *
 * Un registro de hora representa la entrada y salida de un usuario
 * en un día específico, junto con el turno al que pertenece.
 *
 * Lógica de negocio:
 *   - Entrada: Registra la fecha y hora actuales automáticamente.
 *     Verifica que no exista una entrada abierta (sin salida) del
 *     mismo usuario en el mismo día.
 *   - Salida: Calcula automáticamente las total_horas restando
 *     hora_entrada de hora_salida usando TIME_TO_SEC de MySQL.
 *
 * Endpoints:
 *   GET    /api/registros                → Listar todos los registros
 *   GET    /api/registros/:id            → Obtener un registro
 *   GET    /api/registros/usuario/:id    → Registros de un usuario
 *   POST   /api/registros/entrada        → Registrar entrada
 *   PUT    /api/registros/salida/:id     → Registrar salida
 *   PUT    /api/registros/:id            → Actualizar registro
 *   DELETE /api/registros/:id            → Eliminar registro
 *
 * NOTA: Las rutas con prefijo (usuario/:id, entrada, salida/:id)
 *       deben definirse ANTES de /:id para evitar conflictos
 *       con Express Router.
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/registros
   * ------------------------------------------------------------------
   * Retorna todos los registros de hora con estado, usuario y turno.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, e.nombre_estado, u.nombre AS usuario, t.nombre_turno
         FROM registro_hora r
         JOIN estado_actividad e ON r.id_estado = e.id_estado
         JOIN usuario u ON r.id_usuario = u.id_usuario
         JOIN turno t ON r.id_turno = t.id_turno`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/registros/usuario/:id_usuario
   * ------------------------------------------------------------------
   * Retorna los registros de un usuario específico, ordenados
   * por fecha descendente (más recientes primero).
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id para que
   * Express no la confunda con GET /:id (literal "usuario"
   * no coincidiría con un número, pero es mejor práctica).
   * ------------------------------------------------------------------
   */
  router.get('/usuario/:id_usuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, e.nombre_estado, t.nombre_turno
         FROM registro_hora r
         JOIN estado_actividad e ON r.id_estado = e.id_estado
         JOIN turno t ON r.id_turno = t.id_turno
         WHERE r.id_usuario = ?
         ORDER BY r.fecha DESC, r.hora_entrada DESC`,
        [req.params.id_usuario]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/registros/:id
   * ------------------------------------------------------------------
   * Retorna un registro específico por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.*, e.nombre_estado, u.nombre AS usuario, t.nombre_turno
         FROM registro_hora r
         JOIN estado_actividad e ON r.id_estado = e.id_estado
         JOIN usuario u ON r.id_usuario = u.id_usuario
         JOIN turno t ON r.id_turno = t.id_turno
         WHERE r.id_registro = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/registros/entrada
   * ------------------------------------------------------------------
   * Registra la entrada de un usuario (marca de asistencia).
   *
   * Body esperado:
   *   {
   *     "id_usuario": 1,
   *     "id_turno": 1
   *   }
   *
   * Flujo:
   *   1. Obtiene la fecha y hora actuales del sistema
   *   2. Verifica que el usuario no tenga una entrada abierta hoy
   *   3. Inserta el registro con estado "Pendiente" (id_estado = 1)
   *
   * Respuestas:
   *   201 → Entrada registrada exitosamente
   *   400 → Ya existe una entrada abierta sin salida hoy
   *   500 → Error del servidor
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id para evitar
   * que Express la capture como un parámetro dinámico.
   * ------------------------------------------------------------------
   */
  router.post('/entrada', async (req, res) => {
    try {
      const { id_usuario, id_turno } = req.body;

      // Obtener fecha y hora actuales del sistema
      const fecha = new Date().toISOString().slice(0, 10);
      const hora_entrada = new Date().toTimeString().slice(0, 8);

      // Verificar que no exista una entrada abierta (sin salida) hoy
      const [existing] = await pool.query(
        'SELECT id_registro FROM registro_hora WHERE id_usuario = ? AND fecha = ? AND hora_salida IS NULL',
        [id_usuario, fecha]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Ya tienes una entrada registrada sin salida hoy' });
      }

      // Insertar el registro de entrada con estado "Pendiente"
      const [result] = await pool.query(
        'INSERT INTO registro_hora (fecha, hora_entrada, id_estado, id_usuario, id_turno) VALUES (?, ?, 1, ?, ?)',
        [fecha, hora_entrada, id_usuario, id_turno]
      );

      res.status(201).json({ id: result.insertId, fecha, hora_entrada, id_usuario, id_turno });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/registros/salida/:id
   * ------------------------------------------------------------------
   * Registra la salida de un usuario y calcula las horas trabajadas.
   *
   * Flujo:
   *   1. Obtiene la hora actual del sistema
   *   2. Busca el registro de entrada por ID
   *   3. Calcula total_horas usando TIME_TO_SEC de MySQL
   *      (hora_salida - hora_entrada) / 3600
   *   4. Actualiza el registro con la hora salida y total
   *
   * Respuestas:
   *   200 → Salida registrada con horas calculadas
   *   404 → Registro no encontrado
   *   500 → Error del servidor
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id para evitar
   * que Express la capture como un parámetro dinámico.
   * ------------------------------------------------------------------
   */
  router.put('/salida/:id', async (req, res) => {
    try {
      const hora_salida = new Date().toTimeString().slice(0, 8);

      // Buscar el registro de entrada
      const [registro] = await pool.query(
        'SELECT * FROM registro_hora WHERE id_registro = ?',
        [req.params.id]
      );
      if (registro.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });

      // Calcular total_horas usando funciones de tiempo de MySQL
      const entrada = registro[0];
      const [entradaTime] = await pool.query('SELECT TIME_TO_SEC(?) AS seg', [entrada.hora_entrada]);
      const [salidaTime] = await pool.query('SELECT TIME_TO_SEC(?) AS seg', [hora_salida]);
      const totalHoras = ((salidaTime[0].seg - entradaTime[0].seg) / 3600).toFixed(2);

      // Actualizar el registro con la salida y horas trabajadas
      const [result] = await pool.query(
        'UPDATE registro_hora SET hora_salida = ?, total_horas = ? WHERE id_registro = ?',
        [hora_salida, totalHoras, req.params.id]
      );

      res.json({ message: 'Salida registrada', hora_salida, total_horas: totalHoras });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/registros/:id
   * ------------------------------------------------------------------
   * Actualiza un registro de hora existente (parcial update).
   * Útil para correcciones manuales de un supervisor.
   *
   * Body esperado (campos opcionales):
   *   {
   *     "fecha": "2026-08-23",
   *     "hora_entrada": "07:00:00",
   *     "hora_salida": "15:00:00",
   *     "total_horas": 8.00,
   *     "id_estado": 5,
   *     "id_usuario": 1,
   *     "id_turno": 1
   *   }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { fecha, hora_entrada, hora_salida, total_horas, id_estado, id_usuario, id_turno } = req.body;

      // Construir la consulta dinámicamente solo con los campos enviados
      const fields = [];
      const values = [];

      if (fecha !== undefined) { fields.push('fecha = ?'); values.push(fecha); }
      if (hora_entrada !== undefined) { fields.push('hora_entrada = ?'); values.push(hora_entrada); }
      if (hora_salida !== undefined) { fields.push('hora_salida = ?'); values.push(hora_salida); }
      if (total_horas !== undefined) { fields.push('total_horas = ?'); values.push(total_horas); }
      if (id_estado !== undefined) { fields.push('id_estado = ?'); values.push(id_estado); }
      if (id_usuario !== undefined) { fields.push('id_usuario = ?'); values.push(id_usuario); }
      if (id_turno !== undefined) { fields.push('id_turno = ?'); values.push(id_turno); }

      if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

      values.push(req.params.id);
      const [result] = await pool.query(
        `UPDATE registro_hora SET ${fields.join(', ')} WHERE id_registro = ?`,
        values
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ message: 'Registro actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/registros/:id
   * ------------------------------------------------------------------
   * Elimina un registro de hora por su ID.
   * Nota: Fallará si tiene aprobaciones asociadas (FK constraint).
   * ------------------------------------------------------------------
   */
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM registro_hora WHERE id_registro = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ message: 'Registro eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
