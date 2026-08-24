import { useNavigate } from "react-router-dom"
import Background from "../components/Background"
import "../styles/Precios.css"

const planes = [
  {
    name: "Básico",
    price: "Gratis",
    period: "para siempre",
    desc: "Ideal para equipos pequeños que están empezando.",
    features: [
      "Hasta 5 usuarios",
      "Control de turnos",
      "Gestión de actividades",
      "Notificaciones básicas",
    ],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    name: "Profesional",
    price: "$29.900",
    period: "/mes",
    desc: "Para empresas en crecimiento que necesitan reportes y aprobaciones.",
    features: [
      "Hasta 25 usuarios",
      "Todo del plan Básico",
      "Aprobaciones avanzadas",
      "Reportes automáticos",
      "Auditoría completa",
      "Soporte prioritario",
    ],
    cta: "Comenzar prueba",
    highlight: true,
  },
  {
    name: "Empresarial",
    price: "$79.900",
    period: "/mes",
    desc: "Solución completa para organizaciones con múltiples sedes.",
    features: [
      "Usuarios ilimitados",
      "Todo del plan Profesional",
      "Múltiples sedes",
      "API de integración",
      "Capacitación personalizada",
      "Soporte 24/7",
      " SLA garantizado",
    ],
    cta: "Contactar ventas",
    highlight: false,
  },
]

function Precios() {
  const navigate = useNavigate()

  return (
    <div className="precios-page">
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

      <section className="precios-hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <p className="section-label">Planes y precios</p>
        <h1 className="precios-title">
          Elige el plan ideal{" "}
          <span className="highlight">para tu equipo</span>
        </h1>
        <p className="precios-subtitle">
          Sin costos ocultos. Cancela cuando quieras. Prueba gratis por 14 días.
        </p>
      </section>

      <section className="precios-grid-section">
        <div className="precios-grid">
          {planes.map((plan, i) => (
            <div
              className={`precios-card ${plan.highlight ? "highlighted" : ""}`}
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.highlight && <div className="precios-badge">Más popular</div>}
              <h3 className="precios-plan-name">{plan.name}</h3>
              <div className="precios-price">
                <span className="precios-amount">{plan.price}</span>
                <span className="precios-period">{plan.period}</span>
              </div>
              <p className="precios-desc">{plan.desc}</p>
              <ul className="precios-features">
                {plan.features.map((f, j) => (
                  <li key={j}>✓ {f}</li>
                ))}
              </ul>
              <button
                className={`precios-cta ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
                onClick={() => navigate(plan.highlight ? "/register" : "/contacto")}
              >
                {plan.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="precios-faq">
        <h2>Preguntas frecuentes</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h4>¿Puedo cambiar de plan después?</h4>
            <p>Sí, puedes actualizar o reducir tu plan en cualquier momento desde la configuración de tu cuenta.</p>
          </div>
          <div className="faq-item">
            <h4>¿Hay período de prueba?</h4>
            <p>Sí, el plan Profesional incluye 14 días de prueba gratuita sin compromiso.</p>
          </div>
          <div className="faq-item">
            <h4>¿Qué métodos de pago aceptan?</h4>
            <p>Aceptamos tarjetas de crédito, débito, PSE y transferencia bancaria.</p>
          </div>
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

export default Precios
