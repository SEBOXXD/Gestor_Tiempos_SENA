import { useState } from "react"
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

const actividadesHoy = [
  { id: 1, hora: "07:00", titulo: "Apertura de planta", descripcion: "Revisión de equipos e inicio de línea de producción A.", tipo: "Producción", estado: "completada" },
  { id: 2, hora: "09:30", titulo: "Control de calidad — lote #0421", descripcion: "Verificar estándares del lote matutino antes del despacho.", tipo: "Calidad", estado: "en-curso" },
  { id: 3, hora: "11:00", titulo: "Reunión de equipo semanal", descripcion: "Revisión de metas y ajuste de turnos para la próxima semana.", tipo: "Administrativa", estado: "pendiente" },
  { id: 4, hora: "14:00", titulo: "Mantenimiento preventivo — máquina 3", descripcion: "Lubricación y ajuste de correas según plan de mantenimiento.", tipo: "Mantenimiento", estado: "pendiente" },
  { id: 5, hora: "16:30", titulo: "Cierre de turno", descripcion: "Reporte de producción y entrega al turno de noche.", tipo: "Producción", estado: "pendiente" },
]

const checklistInicial = [
  { id: 1, titulo: "Revisar correos del turno anterior",    sub: "Bandeja de entrada",          completado: true  },
  { id: 2, titulo: "Registrar inicio de turno en el sistema", sub: "CHRONOS → Turnos",           completado: true  },
  { id: 3, titulo: "Verificar EPP del personal",            sub: "Lista de seguridad",          completado: false },
  { id: 4, titulo: "Confirmar asistencia del equipo",       sub: "5 personas asignadas",        completado: false },
  { id: 5, titulo: "Completar control de calidad AM",       sub: "Formato F-QA-021",            completado: false },
  { id: 6, titulo: "Enviar reporte de producción",          sub: "Antes de las 5:00 PM",        completado: false },
]

const estadoLabel = {
  completada: "Completada",
  "en-curso":  "En curso",
  pendiente:   "Pendiente",
}

function Inicio() {
  const [checklist, setChecklist] = useState(checklistInicial)

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completado: !item.completado } : item
      )
    )
  }

  const totalCheck     = checklist.length
  const completosCheck = checklist.filter((item) => item.completado).length
  const porcentaje     = Math.round((completosCheck / totalCheck) * 100)
  const totalHoy       = actividadesHoy.length
  const completadasHoy = actividadesHoy.filter((a) => a.estado === "completada").length
  const enCursoHoy     = actividadesHoy.filter((a) => a.estado === "en-curso").length

  return (
    <div className="inicio-container">
      <Sidebar userName="María López" userRole="Operaria" userInitial="M" />
      <main className="inicio-main">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>{obtenerSaludo()}, <span>María</span> 👋</h1>
            <p>{obtenerFechaFormateada().charAt(0).toUpperCase() + obtenerFechaFormateada().slice(1)}</p>
          </div>
          <div className="turno-badge">
            <span className="turno-badge-label">Turno activo</span>
            <span className="turno-badge-value">☀️ Mañana — 07:00 a 15:00</span>
            <span className="turno-horas">Llevas 4h 32m trabajadas</span>
          </div>
        </div>

        <div className="kpi-row">
          <div className="kpi-mini">
            <span className="kpi-mini-icon">📋</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{totalHoy}</span>
              <span className="kpi-mini-label">Actividades hoy</span>
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
          <div className="kpi-mini">
            <span className="kpi-mini-icon">🎯</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{porcentaje}%</span>
              <span className="kpi-mini-label">Checklist completo</span>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>📅 Actividades asignadas hoy</h2>
              <span className="panel-badge">{completadasHoy}/{totalHoy} completadas</span>
            </div>
            {actividadesHoy.map((actividad, index) => (
              <div className="actividad-card" key={actividad.id}>
                <div className="actividad-tiempo">
                  <span className="actividad-hora">{actividad.hora}</span>
                  <div className="actividad-dot" />
                  {index < actividadesHoy.length - 1 && <div className="actividad-line" />}
                </div>
                <div className="actividad-info">
                  <span className="actividad-titulo">{actividad.titulo}</span>
                  <span className="actividad-desc">{actividad.descripcion}</span>
                  <div className="actividad-footer">
                    <span className="actividad-tipo">{actividad.tipo}</span>
                    <span className={`status-badge ${actividad.estado}`}>
                      <span className="status-dot" />
                      {estadoLabel[actividad.estado]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>☑️ Lista de chequeo</h2>
              <span className="panel-badge">{completosCheck}/{totalCheck}</span>
            </div>
            <div className="progreso-wrapper">
              <div className="progreso-texto">
                <span>Progreso del turno</span>
                <span>{porcentaje}%</span>
              </div>
              <div className="progreso-bar-bg">
                <div className="progreso-bar-fill" style={{ width: `${porcentaje}%` }} />
              </div>
            </div>
            <div className="checklist">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`check-item ${item.completado ? "checked" : ""}`}
                  onClick={() => toggleCheck(item.id)}
                >
                  <div className="checkbox-box">
                    {item.completado && <span className="checkbox-check">✓</span>}
                  </div>
                  <div className="check-label">
                    <span className="check-title">{item.titulo}</span>
                    <span className="check-sub">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Inicio
