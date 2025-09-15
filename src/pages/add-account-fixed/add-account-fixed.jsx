// src/componentes/AddAccount/AddAccount.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../../componentes/side-bar/side-bar"
import Topbar from "../../componentes/top-bar/top-bar"
import "./add-account-fixed.css";

export default function AddAccountFixed() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
   const handleAccount = async () => (
    navigate("/add-account")
  )

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalValue = parseFloat(value);
    if (!totalValue || totalValue <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    // pega usuário logado
    const { data: { user } } = await supabase.auth.getUser();


    // cria a conta
    const { data: accountsData, error: accountError } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          name,
          description,
          total_value: totalValue,
        },
      ])
      .select();

    if (accountError) {
      alert("Erro ao adicionar conta: " + accountError.message);
      return;
    }

    const account = accountsData[0]; // conta recém criada


      parcelas.push({
        account_id: account.id,
        parcel_number: i,
        due_date: formatDateLocal(dueDate), // YYYY-MM-DD em fuso local
        amount: parseFloat(valorParcela.toFixed(2)), // arredonda apenas para consistência
        status: "Em Aberto",
      });
    }

  return (
    <div className="account">
      <Sidebar onLogout={handleLogout} />

      <div className="main">
        <Topbar />

        <main className="container">
          <div className="form-container">
            <button onClick={handleAccount}> Adicionar Conta Variável </button>
            <h2>Adicionar Conta Fixa</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nome da conta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Valor"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button type="submit">Adicionar Conta</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
