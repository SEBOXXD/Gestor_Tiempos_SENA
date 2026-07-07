import { useState } from "react"
import "../styles/Contacto.css"
import Sidebar from "../components/Sidebar"
import Background from "../components/Background"

function Contacto() {
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="contacto-page">
      <Background />
      <div className="contacto-content">
        <header className="contacto-header">
          <h1>📬 Contacto</h1>
          <p>¿Tienes dudas, sugerencias o necesitas soporte? Escríbenos</p>
        </header>

        <div className="contacto-grid">
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
                <div className="input-group">
                  <input id="ct-nombre" type="text" required />
                  <label htmlFor="ct-nombre">Nombre completo</label>
                </div>
                <div className="input-group">
                  <input id="ct-email" type="email" required />
                  <label htmlFor="ct-email">Correo electrónico</label>
                </div>
                <div className="input-group">
                  <select id="ct-asunto" className="filter-select contacto-select" required>
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
                <button type="submit" className="btn-primary">Enviar mensaje →</button>
              </>
            )}
          </form>

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
