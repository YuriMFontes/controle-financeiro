// src/componentes/AddAccount/AddAccountFixed.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../../componentes/side-bar/side-bar";
import Topbar from "../../componentes/top-bar/top-bar";
import "./add-account-fixed.css";

export default function AddAccountFixed() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleAccount = () => navigate("/add-account");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalValue = parseFloat(value);
    if (!totalValue || totalValue <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    // insert account as FIXA, parcel_count = 0
    const { data: accountsData, error: accountError } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          name,
          description,
          total_value: totalValue,
          parcel_count: 0,
          account_type: "FIXA",
        },
      ])
      .select();

    if (accountError) {
      alert("Erro ao adicionar conta: " + accountError.message);
      return;
    }

    alert("Conta fixa criada com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="account">
      <Sidebar
            onLogout={handleLogout}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            />
            <div className="main">
              <Topbar
                      onLogout={handleLogout}
                      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    />  
        <main className="container">
          <div className="form-container">
            <button onClick={handleAccount}>Adicionar Conta Variável</button>
            <h2>Adicionar Conta Fixa</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nome da conta" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="number" placeholder="Valor" value={value} onChange={(e) => setValue(e.target.value)} required />
              <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
              <button type="submit">Adicionar Conta</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
