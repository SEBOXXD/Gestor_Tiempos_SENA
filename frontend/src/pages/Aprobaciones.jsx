import { useState } from "react"
import "../styles/Aprobaciones.css"
import Sidebar from "../components/Sidebar"

const initialAprobaciones = [
  { id: 1, empleado: "Luis Martínez", turno: "Tarde", fecha: "06/07/2026", entrada: "15:02", salida: "23:10", horas: "8h 08m", estado: "pendiente" },
  { id: 2, empleado: "Carla Pérez", turno: "Mañana", fecha: "06/07/2026", entrada: "07:00", salida: "15:05", horas: "8h 05m", estado: "pendiente" },
  { id: 3, empleado: "Juan Rojas", turno: "Noche", fecha: "05/07/2026", entrada: "22:55", salida: "07:02", horas: "8h 07m", estado: "aprobado" },
  { id: 4, empleado: "Sofía Vargas", turno: "Tarde", fecha: "05/07/2026", entrada: "15:10", salida: "23:00", horas: "7h 50m", estado: "rechazado" },
  { id: 5, empleado: "Miguel Torres", turno: "Mañana", fecha: "06/07/2026", entrada: "06:58", salida: "15:00", horas: "8h 02m", estado: "pendiente" },
]

function Aprobaciones() {
  const [aprobaciones, setAprobaciones] = useState(initialAprobaciones)

  const handleAprobar = (id) => {
    setAprobaciones((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: "aprobado" } : a))
    )
  }

  const handleRechazar = (id) => {
    setAprobaciones((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: "rechazado" } : a))
    )
  }

  const pendientes = aprobaciones.filter((a) => a.estado === "pendiente")
  const historial = aprobaciones.filter((a) => a.estado !== "pendiente")

  return (
    <div className="aprobaciones-container">
      <Sidebar activeItem="aprobaciones" userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="aprobaciones-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>✅ Aprobaciones</h1>
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
            <span className="stat-card-value">{aprobaciones.filter((a) => a.estado === "aprobado").length}</span>
            <span className="stat-card-label">Aprobados</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">❌</span>
            <span className="stat-card-value">{aprobaciones.filter((a) => a.estado === "rechazado").length}</span>
            <span className="stat-card-label">Rechazados</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">📋</span>
            <span className="stat-card-value">{aprobaciones.length}</span>
            <span className="stat-card-label">Totales</span>
          </div>
        </section>

        {pendientes.length > 0 && (
          <section className="table-section">
            <h2 className="section-title">⏳ Pendientes de revisión</h2>
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Turno</th>
                  <th>Fecha</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Horas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((a) => (
                  <tr key={a.id}>
                    <td>{a.empleado}</td>
                    <td><span className="turno-tag">{a.turno}</span></td>
                    <td>{a.fecha}</td>
                    <td>{a.entrada}</td>
                    <td>{a.salida}</td>
                    <td>{a.horas}</td>
                    <td>
                      <div className="action-btns" style={{ gap: "8px" }}>
                        <button className="btn-approve" onClick={() => handleAprobar(a.id)}>✅ Aprobar</button>
                        <button className="btn-reject" onClick={() => handleRechazar(a.id)}>❌ Rechazar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="table-section">
          <h2 className="section-title">📜 Historial de aprobaciones</h2>
          <table className="reports-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Turno</th>
                <th>Fecha</th>
                <th>Horas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((a) => (
                <tr key={a.id}>
                  <td>{a.empleado}</td>
                  <td><span className="turno-tag">{a.turno}</span></td>
                  <td>{a.fecha}</td>
                  <td>{a.horas}</td>
                  <td>
                    <span className={`status-badge ${a.estado}`}>
                      <span className="status-dot" />
                      {a.estado === "aprobado" ? "Aprobado" : "Rechazado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default Aprobaciones
