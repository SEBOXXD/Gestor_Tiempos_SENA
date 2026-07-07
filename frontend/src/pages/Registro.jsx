import { useNavigate } from "react-router-dom"
import "../styles/register.css"

function Register() {
  const navigate = useNavigate()

  return (
    <div className="register-container">
      <div className="overlay" />
      <div className="register-card">
        <h1 className="logo">CHRONOS</h1>
        <p className="subtitle">Crear cuenta nueva</p>

        <form onSubmit={(e) => { e.preventDefault(); navigate("/inicio") }}>
          <div className="input-group">
            <input id="reg-nombre" type="text" defaultValue="Nuevo Usuario" />
            <label htmlFor="reg-nombre">Nombre completo</label>
          </div>
          <div className="input-group">
            <input id="reg-email" type="email" defaultValue="usuario@empresa.com" />
            <label htmlFor="reg-email">Correo electrónico</label>
          </div>
          <div className="input-group">
            <input id="reg-password" type="password" defaultValue="123456" />
            <label htmlFor="reg-password">Contraseña</label>
          </div>
          <div className="input-group">
            <input id="reg-confirm" type="password" defaultValue="123456" />
            <label htmlFor="reg-confirm">Confirmar contraseña</label>
          </div>
          <button type="submit">Registrarse</button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta?{" "}
          <span className="link-btn" onClick={() => navigate("/")}>Inicia sesión</span>
        </p>
      </div>
    </div>
  )
}

export default Register