import { useNavigate } from "react-router-dom"
import "../styles/Landing.css"

const stats = [
  { number: "+500",  label: "Microempresas confían en nosotros" },
  { number: "98%",   label: "Tasa de satisfacción del cliente"  },
  { number: "3.2M",  label: "Horas gestionadas este año"        },
]

const features = [
  {
    icon: "⏱️",
    title: "Control de turnos en tiempo real",
    desc:  "Registra, aprueba y monitorea los turnos de tu equipo desde un solo lugar, sin hojas de cálculo ni papel.",
  },
  {
    icon: "📋",
    title: "Gestión de actividades",
    desc:  "Asigna tareas diarias a cada empleado y sigue el progreso con checklists visuales e intuitivos.",
  },
  {
    icon: "📊",
    title: "Reportes automáticos",
    desc:  "Genera informes de productividad, horas trabajadas y asistencia en segundos, listos para exportar.",
  },
  {
    icon: "🔔",
    title: "Notificaciones inteligentes",
    desc:  "Alertas automáticas para aprobaciones pendientes, turnos próximos y actividades sin completar.",
  },
  {
    icon: "🔐",
    title: "Roles y permisos",
    desc:  "Define quién puede ver qué. Administradores, supervisores y operarios con acceso personalizado.",
  },
  {
    icon: "🕵️",
    title: "Auditoría completa",
    desc:  "Historial detallado de cada acción realizada en el sistema. Transparencia total en tu organización.",
  },
]

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">

      <nav className="landing-nav">
        <span className="nav-logo">CHRONOS</span>
        <div className="nav-links">
          <span className="nav-link">Características</span>
          <span className="nav-link">Precios</span>
          <span className="nav-link">Soporte</span>
        </div>
        <button className="nav-cta" onClick={() => navigate("/")}>Iniciar sesión →</button>
      </nav>

      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-content">
          <div className="hero-chip">
            <span className="chip-dot" />
            Plataforma activa — v2.0 disponible
          </div>

          <h1 className="hero-title">
            Gestión de tiempos{" "}
            <span className="highlight">sin fricción</span>
          </h1>

          <p className="hero-subtitle">
            CHRONOS centraliza turnos, actividades y reportes de tu microempresa
            en una sola plataforma. Simple, potente y accesible desde cualquier dispositivo.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/register")}>Comenzar gratis →</button>
            <button className="btn-ghost" onClick={() => navigate("/inicio")}>Ver demostración</button>
          </div>
        </div>

        <div className="hero-divider" />
      </section>

      <section className="stats-section">
        {stats.map((stat, index) => (
          <div className="stat-item" key={index}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="features-section">
        <p className="section-label">¿Por qué CHRONOS?</p>
        <h2 className="section-title">Todo lo que tu equipo necesita</h2>
        <p className="section-subtitle">
          Diseñado para microempresas que quieren controlar su tiempo
          sin complicaciones tecnológicas.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="feature-icon-wrap">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">
          Empieza a gestionar mejor{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent), var(--light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            hoy mismo
          </span>
        </h2>

        <p className="cta-subtitle">
          Sin tarjeta de crédito. Sin configuración compleja. Solo ingresa y empieza.
        </p>

        <div className="cta-actions">
          <button className="btn-primary" onClick={() => navigate("/register")}>Crear cuenta gratuita →</button>
          <button className="btn-ghost" onClick={() => navigate("/contacto")}>Contactar ventas</button>
        </div>
      </section>

      <footer className="landing-footer">
        <span className="footer-logo">CHRONOS</span>
        <span className="footer-copy">© 2026 CHRONOS · Proyecto SENA</span>
        <div className="footer-links">
          <span className="footer-link">Términos</span>
          <span className="footer-link">Privacidad</span>
          <span className="footer-link">Soporte</span>
        </div>
      </footer>

    </div>
  )
}

export default Landing
