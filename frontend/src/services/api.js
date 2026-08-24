/**
 * ====================================================================
 * ARCHIVO: api.js (Servicio de comunicación con el Backend)
 * ====================================================================
 * Este archivo encapsula todas las llamadas HTTP al backend.
 * Maneja automáticamente:
 *   - La URL base (localhost en desarrollo, Railway en producción)
 *   - El token JWT de autenticación en el header Authorization
 *   - Parsing de respuestas JSON
 *   - Manejo de errores con mensajes descriptivos
 *
 * Uso en componentes:
 *   import { apiGet, apiPost, apiPut, apiDelete } from '../services/api'
 *
 *   const usuarios = await apiGet('/api/usuarios')
 *   const nuevo = await apiPost('/api/usuarios', { nombre: 'Juan' })
 * ====================================================================
 */

// En desarrollo (sin VITE_API_URL), se usa string vacío para que las
// peticiones pasen por el proxy de Vite (/api → localhost:3000).
// En producción (Railway), VITE_API_URL apunta al backend desplegado.
const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Obtener el token JWT almacenado en localStorage.
 * Las páginas lo guardan al hacer login y lo borran al cerrar sesión.
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Construir los headers estándar para las peticiones.
 * Incluye Content-Type y el token de autenticación si existe.
 */
function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Procesar la respuesta de una petición fetch.
 * Lanza un error con el mensaje del backend si la respuesta no es OK.
 * Maneja tanto respuestas JSON como HTML (cuando el backend no responde).
 */
async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';

  // Si la respuesta no es JSON (ej: HTML de error 404), lanzar error genérico
  if (!contentType.includes('application/json')) {
    if (!res.ok) {
      throw new Error(`Error del servidor (${res.status}). Verifica que el backend esté corriendo.`);
    }
    throw new Error('La respuesta del servidor no es JSON válido.');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

/**
 * apiGet(endpoint)
 * ------------------------------------------------------------------
 * Realiza una petición GET al backend.
 *
 * @param {string} endpoint - Ruta relativa (ej: '/api/usuarios')
 * @returns {Promise<object>} - Datos de la respuesta
 *
 * Ejemplo: const roles = await apiGet('/api/roles')
 * ------------------------------------------------------------------
 */
export async function apiGet(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

/**
 * apiPost(endpoint, data)
 * ------------------------------------------------------------------
 * Realiza una petición POST al backend.
 *
 * @param {string} endpoint - Ruta relativa
 * @param {object} data - Datos a enviar en el body
 * @returns {Promise<object>} - Datos de la respuesta
 *
 * Ejemplo: await apiPost('/api/auth/login', { correo, contrasena })
 * ------------------------------------------------------------------
 */
export async function apiPost(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

/**
 * apiPut(endpoint, data)
 * ------------------------------------------------------------------
 * Realiza una petición PUT al backend.
 *
 * @param {string} endpoint - Ruta relativa
 * @param {object} data - Datos a enviar en el body
 * @returns {Promise<object>} - Datos de la respuesta
 *
 * Ejemplo: await apiPut('/api/usuarios/1', { nombre: 'Nuevo Nombre' })
 * ------------------------------------------------------------------
 */
export async function apiPut(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

/**
 * apiDelete(endpoint)
 * ------------------------------------------------------------------
 * Realiza una petición DELETE al backend.
 *
 * @param {string} endpoint - Ruta relativa
 * @returns {Promise<object>} - Mensaje de confirmación
 *
 * Ejemplo: await apiDelete('/api/usuarios/1')
 * ------------------------------------------------------------------
 */
export async function apiDelete(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(res);
}
