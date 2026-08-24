import { useState, useEffect } from "react"

import { apiGet } from "../services/api"
import "../styles/Actividades.css"
import Sidebar from "../components/Sidebar"

function Actividades() {
  const [actividades, setActividades] = useState([])
  const [filter, setFilter] = useState("todas")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await apiGet('/api/actividades')
        setActividades(data)
      } catch (err) {
        console.error('Error cargando actividades:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  // Mapear estados del backend a clases CSS del frontend
  const mapEstado = (nombreEstado) => {
    const map = {
      "Pendiente":   "pendiente",
      "En Progreso": "en-curso",
      "Completada":  "completada",
      "Aprobada":    "completada",
      "Cancelada":   "rechazado",
      "Rechazada":   "rechazado",
    }
    return map[nombreEstado] || "pendiente"
  }

  const filtered = filter === "todas"
    ? actividades
    : actividades.filter((a) => mapEstado(a.nombre_estado) === filter)

  return (
    <div className="actividades-container">
      <Sidebar />
      <main className="actividades-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Actividades</h1>
            <p>Gestión de tareas y actividades asignadas a los empleados</p>
          </div>
        </header>

        <section className="filters-bar">
          <div className="filter-group">
            <label>Estado</label>
            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="en-curso">En curso</option>
              <option value="completada">Completadas</option>
            </select>
          </div>
        </section>

        <section className="actividades-grid">
          {loading ? (
            <p>Cargando actividades...</p>
          ) : filtered.length === 0 ? (
            <p>No hay actividades para mostrar</p>
          ) : (
            filtered.map((act) => (
              <div className="actividad-card-wide" key={act.id_actividad}>
                <div className="actividad-card-header">
                  <h3>{act.nombre}</h3>
                </div>
                <p className="actividad-card-desc">{act.descripcion}</p>
                <div className="actividad-card-meta">
                  <span>👤 {act.usuario}</span>
                  <span>📍 {act.sede}</span>
                  <span>📅 {act.fecha_limite}</span>
                </div>
                <div className="actividad-card-footer">
                  <span className={`status-badge ${mapEstado(act.nombre_estado)}`}>
                    <span className="status-dot" />
                    {act.nombre_estado}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default Actividades
