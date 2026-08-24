import { useState, useEffect } from "react"

import { apiGet } from "../services/api"
import "../styles/Usuarios.css"
import Sidebar from "../components/Sidebar"

const rolColors = {
  Administrador: { bg: "rgba(44, 156, 156, 0.15)", color: "#2c9c9c" },
  Supervisor:    { bg: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" },
  Operario:      { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24" },
}

function Usuarios() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const data = await apiGet('/api/usuarios')
        setUsers(data)
      } catch (err) {
        console.error('Error cargando usuarios:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const filtered = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="usuarios-container">
      <Sidebar />
      <main className="usuarios-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Usuarios</h1>
            <p>Gestión de empleados, supervisores y administradores del sistema</p>
          </div>
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
        </section>

        <section className="table-section">
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Sede</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id_usuario}>
                    <td><span className="user-name-cell">{u.nombre}</span></td>
                    <td>{u.correo}</td>
                    <td>
                      <span
                        className="rol-badge"
                        style={rolColors[u.nombre_rol] || { bg: "transparent", color: "#fff" }}
                      >
                        {u.nombre_rol}
                      </span>
                    </td>
                    <td>{u.sede}</td>
                    <td>
                      <span className={`status-badge ${u.estado_usuario ? "activo" : "inactivo"}`}>
                        <span className="status-dot" />
                        {u.estado_usuario ? "Activo" : "Inactivo"}
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

export default Usuarios
