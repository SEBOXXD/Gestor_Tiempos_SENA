/**
 * ====================================================================
 * ARCHIVO: aprobaciones.js
 * ====================================================================
 * Rutas CRUD para la gestión de aprobaciones de registros de hora.
 *
 * Un supervisor puede aprobar o rechazar los registros de hora
 * de los operarios. Al crear o actualizar una aprobación con
 * resultado "Aprobado" o "Rechazado", el estado del registro_hora
 * se actualiza automáticamente:
 *   - Aprobado  → id_estado = 5 (Aprobada)
 *   - Rechazado → id_estado = 6 (Rechazada)
 *
 * Endpoints:
 *   GET    /api/aprobaciones                → Listar todas
 *   GET    /api/aprobaciones/pendientes     → Registros sin aprobar
 *   GET    /api/aprobaciones/:id            → Obtener una por ID
 *   POST   /api/aprobaciones                → Crear aprobación
 *   PUT    /api/aprobaciones/:id            → Actualizar aprobación
 *   DELETE /api/aprobaciones/:id            → Eliminar aprobación
 *
 * NOTA: La ruta /pendientes se define ANTES de /:id para
 *       evitar conflictos de Express Router.
 * ====================================================================
 */

const express = require('express');
const router = express.Router();

module.exports = function (pool) {

  /**
   * GET /api/aprobaciones
   * ------------------------------------------------------------------
   * Retorna todas las aprobaciones con información del supervisor,
   * del empleado y los datos del registro de hora asociado.
   * ------------------------------------------------------------------
   */
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.nombre AS supervisor, r.fecha, r.hora_entrada,
                r.hora_salida, r.total_horas, emp.nombre AS empleado
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

  /**
   * GET /api/aprobaciones/pendientes
   * ------------------------------------------------------------------
   * Retorna los registros de hora que aún no han sido aprobados
   * (id_estado = 1, que equivale a "Pendiente").
   *
   * IMPORTANTE: Esta ruta se define ANTES de /:id para que
   * Express no capture "pendientes" como un parámetro dinámico.
   *
   * Respuesta ejemplo:
   *   [
   *     {
   *       id_registro: 1,
   *       fecha: "2026-08-23",
   *       hora_entrada: "07:00:00",
   *       empleado: "Juan Perez",
   *       nombre_turno: "Mañana"
   *     }
   *   ]
   * ------------------------------------------------------------------
   */
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

  /**
   * GET /api/aprobaciones/:id
   * ------------------------------------------------------------------
   * Retorna una aprobación específica por su ID.
   * ------------------------------------------------------------------
   */
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.nombre AS supervisor, r.fecha, r.hora_entrada,
                r.hora_salida, r.total_horas, emp.nombre AS empleado
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

  /**
   * POST /api/aprobaciones
   * ------------------------------------------------------------------
   * Crea una nueva aprobación y actualiza el estado del registro.
   *
   * Body esperado:
   *   {
   *     "id_registro": 1,
   *     "id_supervisor": 2,
   *     "nivel_aprobacion": 1,
   *     "resultado": "Aprobado",    // "Aprobado" o "Rechazado"
   *     "observaciones": "Horas correctas"
   *   }
   *
   * Lógica de negocio:
   *   1. Verifica que el registro exista
   *   2. Si resultado = "Aprobado" → registro.id_estado = 5
   *   3. Si resultado = "Rechazado" → registro.id_estado = 6
   *   4. Inserta la aprobación en la tabla
   *
   * Respuestas:
   *   201 → Aprobación creada y registro actualizado
   *   404 → Registro no encontrado
   *   500 → Error del servidor
   * ------------------------------------------------------------------
   */
  router.post('/', async (req, res) => {
    try {
      const { id_registro, id_supervisor, nivel_aprobacion, resultado, observaciones } = req.body;

      // Verificar que el registro exista
      const [registro] = await pool.query(
        'SELECT id_estado FROM registro_hora WHERE id_registro = ?',
        [id_registro]
      );
      if (registro.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });

      // Determinar el nuevo estado según el resultado de la aprobación
      const estadoId = resultado === 'Aprobado' ? 5 : 6;

      // Actualizar el estado del registro_hora automáticamente
      await pool.query(
        'UPDATE registro_hora SET id_estado = ? WHERE id_registro = ?',
        [estadoId, id_registro]
      );

      // Insertar la aprobación
      const [result] = await pool.query(
        'INSERT INTO aprobacion (nivel_aprobacion, resultado, observaciones, id_registro, id_supervisor) VALUES (?, ?, ?, ?, ?)',
        [nivel_aprobacion, resultado, observaciones, id_registro, id_supervisor]
      );

      res.status(201).json({
        id: result.insertId, id_registro, id_supervisor,
        nivel_aprobacion, resultado, observaciones
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/aprobaciones/:id
   * ------------------------------------------------------------------
   * Actualiza una aprobación existente (parcial update).
   * Si se cambia el resultado, también se actualiza el estado del
   * registro_hora asociado.
   *
   * Body esperado (campos opcionales):
   *   {
   *     "nivel_aprobacion": 2,
   *     "resultado": "Rechazado",
   *     "observaciones": "Horas excedidas"
   *   }
   * ------------------------------------------------------------------
   */
  router.put('/:id', async (req, res) => {
    try {
      const { nivel_aprobacion, resultado, observaciones } = req.body;

      // Buscar la aprobación para obtener el id_registro asociado
      const [aprobacion] = await pool.query(
        'SELECT id_registro FROM aprobacion WHERE id_aprobacion = ?',
        [req.params.id]
      );
      if (aprobacion.length === 0) return res.status(404).json({ error: 'Aprobación no encontrada' });

      // Si se cambia el resultado, actualizar también el estado del registro
      if (resultado) {
        const estadoId = resultado === 'Aprobado' ? 5 : 6;
        await pool.query(
          'UPDATE registro_hora SET id_estado = ? WHERE id_registro = ?',
          [estadoId, aprobacion[0].id_registro]
        );
      }

      // Construir la consulta dinámicamente solo con los campos enviados
      const fields = [];
      const values = [];

      if (nivel_aprobacion !== undefined) { fields.push('nivel_aprobacion = ?'); values.push(nivel_aprobacion); }
      if (resultado !== undefined) { fields.push('resultado = ?'); values.push(resultado); }
      if (observaciones !== undefined) { fields.push('observaciones = ?'); values.push(observaciones); }

      if (fields.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

      values.push(req.params.id);
      const [result] = await pool.query(
        `UPDATE aprobacion SET ${fields.join(', ')} WHERE id_aprobacion = ?`,
        values
      );
      res.json({ message: 'Aprobación actualizada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * DELETE /api/aprobaciones/:id
   * ------------------------------------------------------------------
   * Elimina una aprobación por su ID.
   * Nota: No revierte el estado del registro_hora asociado.
   * ------------------------------------------------------------------
   */
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
