import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiGet, apiPut } from "../services/api"
import "../styles/Notificaciones.css"
import Sidebar from "../components/Sidebar"

function Notificaciones() {
  const { user } = useAuth()
  const [notifs, setNotifs] = useState([])
  const [filter, setFilter] = useState("todas")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) cargar()
  }, [user])

  async function cargar() {
    try {
      const data = await apiGet(`/api/notificaciones/usuario/${user.id}`)
      setNotifs(data)
    } catch (err) {
      console.error('Error cargando notificaciones:', err)
    } finally {
      setLoading(false)
    }
  }

  const pendientes = notifs.filter((n) => !n.leida).length

  async function handleMarkRead(id) {
    try {
      await apiPut(`/api/notificaciones/leer/${id}`)
      setNotifs((prev) => prev.map((n) => (n.id_notificacion === id ? { ...n, leida: 1 } : n)))
    } catch (err) {
      console.error('Error marcando notificación:', err)
    }
  }

  async function handleMarkAllRead() {
    try {
      await apiPut(`/api/notificaciones/leer-todas/${user.id}`)
      setNotifs((prev) => prev.map((n) => ({ ...n, leida: 1 })))
    } catch (err) {
      console.error('Error marcando notificaciones:', err)
    }
  }

  const filtered = filter === "todas" ? notifs : notifs.filter((n) => !n.leida)

  return (
    <div className="notificaciones-container">
      <Sidebar />
      <main className="notificaciones-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Notificaciones</h1>
            <p>Mantente al día con las novedades del sistema</p>
          </div>
          {pendientes > 0 && (
            <button className="btn-ghost" onClick={handleMarkAllRead}>
              Marcar todas como leídas
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
          {loading ? (
            <p>Cargando notificaciones...</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🔔</span>
              <p>No hay notificaciones pendientes</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id_notificacion}
                className={`notif-item ${n.leida ? "leida" : "no-leida"}`}
                onClick={() => !n.leida && handleMarkRead(n.id_notificacion)}
              >
                <span className="notif-icon">🔔</span>
                <div className="notif-content">
                  <span className="notif-message">{n.titulo}: {n.mensaje}</span>
                  <span className="notif-time">{n.fecha}</span>
                </div>
                {!n.leida && <span className="notif-dot" />}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default Notificaciones
