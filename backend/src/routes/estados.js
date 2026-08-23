const express = require('express');
const router = express.Router();

module.exports = function(pool) {

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM estado_actividad');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM estado_actividad WHERE id_estado = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { nombre_estado } = req.body;
      const [result] = await pool.query('INSERT INTO estado_actividad (nombre_estado) VALUES (?)', [nombre_estado]);
      res.status(201).json({ id: result.insertId, nombre_estado });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { nombre_estado } = req.body;
      const [result] = await pool.query('UPDATE estado_actividad SET nombre_estado = ? WHERE id_estado = ?', [nombre_estado, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json({ message: 'Estado actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM estado_actividad WHERE id_estado = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json({ message: 'Estado eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
