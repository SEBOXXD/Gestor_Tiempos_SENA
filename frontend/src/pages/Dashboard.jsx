import "../styles/Dashboard.css"
import Sidebar from "../components/Sidebar"

const kpiCards = [
  { icon: "⏱️", label: "Horas esta semana", value: "42" },
  { icon: "✅", label: "Turnos completados", value: "8"  },
  { icon: "📋", label: "Actividades activas", value: "5" },
  { icon: "🔔", label: "Notificaciones",      value: "3" },
]

const actividadesRecientes = [
  { tarea: "Diseño pantalla Login",    estado: "Completado", fecha: "Hoy"      },
  { tarea: "Crear Dashboard base",     estado: "En progreso", fecha: "Hoy"     },
  { tarea: "Módulo de Reportes",       estado: "Completado", fecha: "Ayer"     },
  { tarea: "Aprobación de turnos",     estado: "Pendiente",  fecha: "Mañana"   },
  { tarea: "Configuración del sistema",estado: "Pendiente",  fecha: "Esta sem."},
]

const estadoLabel = {
  "Completado":  { css: "completada", label: "Completado" },
  "En progreso": { css: "en-curso",   label: "En progreso" },
  "Pendiente":   { css: "pendiente",  label: "Pendiente" },
}

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="main-content">
        <header className="header">
          <h1>Dashboard</h1>
          <div className="user-info">🌟 Bienvenido, Admin</div>
        </header>

        <section className="cards">
          {kpiCards.map((card, index) => (
            <div className="card" key={index}>
              <span className="card-icon">{card.icon}</span>
              <p className="card-value">{card.value}</p>
              <h3 className="card-label">{card.label}</h3>
            </div>
          ))}
        </section>

        <section className="table-section">
          <h2>Actividades recientes</h2>
          <table>
            <thead>
              <tr>
                <th>Tarea</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {actividadesRecientes.map((act, index) => {
                const st = estadoLabel[act.estado] || { css: "pendiente", label: act.estado }
                return (
                  <tr key={index}>
                    <td>{act.tarea}</td>
                    <td>
                      <span className={`status-badge ${st.css}`}>
                        <span className="status-dot" />
                        {st.label}
                      </span>
                    </td>
                    <td>{act.fecha}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
