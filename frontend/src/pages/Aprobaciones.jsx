import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiGet, apiPost } from "../services/api"
import "../styles/Aprobaciones.css"
import Sidebar from "../components/Sidebar"

function Aprobaciones() {
  const { user } = useAuth()
  const [pendientes, setPendientes] = useState([])
  const [aprobadas, setAprobadas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    try {
      const [p, a] = await Promise.all([
        apiGet('/api/aprobaciones/pendientes'),
        apiGet('/api/aprobaciones')
      ])
      setPendientes(p)
      // Filtrar aprobaciones que ya tienen resultado (historial)
      setAprobadas(a.filter(ap => ap.resultado))
    } catch (err) {
      console.error('Error cargando aprobaciones:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAprobar(id_registro) {
    try {
      await apiPost('/api/aprobaciones', {
        id_registro,
        id_supervisor: user.id,
        nivel_aprobacion: 1,
        resultado: "Aprobado",
        observaciones: "Aprobado desde el dashboard"
      })
      cargar()
    } catch (err) {
      console.error('Error al aprobar:', err)
    }
  }

  async function handleRechazar(id_registro) {
    try {
      await apiPost('/api/aprobaciones', {
        id_registro,
        id_supervisor: user.id,
        nivel_aprobacion: 1,
        resultado: "Rechazado",
        observaciones: "Rechazado desde el dashboard"
      })
      cargar()
    } catch (err) {
      console.error('Error al rechazar:', err)
    }
  }

  return (
    <div className="aprobaciones-container">
      <Sidebar />
      <main className="aprobaciones-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Aprobaciones</h1>
            <p>Revisa y aprueba los registros de turnos de los empleados</p>
          </div>
        </header>

        <section className="aprobaciones-stats">
          <div className="stat-card">
            <span className="stat-card-icon">⏳</span>
            <span className="stat-card-value">{pendientes.length}</span>
            <span className="stat-card-label">Pendientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">✅</span>
            <span className="stat-card-value">{aprobadas.filter(a => a.resultado === "Aprobado").length}</span>
            <span className="stat-card-label">Aprobados</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">❌</span>
            <span className="stat-card-value">{aprobadas.filter(a => a.resultado === "Rechazado").length}</span>
            <span className="stat-card-label">Rechazados</span>
          </div>
        </section>

        {loading ? (
          <p>Cargando aprobaciones...</p>
        ) : (
          <>
            {pendientes.length > 0 && (
              <section className="table-section">
                <h2 className="section-title">Pendientes de revisión</h2>
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Empleado</th>
                      <th>Turno</th>
                      <th>Fecha</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendientes.map((a) => (
                      <tr key={a.id_registro}>
                        <td>{a.empleado}</td>
                        <td><span className="turno-tag">{a.nombre_turno}</span></td>
                        <td>{a.fecha}</td>
                        <td>{a.hora_entrada}</td>
                        <td>{a.hora_salida || "---"}</td>
                        <td>
                          <div className="action-btns" style={{ gap: "8px" }}>
                            <button className="btn-approve" onClick={() => handleAprobar(a.id_registro)}>Aprobar</button>
                            <button className="btn-reject" onClick={() => handleRechazar(a.id_registro)}>Rechazar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {aprobadas.length > 0 && (
              <section className="table-section">
                <h2 className="section-title">Historial de aprobaciones</h2>
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Empleado</th>
                      <th>Supervisor</th>
                      <th>Fecha</th>
                      <th>Horas</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aprobadas.map((a) => (
                      <tr key={a.id_aprobacion}>
                        <td>{a.empleado}</td>
                        <td>{a.supervisor}</td>
                        <td>{a.fecha}</td>
                        <td>{a.total_horas ? `${a.total_horas}h` : "---"}</td>
                        <td>
                          <span className={`status-badge ${a.resultado === "Aprobado" ? "aprobado" : "rechazado"}`}>
                            <span className="status-dot" />
                            {a.resultado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Aprobaciones
