import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiGet, apiPost } from "../services/api"
import "../styles/Inicio.css"
import Sidebar from "../components/Sidebar"

function obtenerSaludo() {
  const hora = new Date().getHours()
  if (hora < 12) return "Buenos días"
  if (hora < 18) return "Buenas tardes"
  return "Buenas noches"
}

function obtenerFechaFormateada() {
  return new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const estadoLabel = {
  "Pendiente":   "Pendiente",
  "En Progreso": "En curso",
  "Completada":  "Completada",
  "Aprobada":    "Completada",
}

function Inicio() {
  const { user } = useAuth()
  const [actividades, setActividades] = useState([])
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const [acts, regs] = await Promise.all([
          apiGet('/api/actividades'),
          apiGet(`/api/registros/usuario/${user.id}`)
        ])
        setActividades(acts.slice(0, 5))
        setRegistros(regs)
      } catch (err) {
        console.error('Error cargando datos:', err)
      } finally {
        setLoading(false)
      }
    }
    if (user?.id) cargar()
  }, [user])

  const totalHoy = actividades.length
  const completadasHoy = actividades.filter((a) => a.nombre_estado === "Completada" || a.nombre_estado === "Aprobada").length
  const enCursoHoy = actividades.filter((a) => a.nombre_estado === "En Progreso").length

  // Calcular horas trabajadas del último registro
  const ultimoRegistro = registros[0]
  const horasTrabajadas = ultimoRegistro?.total_horas ? `${ultimoRegistro.total_horas}h` : "0h"

  return (
    <div className="inicio-container">
      <Sidebar userName={user?.nombre} userRole={user?.rol} userInitial={user?.nombre?.[0] || "U"} />
      <main className="inicio-main">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>{obtenerSaludo()}, <span>{user?.nombre?.split(" ")[0]}</span></h1>
            <p>{obtenerFechaFormateada().charAt(0).toUpperCase() + obtenerFechaFormateada().slice(1)}</p>
          </div>
          <div className="turno-badge">
            <span className="turno-badge-label">Último registro</span>
            <span className="turno-badge-value">{ultimoRegistro?.nombre_turno || "Sin registro"}</span>
            <span className="turno-horas">Horas trabajadas: {horasTrabajadas}</span>
          </div>
        </div>

        <div className="kpi-row">
          <div className="kpi-mini">
            <span className="kpi-mini-icon">📋</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{totalHoy}</span>
              <span className="kpi-mini-label">Actividades</span>
            </div>
          </div>
          <div className="kpi-mini">
            <span className="kpi-mini-icon">✅</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{completadasHoy}</span>
              <span className="kpi-mini-label">Completadas</span>
            </div>
          </div>
          <div className="kpi-mini">
            <span className="kpi-mini-icon">⚡</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{enCursoHoy}</span>
              <span className="kpi-mini-label">En curso</span>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Actividades asignadas</h2>
              <span className="panel-badge">{completadasHoy}/{totalHoy} completadas</span>
            </div>
            {loading ? (
              <p style={{ padding: "1rem" }}>Cargando actividades...</p>
            ) : actividades.length === 0 ? (
              <p style={{ padding: "1rem" }}>No hay actividades asignadas</p>
            ) : (
              actividades.map((actividad, index) => (
                <div className="actividad-card" key={actividad.id_actividad}>
                  <div className="actividad-tiempo">
                    <span className="actividad-hora">{actividad.fecha_limite}</span>
                    <div className="actividad-dot" />
                    {index < actividades.length - 1 && <div className="actividad-line" />}
                  </div>
                  <div className="actividad-info">
                    <span className="actividad-titulo">{actividad.nombre}</span>
                    <span className="actividad-desc">{actividad.descripcion}</span>
                    <div className="actividad-footer">
                      <span className={`status-badge ${actividad.nombre_estado === "Completada" || actividad.nombre_estado === "Aprobada" ? "completada" : actividad.nombre_estado === "En Progreso" ? "en-curso" : "pendiente"}`}>
                        <span className="status-dot" />
                        {estadoLabel[actividad.nombre_estado] || actividad.nombre_estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Inicio
