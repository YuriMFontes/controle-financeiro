// src/componentes/Sidebar/Sidebar.js
import { useNavigate } from "react-router-dom";
import "./side-bar.css";
import Modal from "../caixa/modal";
import { useState } from "react";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(false);
  
  const handleSubmit = async () => {
    navigate("/dashboard");
  };



  return (
    <aside className="sidebar">
      <h2 className="logo">Controle-Financeiro</h2>
      <nav>
        <a onClick={() => setOpen(true)} href="#">Visão Geral</a>
        <a onClick={() => setOpen(true)} href="#">Notas Fiscais</a>
        <a onClick={() => setOpen(true)} href="#">Investimentos</a>
        <a onClick={() => setOpen(true)} href="#">Saúde</a>
      </nav>
      <div className="sidebar-actions">
        <button className="action-btn-sidebar" onClick={onLogout}>
          Sair
        </button>
      </div>
      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title="Informações Importantes" 
        size="large" 
      >
        <p>🚀 Essa página está em construção..</p>
        <p>No instagram encontra mais informações</p>
        <button onClick={() => setOpen(false)}>Fechar</button>
      </Modal>
    </aside>
  );
}
