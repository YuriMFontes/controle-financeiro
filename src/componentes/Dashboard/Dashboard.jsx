import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "../../assets/logo.png"

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Controle-Financeiro</h2>
        <nav>
          <a href="#">📊 Visão Geral</a>
          <a href="#">📁 Projetos</a>
          <a href="#">👥 Usuários</a>
          <a href="#">⚙️ Configurações</a>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="profile">
            <img
              src={logo}
              alt="perfil"
              className="avatar"
            />
            <div className="actions">
              <button className="action-btn">Editar Perfil</button>
              <button className="action-btn" onClick={handleLogout}>
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Cards de métricas */}
        <section className="cards">
          <div className="card">
            <h3>Adicionar Conta</h3>
            <p>Clique aqui para adicionar uma conta!</p>
          </div>
          <div className="card">
            <h3>Informar Pagamentos</h3>
            <p>Clique aqui para inforamr pagamento!</p>
          </div>
          <div className="card">
            <h3>Relatorios</h3>
            <p>Receba relatores em PDF!</p>
          </div>
        </section>

        {/* Conteúdo */}
        <section className="content">
          <h2>Bem-vindo ao Dashboard 👋</h2>
          <p>Aqui você pode acompanhar métricas e gerenciar sua aplicação.</p>
        </section>
      </main>
    </div>
  );
}
