import "../styles/modal.css"

function Modal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Error</h2>
        <p>{message}</p>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default Modal;