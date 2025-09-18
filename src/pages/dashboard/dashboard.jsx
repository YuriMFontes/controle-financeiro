import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Sidebar from "../../componentes/side-bar/side-bar";
import Topbar from "../../componentes/top-bar/top-bar";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleAddAccount = () => {
    navigate("/add-account");
  };

  const handlePayments = () => {
    navigate("/info-payment");
  };

  const handleReports = () => {
    alert("EM CONSTRUÇÃO (Receba relatórios em PDF!)");
  };

  return (
    <div className="dashboard">
      <Sidebar
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        fullName={"Usuário"} // <- aqui você pode passar o fullName real
      />

      {/* Conteúdo principal */}
      <main className="main">
        <Topbar
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Cards */}
        <section className="cards">
          <div className="card" onClick={handleAddAccount}>
            <h3>Adicionar Conta</h3>
            <p>Clique aqui para adicionar uma conta!</p>
          </div>

          <div className="card" onClick={handlePayments}>
            <h3>Informar Pagamentos</h3>
            <p>Clique aqui para informar pagamento!</p>
          </div>

          <div className="card" onClick={handleReports}>
            <h3>Relatórios</h3>
            <p>Receba relatórios em PDF!</p>
          </div>
        </section>

        {/* Card maior embaixo */}
        <section className="big-card">
          <h2>EM CONSTRUÇÃO</h2>
          <p>
            Este espaço será usado para gráficos, relatórios detalhados ou
            qualquer outra informação que você queira exibir.
          </p>
        </section>
      </main>
    </div>
  );
}
