import { useState } from "react";
import "../styles/login.css";
import bgImage from "../assets/bg-texture.gif";
import Background from "../components/Background";

function Login() {
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("CLICK DETECTADO");

    // Simulación de error
    setError(true);
  };


  return (
    <div
      className="login-container"
      // style={{
        // backgroundImage: `url(${bgImage})`,
      // }
    // }
    >
      {/* <Background /> */}
      <div className="overlay"></div>

      <div className="login-card">
        <h1 className="logo">Chronos</h1>
        <p className="subtitle">Sistema de gestión de tiempos</p>

        <form onSubmit ={handleLogin}>
          <div className="input-group">
            <input type="email" />
            <label>Correo</label>
          </div>

          <div className="input-group">
            <input type="password" />
            <label>Contraseña</label>
          </div>

          {/* MENSAJE DE ERROR */}
          {error && (
            <div className="error-mesage">
              Correo o contraseña incorrectos
            </div>
          )}

          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;