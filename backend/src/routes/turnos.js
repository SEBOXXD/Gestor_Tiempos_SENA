const express = require('express');
const router = express.Router();

module.exports = function(pool) {

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM turno');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM turno WHERE id_turno = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada } = req.body;
      const [result] = await pool.query(
        'INSERT INTO turno (nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada) VALUES (?, ?, ?, ?)',
        [nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada]
      );
      res.status(201).json({ id: result.insertId, nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada } = req.body;
      const [result] = await pool.query(
        'UPDATE turno SET nombre_turno = ?, hora_inicio_programada = ?, hora_fin_programada = ?, horas_jornada = ? WHERE id_turno = ?',
        [nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json({ message: 'Turno actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM turno WHERE id_turno = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json({ message: 'Turno eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
