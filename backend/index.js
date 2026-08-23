require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const authRoutes = require('./src/routes/auth');
const sedesRoutes = require('./src/routes/sedes');
const rolesRoutes = require('./src/routes/roles');

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
