const express = require('express');
const router = express.Router();

module.exports = function(pool) {

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM sede');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM sede WHERE id_sede = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Sede no encontrada' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { nombre, ubicacion, telefono } = req.body;
      const [result] = await pool.query('INSERT INTO sede (nombre, ubicacion, telefono) VALUES (?, ?, ?)', [nombre, ubicacion, telefono]);
      res.status(201).json({ id: result.insertId, nombre, ubicacion, telefono });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { nombre, ubicacion, telefono } = req.body;
      const [result] = await pool.query('UPDATE sede SET nombre = ?, ubicacion = ?, telefono = ? WHERE id_sede = ?', [nombre, ubicacion, telefono, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Sede no encontrada' });
      res.json({ message: 'Sede actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM sede WHERE id_sede = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Sede no encontrada' });
      res.json({ message: 'Sede eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
