import { useState } from "react"
import "../styles/Notificaciones.css"
import Sidebar from "../components/Sidebar"

const notificacionesData = [
  { id: 1, tipo: "aprobacion", mensaje: "Luis Martínez ha solicitado aprobación de turno (Tarde 06/07)", tiempo: "Hace 15 min", leida: false },
  { id: 2, tipo: "recordatorio", mensaje: "Recordatorio: Reunión semanal en 30 minutos", tiempo: "Hace 25 min", leida: false },
  { id: 3, tipo: "actividad", mensaje: "Ana García completó 'Control de calidad lote #0421'", tiempo: "Hace 1 hora", leida: false },
  { id: 4, tipo: "aprobacion", mensaje: "Carla Pérez registró salida del turno Mañana", tiempo: "Hace 2 horas", leida: true },
  { id: 5, tipo: "sistema", mensaje: "Reporte semanal disponible para descarga", tiempo: "Hace 3 horas", leida: true },
  { id: 6, tipo: "recordatorio", mensaje: "Juan Rojas tiene turno de noche en 1 hora", tiempo: "Hace 4 horas", leida: true },
  { id: 7, tipo: "actividad", mensaje: "Miguel Torres actualizó 'Reporte de producción'", tiempo: "Hace 5 horas", leida: true },
]

const tipoIcon = {
  aprobacion: "✅",
  recordatorio: "🔔",
  actividad: "📋",
  sistema: "⚙️",
}

function Notificaciones() {
  const [notifs, setNotifs] = useState(notificacionesData)
  const [filter, setFilter] = useState("todas")

  const pendientes = notifs.filter((n) => !n.leida).length

  const handleMarkRead = (id) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const handleMarkAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })))
  }

  const filtered = filter === "todas" ? notifs : filter === "no-leidas" ? notifs.filter((n) => !n.leida) : notifs

  return (
    <div className="notificaciones-container">
      <Sidebar activeItem="notificaciones" userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="notificaciones-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>🔔 Notificaciones</h1>
            <p>Mantente al día con las novedades del sistema</p>
          </div>
          {pendientes > 0 && (
            <button className="btn-ghost" onClick={handleMarkAllRead}>
              ✅ Marcar todas como leídas
            </button>
          )}
        </header>

        <section className="filters-bar">
          <div className="filter-group">
            <label>Filtrar</label>
            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="todas">Todas</option>
              <option value="no-leidas">No leídas ({pendientes})</option>
            </select>
          </div>
        </section>

        <section className="notifs-list">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${n.leida ? "leida" : "no-leida"}`}
              onClick={() => handleMarkRead(n.id)}
            >
              <span className="notif-icon">{tipoIcon[n.tipo]}</span>
              <div className="notif-content">
                <span className="notif-message">{n.mensaje}</span>
                <span className="notif-time">{n.tiempo}</span>
              </div>
              {!n.leida && <span className="notif-dot" />}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <span className="empty-state-icon">🔔</span>
              <p>No hay notificaciones pendientes</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Notificaciones
