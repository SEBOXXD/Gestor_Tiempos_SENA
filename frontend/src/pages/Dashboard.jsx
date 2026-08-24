import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiGet } from "../services/api"
import "../styles/Dashboard.css"
import Sidebar from "../components/Sidebar"

const estadoLabel = {
  "Pendiente":    { css: "pendiente",  label: "Pendiente" },
  "En Progreso":  { css: "en-curso",   label: "En Progreso" },
  "Completada":   { css: "completada", label: "Completada" },
  "Aprobada":     { css: "completada", label: "Aprobada" },
  "Cancelada":    { css: "rechazado",  label: "Cancelada" },
  "Rechazada":    { css: "rechazado",  label: "Rechazada" },
}

function Dashboard() {
  const { user } = useAuth()
  const [resumen, setResumen] = useState(null)
  const [recientes, setRecientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const [r, a] = await Promise.all([
          apiGet('/api/dashboard/resumen'),
          apiGet('/api/dashboard/recientes')
        ])
        setResumen(r)
        setRecientes(a)
      } catch (err) {
        console.error('Error cargando dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const kpiCards = resumen ? [
    { icon: "⏱️", label: "Horas totales",      value: resumen.horas_totales || "0" },
    { icon: "👥", label: "Usuarios activos",   value: resumen.usuarios_activos || "0" },
    { icon: "📋", label: "Actividades",        value: resumen.total_actividades || "0" },
    { icon: "🔔", label: "Registros",          value: resumen.total_registros || "0" },
  ] : []

  return (
    <div className="dashboard-container">
      <Sidebar activeItem="/dashboard" userName={user?.nombre} userRole={user?.rol} userInitial={user?.nombre?.[0] || "U"} />
      <main className="main-content">
        <header className="header">
          <h1>Dashboard</h1>
          <div className="user-info">Bienvenido, {user?.nombre}</div>
        </header>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <section className="cards">
              {kpiCards.map((card, index) => (
                <div className="card" key={index}>
                  <span className="card-icon">{card.icon}</span>
                  <p className="card-value">{card.value}</p>
                  <h3 className="card-label">{card.label}</h3>
                </div>
              ))}
            </section>

            <section className="table-section">
              <h2>Actividades recientes</h2>
              {recientes.length === 0 ? (
                <p>No hay actividades recientes</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Tarea</th>
                      <th>Estado</th>
                      <th>Fecha límite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map((act) => {
                      const st = estadoLabel[act.nombre_estado] || { css: "pendiente", label: act.nombre_estado }
                      return (
                        <tr key={act.id_actividad}>
                          <td>{act.nombre}</td>
                          <td>
                            <span className={`status-badge ${st.css}`}>
                              <span className="status-dot" />
                              {st.label}
                            </span>
                          </td>
                          <td>{act.fecha_limite}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
