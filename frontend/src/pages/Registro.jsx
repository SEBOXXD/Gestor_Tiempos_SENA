import { useState } from "react";
import "../styles/register.css";
import bgImage from "../assets/bg-texture.gif";
import Modal from "../components/Modal";

function Register() {
  const [showModal, setShowModal] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    // Simulación de error
    setShowModal(true);
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay"></div>

      <div className="register-card">
        <h1 className="logo">Chronos</h1>
        <p className="subtitle">Crear cuenta</p>

        <form onSubmit={handleRegister}>
          
          <div className="input-group">
            <input type="text" />
            <label>Nombre</label>
          </div>

          <div className="input-group">
            <input type="email" />
            <label>Correo</label>
          </div>

          <div className="input-group">
            <input type="password" />
            <label>Contraseña</label>
          </div>

          <div className="input-group">
            <input type="password" />
            <label>Confirmar contraseña</label>
          </div>

          <button type="submit">Registrarse</button>
        </form>

        {showModal && (
            <Modal
                message = "Error al registrar el usuario"
                onClose={() => setShowModal(false)}
                />
        )}

        <p className="login-link">
          ¿Ya tienes cuenta? <span>Inicia sesión</span>
        </p>
      </div>
    </div>
  );
}

export default Register;