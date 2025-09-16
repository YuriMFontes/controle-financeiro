import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p>🚧 EM CONSTRUÇÃO 🚧</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
            <button onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
