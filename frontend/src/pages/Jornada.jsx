import { useState, useEffect } from "react"

import { apiGet } from "../services/api"
import "../styles/Jornada.css"
import Sidebar from "../components/Sidebar"

function Jornada() {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await apiGet('/api/registros')
        setRegistros(data)
      } catch (err) {
        console.error('Error cargando registros:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const mapEstado = (nombreEstado) => {
    const map = {
      "Pendiente":   "pendiente",
      "En Progreso": "activo",
      "Completada":  "completado",
      "Aprobada":    "completado",
      "Cancelada":   "rechazado",
      "Rechazada":   "rechazado",
    }
    return map[nombreEstado] || "pendiente"
  }

  return (
    <div className="jornada-container">
      <Sidebar />
      <main className="jornada-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Turnos</h1>
            <p>Gestión de jornadas laborales y horarios de empleados</p>
          </div>
        </header>

        <section className="table-section">
          {loading ? (
            <p>Cargando registros...</p>
          ) : registros.length === 0 ? (
            <p>No hay registros de jornada</p>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Turno</th>
                  <th>Fecha</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Horas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((r) => (
                  <tr key={r.id_registro}>
                    <td>{r.usuario}</td>
                    <td><span className="turno-tag">{r.nombre_turno}</span></td>
                    <td>{r.fecha}</td>
                    <td>{r.hora_entrada}</td>
                    <td>{r.hora_salida || "---"}</td>
                    <td>{r.total_horas ? `${r.total_horas}h` : "---"}</td>
                    <td>
                      <span className={`status-badge ${mapEstado(r.nombre_estado)}`}>
                        <span className="status-dot" />
                        {r.nombre_estado}
                      </span>
                    </td>
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

export default Jornada
