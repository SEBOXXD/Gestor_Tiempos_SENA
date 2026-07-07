import { useState } from "react"
import "../styles/Auditoria.css"
import Sidebar from "../components/Sidebar"

const logsData = [
  { id: 1, usuario: "Miguel Torres", accion: "Aprobó turno", detalle: "Turno de Luis Martínez (Tarde)", fecha: "06/07/2026", hora: "15:30", ip: "192.168.1.10" },
  { id: 2, usuario: "Ana García", accion: "Registró entrada", detalle: "Turno Mañana - Sede A", fecha: "06/07/2026", hora: "06:58", ip: "192.168.1.22" },
  { id: 3, usuario: "Sofía Vargas", accion: "Rechazó turno", detalle: "Turno de Juan Rojas (Noche)", fecha: "05/07/2026", hora: "09:15", ip: "192.168.1.15" },
  { id: 4, usuario: "Admin", accion: "Creó usuario", detalle: "Nuevo operario: Carlos Ruiz", fecha: "05/07/2026", hora: "11:00", ip: "192.168.1.1" },
  { id: 5, usuario: "Carla Pérez", accion: "Completó actividad", detalle: "Control de calidad lote #0421", fecha: "06/07/2026", hora: "10:30", ip: "192.168.1.18" },
  { id: 6, usuario: "Admin", accion: "Modificó horario", detalle: "Turno de María López cambiado a Tarde", fecha: "04/07/2026", hora: "16:45", ip: "192.168.1.1" },
  { id: 7, usuario: "Miguel Torres", accion: "Exportó reporte", detalle: "Reporte semanal de producción", fecha: "06/07/2026", hora: "14:00", ip: "192.168.1.10" },
]

function Auditoria() {
  const [logs] = useState(logsData)

  return (
    <div className="auditoria-container">
      <Sidebar activeItem="auditoria" userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="auditoria-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>🕵️ Auditoría</h1>
            <p>Historial detallado de todas las acciones realizadas en el sistema</p>
          </div>
          <button className="btn-ghost">⬇️ Exportar logs</button>
        </header>

        <section className="filters-bar">
          <div className="filter-group">
            <label>Acción</label>
            <select className="filter-select">
              <option>Todas</option>
              <option>Aprobaciones</option>
              <option>Registros</option>
              <option>Usuarios</option>
              <option>Actividades</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Usuario</label>
            <select className="filter-select">
              <option>Todos</option>
              <option>Admin</option>
              <option>Miguel Torres</option>
              <option>Ana García</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Desde</label>
            <input className="filter-input" type="date" />
          </div>
          <div className="filter-group">
            <label>Hasta</label>
            <input className="filter-input" type="date" />
          </div>
          <button className="btn-filter">Filtrar</button>
        </section>

        <section className="table-section">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Detalle</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td><span className="user-name-cell">{log.usuario}</span></td>
                  <td><span className="accion-badge">{log.accion}</span></td>
                  <td>{log.detalle}</td>
                  <td>{log.fecha}</td>
                  <td>{log.hora}</td>
                  <td><code className="ip-code">{log.ip}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default Auditoria
