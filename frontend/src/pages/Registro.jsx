import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/register.css"

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmar) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      await register({
        nombre,
        correo,
        contrasena
      })
      navigate("/inicio")
    } catch (err) {
      setError(err.message || "Error al registrar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="overlay" />
      <div className="register-card">
        <h1 className="logo">CHRONOS</h1>
        <p className="subtitle">Crear cuenta nueva</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              id="reg-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <label htmlFor="reg-nombre">Nombre completo</label>
          </div>
          <div className="input-group">
            <input
              id="reg-email"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <label htmlFor="reg-email">Correo electrónico</label>
          </div>
          <div className="input-group">
            <input
              id="reg-password"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <label htmlFor="reg-password">Contraseña</label>
          </div>
          <div className="input-group">
            <input
              id="reg-confirm"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
            <label htmlFor="reg-confirm">Confirmar contraseña</label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
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
