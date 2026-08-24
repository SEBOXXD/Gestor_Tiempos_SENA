import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiGet } from "../services/api"
import "../styles/Auditoria.css"
import Sidebar from "../components/Sidebar"

function Auditoria() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await apiGet('/api/historial')
        setLogs(data)
      } catch (err) {
        console.error('Error cargando historial:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return (
    <div className="auditoria-container">
      <Sidebar activeItem="auditoria" userName={user?.nombre} userRole={user?.rol} userInitial={user?.nombre?.[0] || "U"} />
      <main className="auditoria-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Auditoría</h1>
            <p>Historial detallado de todas las acciones realizadas en el sistema</p>
          </div>
        </header>

        <section className="table-section">
          {loading ? (
            <p>Cargando historial...</p>
          ) : logs.length === 0 ? (
            <p>No hay registros de auditoría</p>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id_historial}>
                    <td><span className="user-name-cell">{log.usuario}</span></td>
                    <td><span className="accion-badge">{log.accion}</span></td>
                    <td>{log.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}

export default Auditoria
