/**
 * ====================================================================
 * ARCHIVO: AuthContext.jsx (Contexto de autenticación)
 * ====================================================================
 * Este archivo gestiona el estado global de autenticación del usuario.
 *
 * Proporciona al resto de la aplicación:
 *   - user         → Datos del usuario logueado (id, nombre, correo, rol, sede)
 *   - token        → Token JWT actual
 *   - login()      → Función para iniciar sesión
 *   - register()   → Función para registrar un usuario
 *   - logout()     → Función para cerrar sesión
 *   - isAuthenticated → Booleano que indica si hay sesión activa
 *
 * Los datos se persisten en localStorage para que el usuario
 * no tenga que volver a iniciar sesión al recargar la página.
 *
 * Uso:
 *   import { useAuth } from '../context/AuthContext'
 *   const { user, login, logout } = useAuth()
 * ====================================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { apiPost } from '../services/api';

// Crear el contexto (será undefined si no hay Provider arriba)
const AuthContext = createContext(null);

/**
 * AuthProvider
 * ------------------------------------------------------------------
 * Componente wrapper que provee el contexto de autenticación
 * a todos los componentes hijos (típicamente se coloca en App.jsx).
 * ------------------------------------------------------------------
 */
export function AuthProvider({ children }) {
  // Estado del usuario: se carga desde localStorage al iniciar
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Token JWT: se carga desde localStorage al iniciar
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Sincronizar user/token con localStorage cuando cambien
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  /**
   * login(correo, contrasena)
   * ------------------------------------------------------------------
   * Envía las credenciales al backend y guarda la sesión.
   *
   * @param {string} correo - Correo electrónico del usuario
   * @param {string} contrasena - Contraseña en texto plano
   * @returns {Promise<object>} - Datos del usuario + token
   * @throws {Error} - Si las credenciales son incorrectas
   * ------------------------------------------------------------------
   */
  async function login(correo, contrasena) {
    const data = await apiPost('/api/auth/login', { correo, contrasena });

    // Guardar datos del usuario y token
    const userData = {
      id: data.id,
      nombre: data.nombre,
      correo: data.correo,
      rol: data.rol,
      sede: data.sede
    };

    setUser(userData);
    setToken(data.token);

    return data;
  }

  /**
   * register(datos)
   * ------------------------------------------------------------------
   * Registra un nuevo usuario y lo loguea automáticamente.
   *
   * @param {object} datos - { nombre, correo, contrasena, id_rol, id_sede }
   * @returns {Promise<object>} - Datos del usuario + token
   * ------------------------------------------------------------------
   */
  async function register(datos) {
    const data = await apiPost('/api/auth/register', datos);

    // Auto-login: guardar la sesión después del registro
    const userData = {
      id: data.id,
      nombre: data.nombre,
      correo: data.correo,
      rol: 'Operario', // Rol por defecto
      sede: 'Sin asignar'
    };

    setUser(userData);
    setToken(data.token);

    return data;
  }

  /**
   * logout()
   * ------------------------------------------------------------------
   * Cierra la sesión limpiando todo el estado y localStorage.
   * ------------------------------------------------------------------
   */
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Valor que se provee a todos los componentes hijos
  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth()
 * ------------------------------------------------------------------
 * Hook personalizado para acceder al contexto de autenticación.
 *
 * Uso: const { user, login, logout } = useAuth()
 *
 * Debe usarse dentro de un AuthProvider.
 * Lanza error si se usa fuera del provider.
 * ------------------------------------------------------------------
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
