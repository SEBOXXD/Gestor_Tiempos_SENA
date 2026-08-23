const express = require('express');
const router = express.Router();

module.exports = function(pool) {

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM rol');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM rol WHERE id_rol = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { nombre_rol } = req.body;
      const [result] = await pool.query('INSERT INTO rol (nombre_rol) VALUES (?)', [nombre_rol]);
      res.status(201).json({ id: result.insertId, nombre_rol });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { nombre_rol } = req.body;
      const [result] = await pool.query('UPDATE rol SET nombre_rol = ? WHERE id_rol = ?', [nombre_rol, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json({ message: 'Rol actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM rol WHERE id_rol = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json({ message: 'Rol eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
