const express = require('express');
const router = express.Router();

module.exports = function(pool) {

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.nombre AS supervisor, r.fecha, r.hora_entrada, r.hora_salida, r.total_horas, emp.nombre AS empleado
         FROM aprobacion a
         JOIN usuario u ON a.id_supervisor = u.id_usuario
         JOIN registro_hora r ON a.id_registro = r.id_registro
         JOIN usuario emp ON r.id_usuario = emp.id_usuario`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/pendientes', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.id_registro, r.fecha, r.hora_entrada, r.hora_salida, r.total_horas,
                emp.nombre AS empleado, t.nombre_turno
         FROM registro_hora r
         JOIN usuario emp ON r.id_usuario = emp.id_usuario
         JOIN turno t ON r.id_turno = t.id_turno
         WHERE r.id_estado = 1
         ORDER BY r.fecha DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.nombre AS supervisor, r.fecha, r.hora_entrada, r.hora_salida, r.total_horas, emp.nombre AS empleado
         FROM aprobacion a
         JOIN usuario u ON a.id_supervisor = u.id_usuario
         JOIN registro_hora r ON a.id_registro = r.id_registro
         JOIN usuario emp ON r.id_usuario = emp.id_usuario
         WHERE a.id_aprobacion = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Aprobación no encontrada' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { id_registro, id_supervisor, nivel_aprobacion, resultado, observaciones } = req.body;

      const [registro] = await pool.query('SELECT id_estado FROM registro_hora WHERE id_registro = ?', [id_registro]);
      if (registro.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });

      const estadoId = resultado === 'Aprobado' ? 5 : 6;

      await pool.query('UPDATE registro_hora SET id_estado = ? WHERE id_registro = ?', [estadoId, id_registro]);

      const [result] = await pool.query(
        'INSERT INTO aprobacion (nivel_aprobacion, resultado, observaciones, id_registro, id_supervisor) VALUES (?, ?, ?, ?, ?)',
        [nivel_aprobacion, resultado, observaciones, id_registro, id_supervisor]
      );

      res.status(201).json({ id: result.insertId, id_registro, id_supervisor, nivel_aprobacion, resultado, observaciones });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { nivel_aprobacion, resultado, observaciones } = req.body;

      const [aprobacion] = await pool.query('SELECT id_registro FROM aprobacion WHERE id_aprobacion = ?', [req.params.id]);
      if (aprobacion.length === 0) return res.status(404).json({ error: 'Aprobación no encontrada' });

      if (resultado) {
        const estadoId = resultado === 'Aprobado' ? 5 : 6;
        await pool.query('UPDATE registro_hora SET id_estado = ? WHERE id_registro = ?', [estadoId, aprobacion[0].id_registro]);
      }

      const fields = [];
      const values = [];

      if (nivel_aprobacion !== undefined) { fields.push('nivel_aprobacion = ?'); values.push(nivel_aprobacion); }
      if (resultado !== undefined) { fields.push('resultado = ?'); values.push(resultado); }
      if (observaciones !== undefined) { fields.push('observaciones = ?'); values.push(observaciones); }

      if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

      values.push(req.params.id);
      const [result] = await pool.query(`UPDATE aprobacion SET ${fields.join(', ')} WHERE id_aprobacion = ?`, values);
      res.json({ message: 'Aprobación actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM aprobacion WHERE id_aprobacion = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Aprobación no encontrada' });
      res.json({ message: 'Aprobación eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
