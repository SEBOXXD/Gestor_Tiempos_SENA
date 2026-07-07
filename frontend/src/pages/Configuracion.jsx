import { useState } from "react"
import "../styles/Configuracion.css"
import Sidebar from "../components/Sidebar"

function Configuracion() {
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)
  const [doubleAuth, setDoubleAuth] = useState(false)

  return (
    <div className="configuracion-container">
      <Sidebar activeItem="configuracion" userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="configuracion-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>⚙️ Configuración</h1>
            <p>Personaliza el comportamiento del sistema según tus necesidades</p>
          </div>
          <button className="btn-primary">Guardar cambios</button>
        </header>

        <section className="config-section">
          <h2>🔔 Notificaciones</h2>
          <div className="config-card">
            <div className="config-row">
              <div className="config-row-info">
                <span className="config-row-title">Notificaciones push</span>
                <span className="config-row-desc">Recibe alertas en tiempo real sobre aprobaciones y actividades</span>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={notifEnabled} onChange={() => setNotifEnabled(!notifEnabled)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="config-row">
              <div className="config-row-info">
                <span className="config-row-title">Notificaciones por correo</span>
                <span className="config-row-desc">Envía resumen diario de actividades al correo registrado</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </section>

        <section className="config-section">
          <h2>🔐 Seguridad</h2>
          <div className="config-card">
            <div className="config-row">
              <div className="config-row-info">
                <span className="config-row-title">Autenticación de doble factor</span>
                <span className="config-row-desc">Añade una capa extra de seguridad al iniciar sesión</span>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={doubleAuth} onChange={() => setDoubleAuth(!doubleAuth)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="config-row">
              <div className="config-row-info">
                <span className="config-row-title">Tiempo de sesión</span>
                <span className="config-row-desc">Tiempo máximo de inactividad antes de cerrar sesión</span>
              </div>
              <select className="filter-select config-select">
                <option>30 minutos</option>
                <option>1 hora</option>
                <option>2 horas</option>
                <option>4 horas</option>
              </select>
            </div>
          </div>
        </section>

        <section className="config-section">
          <h2>📋 Turnos</h2>
          <div className="config-card">
            <div className="config-row">
              <div className="config-row-info">
                <span className="config-row-title">Aprobación automática</span>
                <span className="config-row-desc">Aprueba automáticamente turnos que coinciden con el horario asignado</span>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={autoApprove} onChange={() => setAutoApprove(!autoApprove)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="config-row">
              <div className="config-row-info">
                <span className="config-row-title">Tolerancia de entrada</span>
                <span className="config-row-desc">Minutos de tolerancia permitidos para registrar entrada</span>
              </div>
              <select className="filter-select config-select">
                <option>5 minutos</option>
                <option selected>10 minutos</option>
                <option>15 minutos</option>
                <option>20 minutos</option>
              </select>
            </div>
          </div>
        </section>

        <section className="config-section">
          <h2>👤 Mi perfil</h2>
          <div className="config-card">
            <div className="profile-form">
              <div className="input-group">
                <input id="cfg-nombre" type="text" defaultValue="Admin" required />
                <label htmlFor="cfg-nombre">Nombre completo</label>
              </div>
              <div className="input-group">
                <input id="cfg-email" type="email" defaultValue="admin@empresa.com" required />
                <label htmlFor="cfg-email">Correo electrónico</label>
              </div>
              <div className="input-group">
                <input id="cfg-password" type="password" placeholder="••••••••" />
                <label htmlFor="cfg-password">Nueva contraseña</label>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Configuracion
