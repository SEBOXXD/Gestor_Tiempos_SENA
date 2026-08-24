import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiGet } from "../services/api"
import "../styles/Reportes.css"
import Sidebar from "../components/Sidebar"

function Reportes() {
  const { user } = useAuth()
  const [resumen, setResumen] = useState(null)
  const [horasPorUsuario, setHorasPorUsuario] = useState([])
  const [turnosData, setTurnosData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const [r, h, t] = await Promise.all([
          apiGet('/api/dashboard/resumen'),
          apiGet('/api/dashboard/horas'),
          apiGet('/api/dashboard/turnos')
        ])
        setResumen(r)
        setHorasPorUsuario(h)
        setTurnosData(t)
      } catch (err) {
        console.error('Error cargando reportes:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const kpiData = resumen ? [
    { icon: "⏱️", value: resumen.horas_totales || "0",    label: "Horas registradas" },
    { icon: "👥", value: resumen.usuarios_activos || "0", label: "Empleados activos" },
    { icon: "✅", value: resumen.total_aprobaciones || "0", label: "Aprobaciones" },
    { icon: "📋", value: resumen.total_actividades || "0", label: "Actividades" },
  ] : []

  return (
    <div className="reportes-container">
      <Sidebar activeItem="/dashboard" userName={user?.nombre} userRole={user?.rol} userInitial={user?.nombre?.[0] || "U"} />
      <main className="reportes-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Reportes</h1>
            <p>Resumen de turnos, horas y actividades del periodo actual</p>
          </div>
        </header>

        {loading ? (
          <p>Cargando reportes...</p>
        ) : (
          <>
            <section className="kpi-grid">
              {kpiData.map((kpi, index) => (
                <div className="kpi-card" key={index}>
                  <span className="kpi-icon">{kpi.icon}</span>
                  <span className="kpi-value">{kpi.value}</span>
                  <span className="kpi-label">{kpi.label}</span>
                </div>
              ))}
            </section>

            <section className="charts-grid">
              <div className="chart-card">
                <div className="chart-card-header">
                  <h3>Horas por turno</h3>
                </div>
                <div className="bar-chart">
                  {turnosData.map((t, index) => (
                    <div className="bar-group" key={index}>
                      <div className="bar" style={{ height: `${Math.max(20, (parseFloat(t.total_horas) / 10) * 100)}px` }} title={`${t.nombre_turno}: ${t.total_horas}h`} />
                      <span className="bar-label">{t.nombre_turno}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-card-header">
                  <h3>Horas por empleado</h3>
                </div>
                <div style={{ padding: "1rem" }}>
                  {horasPorUsuario.length === 0 ? (
                    <p>No hay datos de horas</p>
                  ) : (
                    horasPorUsuario.map((u, index) => (
                      <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <span>{u.nombre}</span>
                        <span style={{ color: "#a7d7d7" }}>{u.total_horas}h</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Reportes
