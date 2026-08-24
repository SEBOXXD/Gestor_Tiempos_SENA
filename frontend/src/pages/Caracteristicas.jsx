import { useNavigate } from "react-router-dom"
import Background from "../components/Background"
import "../styles/Caracteristicas.css"

const modulos = [
  {
    icon: "⏱️",
    title: "Control de turnos",
    desc:  "Registra entrada y salida de cada empleado con un solo clic. El sistema calcula automáticamente las horas trabajadas por turno.",
    details: ["Registro con un clic", "Cálculo automático de horas", "Turnos personalizables"],
  },
  {
    icon: "📋",
    title: "Gestión de actividades",
    desc:  "Crea, asigna y da seguimiento a las actividades diarias de cada miembro del equipo con estados en tiempo real.",
    details: ["Asignación por usuario", "Estados: pendiente, en progreso, completada", "Fechas límite y prioridades"],
  },
  {
    icon: "✅",
    title: "Aprobaciones",
    desc:  "Los supervisores revisan y aprueban registros y actividades antes de que se consoliden en los reportes.",
    details: ["Flujo de aprobación simple", "Comentarios en cada decisión", "Historial de decisiones"],
  },
  {
    icon: "📊",
    title: "Reportes automáticos",
    desc:  "Genera informes de horas trabajadas, productividad y asistencia listos para imprimir o exportar.",
    details: ["Horas por empleado y turno", "Resumen de actividades", "Exportación en un clic"],
  },
  {
    icon: "🔔",
    title: "Notificaciones",
    desc:  "Alertas automáticas para aprobaciones pendientes, turnos próximos y actividades sin completar.",
    details: ["Alertas en tiempo real", "Marcado como leído", "Historial de notificaciones"],
  },
  {
    icon: "🕵️",
    title: "Auditoría completa",
    desc:  "Cada acción queda registrada en el historial. Transparencia total en tu organización.",
    details: ["Registro de cada acción", "Filtros por usuario y fecha", "Trazabilidad completa"],
  },
]

function Caracteristicas() {
  const navigate = useNavigate()

  return (
    <div className="carac-page">
      <Background />

      <nav className="landing-nav">
        <span className="nav-logo" onClick={() => navigate("/landing")}>CHRONOS</span>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate("/caracteristicas")}>Características</span>
          <span className="nav-link" onClick={() => navigate("/precios")}>Precios</span>
          <span className="nav-link" onClick={() => navigate("/soporte")}>Soporte</span>
        </div>
        <button className="nav-cta" onClick={() => navigate("/")}>Iniciar sesión →</button>
      </nav>

      <section className="carac-hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <p className="section-label">Módulos del sistema</p>
        <h1 className="carac-title">
          Todo lo que tu equipo necesita,{" "}
          <span className="highlight">en un solo lugar</span>
        </h1>
        <p className="carac-subtitle">
          CHRONOS integra control de turnos, actividades, reportes y auditoría
          en una plataforma diseñada para microempresas.
        </p>
      </section>

      <section className="carac-grid-section">
        <div className="carac-grid">
          {modulos.map((mod, i) => (
            <div className="carac-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="carac-card-icon">{mod.icon}</div>
              <h3>{mod.title}</h3>
              <p>{mod.desc}</p>
              <ul className="carac-details">
                {mod.details.map((d, j) => (
                  <li key={j}>✓ {d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="carac-cta">
        <h2>¿Listo para empezar?</h2>
        <p>Crea tu cuenta gratuita y descubre todas las funcionalidades.</p>
        <div className="carac-cta-actions">
          <button className="btn-primary" onClick={() => navigate("/register")}>Crear cuenta gratis →</button>
          <button className="btn-ghost" onClick={() => navigate("/contacto")}>Hablar con ventas</button>
        </div>
      </section>

      <footer className="landing-footer">
        <span className="footer-logo">CHRONOS</span>
        <span className="footer-copy">© 2026 CHRONOS · Proyecto SENA</span>
        <div className="footer-links">
          <span className="footer-link" onClick={() => navigate("/caracteristicas")}>Características</span>
          <span className="footer-link" onClick={() => navigate("/precios")}>Precios</span>
          <span className="footer-link" onClick={() => navigate("/soporte")}>Soporte</span>
        </div>
      </footer>
    </div>
  )
}

export default Caracteristicas
