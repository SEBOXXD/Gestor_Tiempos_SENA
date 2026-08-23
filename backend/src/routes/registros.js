const express = require('express');
const router = express.Router();

module.exports = function(pool) {

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

  router.post('/entrada', async (req, res) => {
    try {
      const { id_usuario, id_turno } = req.body;
      const fecha = new Date().toISOString().slice(0, 10);
      const hora_entrada = new Date().toTimeString().slice(0, 8);

      const [existing] = await pool.query(
        'SELECT id_registro FROM registro_hora WHERE id_usuario = ? AND fecha = ? AND hora_salida IS NULL',
        [id_usuario, fecha]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Ya tienes una entrada registrada sin salida hoy' });
      }

      const [result] = await pool.query(
        'INSERT INTO registro_hora (fecha, hora_entrada, id_estado, id_usuario, id_turno) VALUES (?, ?, 1, ?, ?)',
        [fecha, hora_entrada, id_usuario, id_turno]
      );

      res.status(201).json({ id: result.insertId, fecha, hora_entrada, id_usuario, id_turno });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/salida/:id', async (req, res) => {
    try {
      const hora_salida = new Date().toTimeString().slice(0, 8);

      const [registro] = await pool.query('SELECT * FROM registro_hora WHERE id_registro = ?', [req.params.id]);
      if (registro.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });

      const entrada = registro[0];
      const [entradaTime] = await pool.query('SELECT TIME_TO_SEC(?) AS seg', [entrada.hora_entrada]);
      const [salidaTime] = await pool.query('SELECT TIME_TO_SEC(?) AS seg', [hora_salida]);
      const totalHoras = ((salidaTime[0].seg - entradaTime[0].seg) / 3600).toFixed(2);

      const [result] = await pool.query(
        'UPDATE registro_hora SET hora_salida = ?, total_horas = ? WHERE id_registro = ?',
        [hora_salida, totalHoras, req.params.id]
      );

      res.json({ message: 'Salida registrada', hora_salida, total_horas: totalHoras });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { fecha, hora_entrada, hora_salida, total_horas, id_estado, id_usuario, id_turno } = req.body;

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
      const [result] = await pool.query(`UPDATE registro_hora SET ${fields.join(', ')} WHERE id_registro = ?`, values);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ message: 'Registro actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

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
