import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "../../assets/logo.png";
import Sidebar from "../SideBar/SideBar";

export default function Dashboard() {
  const navigate = useNavigate();

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
    alert("Gerar relatórios em PDF");
  };

  return (
    <div className="dashboard">
      <Sidebar onLogout={handleLogout} />

      {/* Conteúdo principal */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="profile">
            <img src={logo} alt="perfil" className="avatar" />
            <div className="actions">
              <button className="action-btn">Editar Perfil</button>
            </div>
          </div>
        </header>

        {/* Cards de métricas */}
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
          <h2>Informações Futuras</h2>
          <p>
            Este espaço será usado para gráficos, relatórios detalhados ou
            qualquer outra informação que você queira exibir.
          </p>
        </section>
      </main>
    </div>
  );
}
