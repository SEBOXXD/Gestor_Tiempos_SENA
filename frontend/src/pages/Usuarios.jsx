import { useState } from "react"
import "../styles/Usuarios.css"
import Sidebar from "../components/Sidebar"

const initialUsers = [
  { id: 1, nombre: "Ana García", email: "ana@empresa.com", rol: "Supervisora", sede: "Sede A", estado: "activo" },
  { id: 2, nombre: "Luis Martínez", email: "luis@empresa.com", rol: "Operario", sede: "Sede B", estado: "activo" },
  { id: 3, nombre: "Carla Pérez", email: "carla@empresa.com", rol: "Operaria", sede: "Sede A", estado: "activo" },
  { id: 4, nombre: "Juan Rojas", email: "juan@empresa.com", rol: "Operario", sede: "Sede C", estado: "inactivo" },
  { id: 5, nombre: "Sofía Vargas", email: "sofia@empresa.com", rol: "Supervisora", sede: "Sede B", estado: "activo" },
  { id: 6, nombre: "Miguel Torres", email: "miguel@empresa.com", rol: "Administrador", sede: "Sede A", estado: "activo" },
]

const rolColors = {
  Administrador: { bg: "rgba(44, 156, 156, 0.15)", color: "#2c9c9c" },
  Supervisora: { bg: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" },
  Supervisor: { bg: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" },
  Operario: { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24" },
  Operaria: { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24" },
}

function Usuarios() {
  const [users] = useState(initialUsers)
  const [search, setSearch] = useState("")

  const filtered = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="usuarios-container">
      <Sidebar activeItem="usuarios" userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="usuarios-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>👥 Usuarios</h1>
            <p>Gestión de empleados, supervisores y administradores del sistema</p>
          </div>
          <button className="btn-primary">+ Nuevo usuario</button>
        </header>

        <section className="filters-bar">
          <div className="filter-group">
            <label>Buscar</label>
            <input
              className="filter-input"
              placeholder="Nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Rol</label>
            <select className="filter-select">
              <option>Todos</option>
              <option>Administrador</option>
              <option>Supervisor</option>
              <option>Operario</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Estado</label>
            <select className="filter-select">
              <option>Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          <button className="btn-filter">Filtrar</button>
        </section>

        <section className="table-section">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Sede</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td><span className="user-name-cell">{user.nombre}</span></td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className="rol-badge"
                      style={rolColors[user.rol] || { bg: "transparent", color: "#fff" }}
                    >
                      {user.rol}
                    </span>
                  </td>
                  <td>{user.sede}</td>
                  <td>
                    <span className={`status-badge ${user.estado}`}>
                      <span className="status-dot" />
                      {user.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Editar">✏️</button>
                      <button className="btn-icon" title="Desactivar">🚫</button>
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

export default Usuarios
