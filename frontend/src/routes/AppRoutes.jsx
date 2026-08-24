import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

import Login          from "../pages/Login"
import Register       from "../pages/Registro"
import Dashboard      from "../pages/Dashboard"
import Reportes       from "../pages/Reportes"
import Inicio         from "../pages/Inicio"
import Landing        from "../pages/Landing"
import Usuarios       from "../pages/Usuarios"
import Actividades    from "../pages/Actividades"
import Aprobaciones   from "../pages/Aprobaciones"
import Jornada        from "../pages/Jornada"
import Notificaciones from "../pages/Notificaciones"
import Auditoria      from "../pages/Auditoria"
import Configuracion  from "../pages/Configuracion"
import Contacto       from "../pages/Contacto"

/**
 * ProtectedRoute
 * ------------------------------------------------------------------
 * Componente wrapper que protege rutas que requieren autenticación.
 * Si el usuario no está logueado, lo redirige al login (/).
 * ------------------------------------------------------------------
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (no requieren login) */}
        <Route path="/"              element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/landing"       element={<Landing />} />
        <Route path="/contacto"      element={<Contacto />} />

        {/* Rutas protegidas (requieren login) */}
        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/inicio"        element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
        <Route path="/usuarios"      element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        <Route path="/jornada"       element={<ProtectedRoute><Jornada /></ProtectedRoute>} />
        <Route path="/aprobaciones"  element={<ProtectedRoute><Aprobaciones /></ProtectedRoute>} />
        <Route path="/actividades"   element={<ProtectedRoute><Actividades /></ProtectedRoute>} />
        <Route path="/reportes"      element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
        <Route path="/notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />
        <Route path="/auditoria"     element={<ProtectedRoute><Auditoria /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
