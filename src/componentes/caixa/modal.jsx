import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, title, children, size = "large" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
