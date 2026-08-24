import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiPost } from "../services/api"
import "../styles/Contacto.css"
import Background from "../components/Background"

/**
 * Página pública de Contacto.
 * Formulario que envía un email al soporte vía POST /api/contacto.
 * Incluye barra de navegación de regreso al Landing.
 */
function Contacto() {
  const navigate = useNavigate()
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const nombre = e.target["ct-nombre"].value
    const correo = e.target["ct-email"].value
    const asunto = e.target["ct-asunto"].value
    const mensaje = e.target["ct-mensaje"].value

    try {
      await apiPost('/api/contacto', { nombre, correo, asunto, mensaje })
      setEnviado(true)
    } catch (err) {
      setError(err.message || "Error al enviar el mensaje")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contacto-page">
      <Background />

      {/* Barra de navegación */}
      <nav className="contacto-nav">
        <span className="contacto-nav-logo" onClick={() => navigate("/landing")}>CHRONOS</span>
        <button className="btn-ghost" onClick={() => navigate("/landing")}>← Volver al inicio</button>
      </nav>

      <div className="contacto-content">
        <header className="contacto-header">
          <h1>Contacto</h1>
          <p>¿Tienes dudas, sugerencias o necesitas soporte? Escríbenos</p>
        </header>

        <div className="contacto-grid">
          {/* Formulario */}
          <form className="contacto-form" onSubmit={handleSubmit}>
            {enviado ? (
              <div className="contacto-success">
                <span className="contacto-success-icon">✅</span>
                <h2>Mensaje enviado</h2>
                <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
                <button type="button" className="btn-primary" onClick={() => setEnviado(false)}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <>
                {error && <p className="error-message">{error}</p>}
                <div className="input-group">
                  <input id="ct-nombre" type="text" required />
                  <label htmlFor="ct-nombre">Nombre completo</label>
                </div>
                <div className="input-group">
                  <input id="ct-email" type="email" required />
                  <label htmlFor="ct-email">Correo electrónico</label>
                </div>
                <div className="input-group">
                  <select id="ct-asunto" className="contacto-select" required>
                    <option value="">Selecciona un asunto</option>
                    <option>Soporte técnico</option>
                    <option>Sugerencia</option>
                    <option>Reportar error</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="input-group">
                  <textarea id="ct-mensaje" className="contacto-textarea" rows={5} required />
                  <label htmlFor="ct-mensaje">Mensaje</label>
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar mensaje"}
                </button>
              </>
            )}
          </form>

          {/* Tarjetas de información */}
          <div className="contacto-info">
            <div className="contacto-info-card">
              <span className="contacto-info-icon">📧</span>
              <h3>Email</h3>
              <p>soporte@chronos.com</p>
            </div>
            <div className="contacto-info-card">
              <span className="contacto-info-icon">📞</span>
              <h3>Teléfono</h3>
              <p>+57 (1) 234 5678</p>
            </div>
            <div className="contacto-info-card">
              <span className="contacto-info-icon">📍</span>
              <h3>Ubicación</h3>
              <p>Bogotá D.C., Colombia</p>
            </div>
            <div className="contacto-info-card">
              <span className="contacto-info-icon">🕐</span>
              <h3>Horario</h3>
              <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacto
