// =============================================
// Login.jsx — Pantalla de inicio de sesión
// =============================================
// 📚 CONCEPTOS REACT EN ESTE ARCHIVO:
//
// • useState(valorInicial) → crea una variable de estado.
//   Devuelve [valorActual, funcionParaCambiarla].
//   Cuando el estado cambia, React re-renderiza el componente
//   mostrando el nuevo valor en pantalla automáticamente.
//
// • e.preventDefault() → evita que el formulario recargue
//   la página al hacer submit (comportamiento nativo HTML).
//
// • Renderizado condicional: {condicion && <Elemento />}
//   Si "condicion" es true, muestra el elemento.
//   Si es false, no muestra nada.
// =============================================

import { useState } from "react";
import "../styles/login.css";

function Login() {
  // -------------------------------------------------------
  // ESTADO LOCAL
  // "error" es un booleano que controla si se muestra
  // el mensaje de error bajo el formulario.
  // setError(true)  → muestra el mensaje
  // setError(false) → lo oculta
  // -------------------------------------------------------
  const [error, setError] = useState(false);

  // -------------------------------------------------------
  // MANEJADOR DEL FORMULARIO
  // Se llama cuando el usuario hace clic en "Ingresar".
  // En una app real aquí harías el fetch a la API de login.
  // -------------------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault(); // Evita recarga de página

    // TODO: reemplazar con lógica real de autenticación
    // Por ahora simulamos un error para mostrar el mensaje
    setError(true);
  };

  return (
    // Contenedor principal: fondo degradado animado + centrado
    <div className="login-container">

      {/* Overlay: capa oscura semitransparente sobre el fondo */}
      <div className="overlay" />

      {/* Tarjeta glassmorphism centrada */}
      <div className="login-card">

        {/* Logo del sistema */}
        <h1 className="logo">CHRONOS</h1>
        <p className="subtitle">Sistema de gestión de tiempos</p>

        {/* ------------------------------------------------
            FORMULARIO
            onSubmit → llama a handleLogin al hacer submit.
            El submit se dispara con el botón type="submit"
            O al presionar Enter en cualquier input del form.
        ------------------------------------------------ */}
        <form onSubmit={handleLogin}>

          {/* Campo de email con label flotante */}
          <div className="input-group">
            {/* required → permite que :valid funcione en el CSS del label */}
            <input id="login-email" type="email" required />
            <label htmlFor="login-email">Correo electrónico</label>
          </div>

          {/* Campo de contraseña con label flotante */}
          <div className="input-group">
            <input id="login-password" type="password" required />
            <label htmlFor="login-password">Contraseña</label>
          </div>

          {/* ------------------------------------------------
              MENSAJE DE ERROR (renderizado condicional)
              Solo se muestra cuando "error" es true.
              El && es un "cortocircuito": si el lado izquierdo
              es false, React no evalúa el lado derecho.
          ------------------------------------------------ */}
          {error && (
            <div className="error-mesage">
              ⚠️ Correo o contraseña incorrectos
            </div>
          )}

          {/* Botón de submit — dispara el onSubmit del form */}
          <button type="submit">Ingresar</button>

        </form>

        {/* Link hacia el registro */}
        <p className="login-link">
          ¿No tienes cuenta?{" "}
          {/* TODO: reemplazar con <Link to="/register"> de React Router */}
          <span onClick={() => {}}>Regístrate</span>
        </p>

      </div>
    </div>
  );
}

// Exportamos para que AppRoutes.jsx pueda importarlo
export default Login;