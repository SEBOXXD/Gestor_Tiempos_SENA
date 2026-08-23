/**
 * ====================================================================
 * ARCHIVO: auth.js (Middleware de autenticación y autorización)
 * ====================================================================
 * Este archivo contiene los middlewares de seguridad que protegen
 * las rutas de la API. Se usan en combinación para crear rutas
 * que requieren autenticación y/o permisos específicos.
 *
 * Middlewares exportados:
 *   verifyToken  → Verifica que la petición tenga un token JWT válido
 *   verifyRole   → Verifica que el usuario tenga uno de los roles permitidos
 *
 * Uso en rutas (ejemplo):
 *   router.get('/ruta-protegida', verifyToken, verifyRole('Administrador'), handler);
 *
 * Flujo de autenticación:
 *   1. El frontend envía el token en el header: Authorization: Bearer <token>
 *   2. verifyToken decodifica y valida el token
 *   3. Si es válido, guarda los datos del usuario en req.user
 *   4. verifyRole verifica que el rol del usuario esté en la lista permitida
 *   5. Si todo es correcto, pasa al handler de la ruta
 * ====================================================================
 */

const jwt = require('jsonwebtoken');

// Clave secreta para verificar tokens JWT
// Debe coincidir con la usada en auth.js para generar tokens
const JWT_SECRET = process.env.JWT_SECRET || 'chronos_secret_key';

/**
 * verifyToken
 * ------------------------------------------------------------------
 * Middleware de autenticación.
 *
 * Extrae el token del header Authorization (formato: Bearer <token>),
 * lo verifica con la clave secreta JWT y decodifica su payload.
 *
 * Si el token es válido:
 *   - Guarda los datos decodificados en req.user
 *     (contiene: id, correo, rol)
 *   - Llama a next() para continuar con la siguiente función
 *
 * Si el token no existe o es inválido:
 *   - Retorna 401 (token requerido) o 403 (token inválido/expirado)
 *
 * Header esperado:
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * ------------------------------------------------------------------
 */
function verifyToken(req, res, next) {
  // Extraer el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" → "TOKEN"

  // Si no se proporcionó token
  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    // Guardar los datos del usuario en la request para uso posterior
    req.user = decoded;
    next();
  } catch (err) {
    // Token inválido o expirado
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * verifyRole(...roles)
 * ------------------------------------------------------------------
 * Middleware de autorización por rol.
 *
 * Verifica que el usuario autenticado (req.user, establecido por
 * verifyToken) tenga uno de los roles permitidos.
 *
 * Uso:
 *   verifyRole('Administrador')              → Solo administradores
 *   verifyRole('Administrador', 'Supervisor') → Admins y supervisores
 *   verifyRole('Administrador', 'Supervisor', 'Operario') → Todos
 *
 * Si el usuario no tiene permiso:
 *   - Retorna 403 con mensaje de error
 *
 * Parámetros:
 *   ...roles → Lista de nombres de rol permitidos (strings)
 *
 * Retorna:
 *   Función middleware que puede usar en router.use() o router.get(), etc.
 *
 * Ejemplo de uso:
 *   router.delete('/:id', verifyToken, verifyRole('Administrador'), handler);
 * ------------------------------------------------------------------
 */
function verifyRole(...roles) {
  return (req, res, next) => {
    // Verificar que req.user exista (verifyToken debe ejecutarse primero)
    // y que el rol del usuario esté en la lista de roles permitidos
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
}

module.exports = { verifyToken, verifyRole };
