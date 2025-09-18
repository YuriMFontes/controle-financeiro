import { useNavigate } from "react-router-dom";
import "./side-bar.css";
import Modal from "../caixa/modal";
import { useState } from "react";

export default function Sidebar({ onLogout, open, onClose, fullName }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async () => {
    navigate("/dashboard");
    onClose();
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">Controle-Financeiro</h2>
        <button className="close-btn" onClick={onClose}>
          ❌
        </button>
      </div>

      <nav>
        <a onClick={handleSubmit} href="#">
          Visão Geral
        </a>
        <a onClick={() => setModalOpen(true)} href="#">
          Notas Fiscais
        </a>
        <a onClick={() => setModalOpen(true)} href="#">
          Investimentos
        </a>
        <a onClick={() => setModalOpen(true)} href="#">
          Saúde
        </a>
      </nav>
      <div className="sidebar-actions">
        <button className="action-btn-sidebar" onClick={onLogout}>
          Sair
        </button>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Informações Importantes"
        size="large"
      >
        <p>🚀 Essa página está em construção..</p>
        <p>No instagram encontra mais informações</p>
        <button onClick={() => setModalOpen(false)}>Fechar</button>
      </Modal>
    </aside>
  );
}
