import { BrowserRouter, Routes, Route } from "react-router-dom"
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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/landing"       element={<Landing />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/inicio"        element={<Inicio />} />
        <Route path="/usuarios"      element={<Usuarios />} />
        <Route path="/jornada"       element={<Jornada />} />
        <Route path="/aprobaciones"  element={<Aprobaciones />} />
        <Route path="/actividades"   element={<Actividades />} />
        <Route path="/reportes"      element={<Reportes />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/auditoria"     element={<Auditoria />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/contacto"      element={<Contacto />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
