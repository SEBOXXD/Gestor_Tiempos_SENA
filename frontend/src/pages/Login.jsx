import "../styles/login.css";
import bgImage from "../assets/bg-texture.gif";

function Login() {
  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="overlay"></div>

      <div className="login-card">
        <h1 className="logo">Chronos</h1>
        <p className="subtitle">Gestión de tiempos</p>

        <form>
          <input type="email" placeholder="Correo" />
          <input type="password" placeholder="Contraseña" />

          <button>Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}

export default Login;