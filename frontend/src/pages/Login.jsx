import { useNavigate } from "react-router-dom"
import "../styles/login.css"

function Login() {
  const navigate = useNavigate()

  return (
    <div className="login-container">
      <div className="overlay" />
      <div className="login-card">
        <h1 className="logo">CHRONOS</h1>
        <p className="subtitle">Sistema de gestión de tiempos</p>

        <form onSubmit={(e) => { e.preventDefault(); navigate("/inicio") }}>
          <div className="input-group">
            <input id="login-email" type="email" defaultValue="admin@empresa.com" />
            <label htmlFor="login-email">Correo electrónico</label>
          </div>
          <div className="input-group">
            <input id="login-password" type="password" defaultValue="123456" />
            <label htmlFor="login-password">Contraseña</label>
          </div>

          <button type="submit">Ingresar</button>
        </form>

        <p className="login-link">
          ¿No tienes cuenta?{" "}
          <span className="link-btn" onClick={() => navigate("/register")}>Regístrate</span>
        </p>

        <p className="login-link" style={{ marginTop: "8px" }}>
          <span className="link-btn muted" onClick={() => navigate("/landing")}>
            Ver página de presentación
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login