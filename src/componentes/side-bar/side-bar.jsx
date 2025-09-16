// src/componentes/Sidebar/Sidebar.js
import { useNavigate } from "react-router-dom";
import "./side-bar.css";
import Modal from "../modal/Modal";
import { useState } from "react";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  
  const [isFiscalModalOpen, setIsFiscalModalOpen] = useState(false);
  const handleFiscal = () => {
    setIsFiscalModalOpen(true);
  };

  
  const handleSubmit = async () => {
    navigate("/dashboard");
  };



  return (
    <aside className="sidebar">
      <h2 className="logo">Controle-Financeiro</h2>
      <nav>
        <a onClick={handleSubmit} href="#">Visão Geral</a>
        <a onClick={handleFiscal} href="#">Notas Fiscais</a>
        <a onClick={handleFiscal} href="#">Investimentos</a>
        <a onClick={handleFiscal} href="#">Saúde</a>
      </nav>
      <div className="sidebar-actions">
        <button className="action-btn-sidebar" onClick={onLogout}>
          Sair
        </button>
      </div>
      <Modal
          isOpen={isFiscalModalOpen}
          onClose={() => setIsFiscalModalOpen(false)}
          title="Aviso"
        />
    </aside>
  );
}
