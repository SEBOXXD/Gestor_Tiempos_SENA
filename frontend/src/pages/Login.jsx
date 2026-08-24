import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/login.css"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(correo, contrasena)
      navigate("/inicio")
    } catch (err) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="overlay" />
      <div className="login-card">
        <h1 className="logo">CHRONOS</h1>
        <p className="subtitle">Sistema de gestión de tiempos</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              id="login-email"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <label htmlFor="login-email">Correo electrónico</label>
          </div>
          <div className="input-group">
            <input
              id="login-password"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <label htmlFor="login-password">Contraseña</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
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
