// =============================================
// Registro.jsx — Pantalla de registro de usuario
// =============================================
// 📚 CONCEPTOS REACT EN ESTE ARCHIVO:
//
// • Props de componente: Modal recibe "message" y "onClose".
//   Props son parámetros que el componente padre pasa al hijo.
//   En JSX: <Modal message="..." onClose={funcion} />
//
// • Arrow function inline: onClose={() => setShowModal(false)}
//   Crea una función nueva cada vez que se renderiza.
//   Solo úsalas inline para funciones cortas como esta.
//
// • Componente Modal: componente reutilizable importado
//   de components/Modal.jsx. Encapsula el overlay + tarjeta.
// =============================================

import { useState } from "react";
import "../styles/register.css";
import Modal from "../components/Modal";

function Register() {
  // -------------------------------------------------------
  // ESTADO LOCAL
  // "showModal" controla si el Modal de error se muestra.
  // -------------------------------------------------------
  const [showModal, setShowModal] = useState(false);

  // -------------------------------------------------------
  // MANEJADOR DEL FORMULARIO
  // TODO: reemplazar con validación real y llamada a la API.
  // -------------------------------------------------------
  const handleRegister = (e) => {
    e.preventDefault(); // Evita recarga de página

    // Por ahora simulamos que el registro falla
    // y mostramos el modal de error.
    setShowModal(true);
  };

  return (
    // Contenedor principal: mismo fondo degradado que el Login
    <div className="register-container">

      {/* Overlay semitransparente sobre el fondo */}
      <div className="overlay" />

      {/* Tarjeta glassmorphism */}
      <div className="register-card">

        {/* Logo */}
        <h1 className="logo">CHRONOS</h1>
        <p className="subtitle">Crear cuenta nueva</p>

        {/* ------------------------------------------------
            FORMULARIO DE REGISTRO
            4 campos: nombre, correo, contraseña, confirmación
        ------------------------------------------------ */}
        <form onSubmit={handleRegister}>

          <div className="input-group">
            <input id="reg-nombre" type="text" required />
            <label htmlFor="reg-nombre">Nombre completo</label>
          </div>

          <div className="input-group">
            <input id="reg-email" type="email" required />
            <label htmlFor="reg-email">Correo electrónico</label>
          </div>

          <div className="input-group">
            <input id="reg-password" type="password" required />
            <label htmlFor="reg-password">Contraseña</label>
          </div>

          <div className="input-group">
            <input id="reg-confirm" type="password" required />
            <label htmlFor="reg-confirm">Confirmar contraseña</label>
          </div>

          <button type="submit">Registrarse</button>

        </form>

        {/* ------------------------------------------------
            MODAL DE ERROR (renderizado condicional)
            Se monta en el DOM solo cuando showModal === true.
            Cuando el usuario hace clic en "Cerrar", se llama
            onClose → setShowModal(false) → el Modal desaparece.
        ------------------------------------------------ */}
        {showModal && (
          <Modal
            message="No se pudo registrar el usuario. Intenta de nuevo."
            onClose={() => setShowModal(false)}
          />
        )}

        {/* Link hacia el login */}
        <p className="login-link">
          ¿Ya tienes cuenta?{" "}
          {/* TODO: reemplazar con <Link to="/"> de React Router */}
          <span onClick={() => {}}>Inicia sesión</span>
        </p>

      </div>
    </div>
  );
}

export default Register;