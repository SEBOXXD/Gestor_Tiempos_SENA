import { useNavigate, useLocation } from "react-router-dom"

const menuSections = [
  {
    label: "Principal",
    items: [
      { icon: "🏠", label: "Inicio", path: "/inicio" },
      { icon: "👥", label: "Usuarios", path: "/usuarios" },
      { icon: "🕐", label: "Turnos", path: "/jornada" },
      { icon: "✅", label: "Aprobaciones", path: "/aprobaciones" },
      { icon: "📋", label: "Actividades", path: "/actividades" },
    ],
  },
  {
    label: "Análisis",
    items: [
      { icon: "📊", label: "Reportes", path: "/reportes" },
      { icon: "🔔", label: "Notificaciones", path: "/notificaciones" },
      { icon: "🕵️", label: "Auditoría", path: "/auditoria" },
    ],
  },
]

function Sidebar({ userName = "Admin", userRole = "Administrador", userInitial = "A" }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">CHRONOS</div>
      <div className="sidebar-subtitle">Gestión de tiempos</div>

      {menuSections.map((section) => (
        <div key={section.label}>
          <span className="sidebar-section-label">{section.label}</span>
          {section.items.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-spacer" />

      <div className="nav-item" onClick={() => navigate("/configuracion")}>
        <span className="nav-icon">⚙️</span> Configuración
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{userInitial}</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{userName}</span>
          <span className="sidebar-user-role">{userRole}</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
