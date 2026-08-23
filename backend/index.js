require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const authRoutes = require('./src/routes/auth');
const sedesRoutes = require('./src/routes/sedes');
const rolesRoutes = require('./src/routes/roles');
const usuariosRoutes = require('./src/routes/usuarios');
const actividadesRoutes = require('./src/routes/actividades');
const turnosRoutes = require('./src/routes/turnos');
const estadosRoutes = require('./src/routes/estados');
const registrosRoutes = require('./src/routes/registros');
const aprobacionesRoutes = require('./src/routes/aprobaciones');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT || 3306,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('Conectado a MySQL en Railway');
    conn.release();
  } catch (err) {
    console.error('Error al conectar con MySQL:', err.message);
  }
}

testConnection();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Gestor Tiempos SENA API' });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

app.use('/api/auth', authRoutes(pool));
app.use('/api/sedes', sedesRoutes(pool));
app.use('/api/roles', rolesRoutes(pool));
app.use('/api/usuarios', usuariosRoutes(pool));
app.use('/api/actividades', actividadesRoutes(pool));
app.use('/api/turnos', turnosRoutes(pool));
app.use('/api/estados', estadosRoutes(pool));
app.use('/api/registros', registrosRoutes(pool));
app.use('/api/aprobaciones', aprobacionesRoutes(pool));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
