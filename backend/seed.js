require('dotenv').config();
const mysql = require('mysql2/promise');

async function seed() {
  const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT || 3306,
    database: process.env.MYSQLDATABASE
  });

  try {
    const [roles] = await pool.query('SELECT COUNT(*) AS total FROM rol');
    if (roles[0].total === 0) {
      await pool.query("INSERT INTO rol (nombre_rol) VALUES ('Administrador'), ('Supervisor'), ('Operario')");
      console.log('Roles creados: Administrador, Supervisor, Operario');
    } else {
      console.log('Roles ya existen');
    }

    const [sedes] = await pool.query('SELECT COUNT(*) AS total FROM sede');
    if (sedes[0].total === 0) {
      await pool.query("INSERT INTO sede (nombre, ubicacion, telefono) VALUES ('Sede Principal', 'Bogota', '3001234567')");
      console.log('Sede creada: Sede Principal');
    } else {
      console.log('Sedes ya existen');
    }

    const [estados] = await pool.query('SELECT COUNT(*) AS total FROM estado_actividad');
    if (estados[0].total === 0) {
      await pool.query("INSERT INTO estado_actividad (nombre_estado) VALUES ('Pendiente'), ('En Progreso'), ('Completada'), ('Cancelada'), ('Aprobada'), ('Rechazada')");
      console.log('Estados creados: Pendiente, En Progreso, Completada, Cancelada, Aprobada, Rechazada');
    } else {
      console.log('Estados ya existen');
    }

    const [turnos] = await pool.query('SELECT COUNT(*) AS total FROM turno');
    if (turnos[0].total === 0) {
      await pool.query("INSERT INTO turno (nombre_turno, hora_inicio_programada, hora_fin_programada, horas_jornada) VALUES ('Manana', '07:00:00', '15:00:00', 8.00), ('Tarde', '14:00:00', '22:00:00', 8.00), ('Noche', '22:00:00', '06:00:00', 8.00)");
      console.log('Turnos creados: Manana, Tarde, Noche');
    } else {
      console.log('Turnos ya existen');
    }

    console.log('Seed completado');
  } catch (err) {
    console.error('Error en seed:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
