import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiPut } from "../services/api"
import "../styles/Configuracion.css"
import Sidebar from "../components/Sidebar"

function Configuracion() {
  const { user } = useAuth()
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "")
      setCorreo(user.correo || "")
    }
  }, [user])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMsg("")

    try {
      // Actualizar datos del usuario
      await apiPut(`/api/usuarios/${user.id}`, { nombre, correo })

      // Si se ingresó una nueva contraseña, actualizarla por separado
      if (contrasena.trim()) {
        await apiPut(`/api/usuarios/${user.id}/password`, { contrasena })
      }

      setMsg("Perfil actualizado exitosamente")
      setContrasena("")
    } catch (err) {
      setMsg("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="configuracion-container">
      <Sidebar activeItem="configuracion" userName={user?.nombre} userRole={user?.rol} userInitial={user?.nombre?.[0] || "U"} />
      <main className="configuracion-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Configuración</h1>
            <p>Personaliza el comportamiento del sistema según tus necesidades</p>
          </div>
        </header>

        <section className="config-section">
          <h2>Mi perfil</h2>
          <div className="config-card">
            {msg && <p style={{ padding: "0 1rem", color: msg.startsWith("Error") ? "#f87171" : "#34d399" }}>{msg}</p>}
            <form onSubmit={handleSaveProfile}>
              <div className="profile-form">
                <div className="input-group">
                  <input
                    id="cfg-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                  <label htmlFor="cfg-nombre">Nombre completo</label>
                </div>
                <div className="input-group">
                  <input
                    id="cfg-email"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                  <label htmlFor="cfg-email">Correo electrónico</label>
                </div>
                <div className="input-group">
                  <input
                    id="cfg-password"
                    type="password"
                    placeholder="Dejar vacío para no cambiar"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                  <label htmlFor="cfg-password">Nueva contraseña</label>
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Configuracion
