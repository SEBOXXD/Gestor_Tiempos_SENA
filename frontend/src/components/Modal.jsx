// =============================================
// Modal.jsx — Componente de diálogo emergente
// =============================================
// 📚 CONCEPTOS REACT EN ESTE ARCHIVO:
//
// • Props desestructuradas: ({ message, onClose })
//   En lugar de recibir "props" y usar props.message,
//   desestructuramos directamente en los parámetros.
//   Más limpio y legible.
//
// • Componente "dumb" (sin estado propio):
//   Este componente NO tiene useState. Su comportamiento
//   (mostrarse/ocultarse) lo controla el padre a través
//   de props (onClose dispara setShowModal(false) en el padre).
//
// • Reutilizable: el mismo Modal puede usarse en cualquier
//   página, solo cambia el "message" que se le pasa.
// =============================================

import "../styles/modal.css";

// -------------------------------------------------------
// PARÁMETROS (Props) del componente:
//   message {string} — Texto del mensaje a mostrar
//   onClose {function} — Función para cerrar el modal
//   type    {string} — Opcional: "error" | "success" | "warning"
//                      Por defecto "error"
// -------------------------------------------------------
function Modal({ message, onClose, type = "error" }) {

  // Mapa de íconos y títulos según el tipo de modal
  // Si en el futuro quieres agregar un tipo nuevo,
  // solo añade una clave aquí.
  const config = {
    error:   { icon: "❌", title: "Error"       },
    success: { icon: "✅", title: "Éxito"       },
    warning: { icon: "⚠️", title: "Advertencia" },
  };

  // Tomamos la configuración del tipo actual (por defecto "error")
  const { icon, title } = config[type] || config.error;

  return (
    // -------------------------------------------------------
    // OVERLAY: cubre toda la pantalla detrás del modal.
    // Al hacer clic en el overlay también se cierra el modal
    // (comportamiento UX estándar).
    // e.stopPropagation() en modal-card evita que el clic
    // "burbujee" al overlay y cierre el modal accidentalmente.
    // -------------------------------------------------------
    <div className="modal-overlay" onClick={onClose}>

      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()} /* Evita cerrar al clic interno */
      >

        {/* Ícono grande según el tipo */}
        <span className="modal-icon">{icon}</span>

        {/* Título según el tipo */}
        <h2>{title}</h2>

        {/* Mensaje pasado como prop desde el componente padre */}
        <p>{message}</p>

        {/* Botón de cierre: llama a onClose (definido en el padre) */}
        <button onClick={onClose}>Cerrar</button>

      </div>
    </div>
  );
}

export default Modal;