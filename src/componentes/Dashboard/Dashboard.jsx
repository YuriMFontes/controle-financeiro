import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

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
              src={`https://ui-avatars.com/api/?name=User&background=2575fc&color=fff`}
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
            <h3>Usuários</h3>
            <p>1.245</p>
          </div>
          <div className="card">
            <h3>Projetos</h3>
            <p>58</p>
          </div>
          <div className="card">
            <h3>Vendas</h3>
            <p>R$ 75.300</p>
          </div>
          <div className="card">
            <h3>Taxa de Conversão</h3>
            <p>12%</p>
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
