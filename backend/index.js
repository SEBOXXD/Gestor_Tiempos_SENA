/**
 * ====================================================================
 * ARCHIVO: index.js (Punto de entrada del servidor)
 * ====================================================================
 * Este es el archivo principal del backend. Se encarga de:
 *   1. Cargar las variables de entorno (dotenv)
 *   2. Configurar Express (CORS, body parser JSON)
 *   3. Crear el pool de conexiones a MySQL (Railway)
 *   4. Registrar todas las rutas de la API
 *   5. Iniciar el servidor en el puerto indicado
 *
 * Pool de conexiones:
 *   Se usa mysql2/promise con un pool de hasta 10 conexiones
 *   simultáneas para manejar tráfico concurrente sin agotar
 *   las conexiones del servidor MySQL de Railway.
 *
 * Endpoints directos:
 *   GET /             → Mensaje de bienvenida
 *   GET /api/health   → Verificar estado de la base de datos
 * ====================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// --- Importación de todas las rutas de la API ---
const authRoutes = require('./src/routes/auth');
const sedesRoutes = require('./src/routes/sedes');
const rolesRoutes = require('./src/routes/roles');
const usuariosRoutes = require('./src/routes/usuarios');
const actividadesRoutes = require('./src/routes/actividades');
const turnosRoutes = require('./src/routes/turnos');
const estadosRoutes = require('./src/routes/estados');
const registrosRoutes = require('./src/routes/registros');
const aprobacionesRoutes = require('./src/routes/aprobaciones');
const dashboardRoutes = require('./src/routes/dashboard');
const reportesRoutes = require('./src/routes/reportes');
const historialRoutes = require('./src/routes/historial');
const notificacionesRoutes = require('./src/routes/notificaciones');
const contactoRoutes = require('./src/routes/contacto');

// --- Inicialización de Express ---
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globales:
//   cors()              → Permite peticiones desde el frontend (React)
//   express.json()      → Parsea el body de las peticiones como JSON
app.use(cors());
app.use(express.json());

// --- Pool de conexiones a MySQL ---
// Las variables MYSQLHOST, MYSQLUSER, etc. son proporcionadas
// automáticamente por Railway al vincular el servicio de MySQL.
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT || 3306,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,   // Espera si todas las conexiones están ocupadas
  connectionLimit: 10,        // Máximo de 10 conexiones simultáneas
  queueLimit: 0               // Sin límite de colas de espera
});

/**
 * testConnection()
 * ------------------------------------------------------------------
 * Verifica que la conexión a MySQL funcione al iniciar el servidor.
 * Si falla, imprime el error en consola pero NO detiene el servidor
 * (puede que la DB se reconecte después).
 * ------------------------------------------------------------------
 */
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

// --- Rutas directas del servidor ---

/** GET / → Endpoint de bienvenida / health check rápido */
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Gestor Tiempos SENA API' });
});

/** GET /api/health → Verifica que la base de datos esté respondiendo */
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// --- Registro de rutas de la API ---
// Cada módulo recibe el pool de conexiones como parámetro
// para poder ejecutar queries a la base de datos.
app.use('/api/auth',         authRoutes(pool));
app.use('/api/sedes',        sedesRoutes(pool));
app.use('/api/roles',        rolesRoutes(pool));
app.use('/api/usuarios',     usuariosRoutes(pool));
app.use('/api/actividades',  actividadesRoutes(pool));
app.use('/api/turnos',       turnosRoutes(pool));
app.use('/api/estados',      estadosRoutes(pool));
app.use('/api/registros',    registrosRoutes(pool));
app.use('/api/aprobaciones', aprobacionesRoutes(pool));
app.use('/api/dashboard',        dashboardRoutes(pool));
app.use('/api/reportes',         reportesRoutes(pool));
app.use('/api/historial',        historialRoutes(pool));
app.use('/api/notificaciones',   notificacionesRoutes(pool));
app.use('/api/contacto',         contactoRoutes());

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
