import { useState } from "react"
import "../styles/Jornada.css"
import Sidebar from "../components/Sidebar"

const turnosData = [
  { id: 1, empleado: "Ana García", turno: "Mañana", entrada: "07:00", salida: "15:00", sede: "Sede A", estado: "activo" },
  { id: 2, empleado: "Luis Martínez", turno: "Tarde", entrada: "15:00", salida: "23:00", sede: "Sede B", estado: "activo" },
  { id: 3, empleado: "Carla Pérez", turno: "Mañana", entrada: "07:00", salida: "15:00", sede: "Sede A", estado: "completado" },
  { id: 4, empleado: "Juan Rojas", turno: "Noche", entrada: "23:00", salida: "07:00", sede: "Sede C", estado: "activo" },
  { id: 5, empleado: "Sofía Vargas", turno: "Tarde", entrada: "15:00", salida: "23:00", sede: "Sede B", estado: "pendiente" },
  { id: 6, empleado: "Miguel Torres", turno: "Mañana", entrada: "07:00", salida: "15:00", sede: "Sede A", estado: "activo" },
  { id: 7, empleado: "María López", turno: "Mañana", entrada: "07:00", salida: "15:00", sede: "Sede B", estado: "completado" },
  { id: 8, empleado: "Carlos Ruiz", turno: "Noche", entrada: "23:00", salida: "07:00", sede: "Sede A", estado: "activo" },
]

function Jornada() {
  const [turnos] = useState(turnosData)

  return (
    <div className="jornada-container">
      <Sidebar activeItem="jornada" userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="jornada-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>🕐 Turnos</h1>
            <p>Gestión de jornadas laborales y horarios de empleados</p>
          </div>
          <button className="btn-primary">+ Asignar turno</button>
        </header>

        <section className="filters-bar">
          <div className="filter-group">
            <label>Turno</label>
            <select className="filter-select">
              <option>Todos</option>
              <option>Mañana</option>
              <option>Tarde</option>
              <option>Noche</option>
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
          <div className="filter-group">
            <label>Estado</label>
            <select className="filter-select">
              <option>Todos</option>
              <option>Activo</option>
              <option>Completado</option>
              <option>Pendiente</option>
            </select>
          </div>
          <button className="btn-filter">Filtrar</button>
        </section>

        <section className="table-section">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Turno</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Sede</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((t) => (
                <tr key={t.id}>
                  <td>{t.empleado}</td>
                  <td><span className="turno-tag">{t.turno}</span></td>
                  <td>{t.entrada}</td>
                  <td>{t.salida}</td>
                  <td>{t.sede}</td>
                  <td>
                    <span className={`status-badge ${t.estado}`}>
                      <span className="status-dot" />
                      {t.estado === "activo" ? "Activo" : t.estado === "completado" ? "Completado" : "Pendiente"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Editar">✏️</button>
                      <button className="btn-icon" title="Ver detalles">👁️</button>
                    </div>
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

export default Jornada
