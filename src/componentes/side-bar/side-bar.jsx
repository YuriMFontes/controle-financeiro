// src/componentes/Sidebar/Sidebar.js
import { useNavigate } from "react-router-dom";
import "./side-bar.css";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate("/dashboard");
  };

  const handleFiscal = async () => (
    alert("EM CONSTRUÇÃO")
  );

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
    </aside>
  );
}
