import { useNavigate } from "react-router-dom"
import Background from "../components/Background"
import "../styles/Soporte.css"

const faqItems = [
  {
    q: "¿Cómo registro mi entrada y salida?",
    a: "En la sección 'Jornada', haz clic en 'Registrar entrada' al iniciar tu turno y 'Registrar salida' al finalizar. El sistema calcula automáticamente las horas trabajadas.",
  },
  {
    q: "¿Cómo cambio mi contraseña?",
    a: "Ve a Configuración, escribe tu nueva contraseña en el campo 'Nueva contraseña' y haz clic en 'Guardar cambios'.",
  },
  {
    q: "¿Cómo apruebo una actividad?",
    a: "En la sección 'Aprobaciones', verás las actividades pendientes de revisión. Puedes aprobarlas o rechazarlas con un comentario.",
  },
  {
    q: "¿Cómo genero un reporte?",
    a: "Ve a Reportes y haz clic en 'Generar reporte'. El sistema mostrará las horas trabajadas, actividades y aprobaciones del período seleccionado.",
  },
  {
    q: "¿Puedo editar mi perfil?",
    a: "Sí, en Configuración puedes actualizar tu nombre, correo electrónico y contraseña.",
  },
]

const canales = [
  {
    icon: "📧",
    title: "Email",
    desc: "soporte@chronos.com",
    detail: "Respuesta en 24 horas",
  },
  {
    icon: "📞",
    title: "Teléfono",
    desc: "+57 (1) 234 5678",
    detail: "Lun - Vie: 8:00 AM - 6:00 PM",
  },
  {
    icon: "💬",
    title: "Chat en vivo",
    desc: "Disponible en la app",
    detail: "Lun - Vie: 9:00 AM - 5:00 PM",
  },
]

function Soporte() {
  const navigate = useNavigate()

  return (
    <div className="soporte-page">
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

      <section className="soporte-hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <p className="section-label">Centro de ayuda</p>
        <h1 className="soporte-title">
          ¿Necesitas{" "}
          <span className="highlight">ayuda?</span>
        </h1>
        <p className="soporte-subtitle">
          Encuentra respuestas rápidas o contacta a nuestro equipo de soporte.
        </p>
      </section>

      {/* Canales de soporte */}
      <section className="soporte-canales-section">
        <div className="soporte-canales">
          {canales.map((ch, i) => (
            <div className="soporte-canal-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="soporte-canal-icon">{ch.icon}</span>
              <h3>{ch.title}</h3>
              <p className="soporte-canal-desc">{ch.desc}</p>
              <p className="soporte-canal-detail">{ch.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="soporte-faq-section">
        <h2>Preguntas frecuentes</h2>
        <div className="soporte-faq-list">
          {faqItems.map((item, i) => (
            <div className="soporte-faq-item" key={i}>
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="soporte-cta">
        <h2>¿No encontraste lo que buscabas?</h2>
        <p>Nuestro equipo está listo para ayudarte.</p>
        <button className="btn-primary" onClick={() => navigate("/contacto")}>Contactar soporte →</button>
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

export default Soporte
