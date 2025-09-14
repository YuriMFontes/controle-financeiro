// src/componentes/Sidebar/Sidebar.js
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ logo, onLogout }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2 className="logo">Controle-Financeiro</h2>
      <nav>
        <a href="#">📊 Visão Geral</a>
        <a href="#">📁 Notas Fiscais</a>
        <a href="#">👥 Usuários</a>
        <a href="#">⚙️ Configurações</a>
      </nav>
      <div className="sidebar-actions">
        <button className="action-btn-sidebar" onClick={onLogout}>
          Sair
        </button>
      </div>
    </aside>
  );
}
