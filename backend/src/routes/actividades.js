const express = require('express');
const router = express.Router();

module.exports = function(pool) {

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, e.nombre_estado, u.nombre AS usuario, s.nombre AS sede
         FROM actividad a
         JOIN estado_actividad e ON a.id_estado = e.id_estado
         JOIN usuario u ON a.id_usuario = u.id_usuario
         JOIN sede s ON a.id_sede = s.id_sede`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, e.nombre_estado, u.nombre AS usuario, s.nombre AS sede
         FROM actividad a
         JOIN estado_actividad e ON a.id_estado = e.id_estado
         JOIN usuario u ON a.id_usuario = u.id_usuario
         JOIN sede s ON a.id_sede = s.id_sede
         WHERE a.id_actividad = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Actividad no encontrada' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/usuario/:id_usuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, e.nombre_estado
         FROM actividad a
         JOIN estado_actividad e ON a.id_estado = e.id_estado
         WHERE a.id_usuario = ?`,
        [req.params.id_usuario]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede } = req.body;
      const [result] = await pool.query(
        'INSERT INTO actividad (nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede]
      );
      res.status(201).json({ id: result.insertId, nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { nombre, descripcion, fecha_limite, tiempo_estimado, id_estado, id_usuario, id_sede } = req.body;

      const fields = [];
      const values = [];

      if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
      if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
      if (fecha_limite !== undefined) { fields.push('fecha_limite = ?'); values.push(fecha_limite); }
      if (tiempo_estimado !== undefined) { fields.push('tiempo_estimado = ?'); values.push(tiempo_estimado); }
      if (id_estado !== undefined) { fields.push('id_estado = ?'); values.push(id_estado); }
      if (id_usuario !== undefined) { fields.push('id_usuario = ?'); values.push(id_usuario); }
      if (id_sede !== undefined) { fields.push('id_sede = ?'); values.push(id_sede); }

      if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

      values.push(req.params.id);
      const [result] = await pool.query(`UPDATE actividad SET ${fields.join(', ')} WHERE id_actividad = ?`, values);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Actividad no encontrada' });
      res.json({ message: 'Actividad actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM actividad WHERE id_actividad = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Actividad no encontrada' });
      res.json({ message: 'Actividad eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
