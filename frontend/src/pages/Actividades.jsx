import { useState } from "react"
import "../styles/Actividades.css"
import Sidebar from "../components/Sidebar"

const initialActividades = [
  { id: 1, titulo: "Revisión de inventario", descripcion: "Conteo de materiales de la bodega principal", asignado: "Ana García", sede: "Sede A", prioridad: "alta", estado: "en-curso", fecha: "06/07/2026" },
  { id: 2, titulo: "Control de calidad lote #0421", descripcion: "Verificar estándares del lote matutino", asignado: "Luis Martínez", sede: "Sede B", prioridad: "alta", estado: "completada", fecha: "06/07/2026" },
  { id: 3, titulo: "Mantenimiento preventivo máquina 3", descripcion: "Lubricación y ajuste de correas", asignado: "Carla Pérez", sede: "Sede A", prioridad: "media", estado: "pendiente", fecha: "07/07/2026" },
  { id: 4, titulo: "Reunión de equipo semanal", descripcion: "Revisión de metas y ajuste de turnos", asignado: "Juan Rojas", sede: "Sede C", prioridad: "baja", estado: "pendiente", fecha: "07/07/2026" },
  { id: 5, titulo: "Reporte de producción mensual", descripcion: "Consolidar datos de producción del mes", asignado: "Miguel Torres", sede: "Sede A", prioridad: "media", estado: "en-curso", fecha: "06/07/2026" },
]

function Actividades() {
  const [actividades] = useState(initialActividades)
  const [filter, setFilter] = useState("todas")

  const filtered = filter === "todas" ? actividades : actividades.filter((a) => a.estado === filter)

  return (
    <div className="actividades-container">
      <Sidebar activeItem="actividades" userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="actividades-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>📋 Actividades</h1>
            <p>Gestión de tareas y actividades asignadas a los empleados</p>
          </div>
          <button className="btn-primary">+ Nueva actividad</button>
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
          <div className="filter-group">
            <label>Prioridad</label>
            <select className="filter-select">
              <option>Todas</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sede</label>
            <select className="filter-select">
              <option>Todas</option>
              <option>Sede A</option>
              <option>Sede B</option>
              <option>Sede C</option>
            </select>
          </div>
          <button className="btn-filter">Filtrar</button>
        </section>

        <section className="actividades-grid">
          {filtered.map((act) => (
            <div className="actividad-card-wide" key={act.id}>
              <div className="actividad-card-header">
                <h3>{act.titulo}</h3>
                <span className={`priority-badge ${act.prioridad}`}>{act.prioridad}</span>
              </div>
              <p className="actividad-card-desc">{act.descripcion}</p>
              <div className="actividad-card-meta">
                <span>👤 {act.asignado}</span>
                <span>📍 {act.sede}</span>
                <span>📅 {act.fecha}</span>
              </div>
              <div className="actividad-card-footer">
                <span className={`status-badge ${act.estado}`}>
                  <span className="status-dot" />
                  {act.estado === "completada" ? "Completada" : act.estado === "en-curso" ? "En curso" : "Pendiente"}
                </span>
                <div className="action-btns">
                  <button className="btn-icon" title="Editar">✏️</button>
                  <button className="btn-icon" title="Ver">👁️</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default Actividades
