// src/componentes/AddAccount/AddAccount.js
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Add_Account.css";

export default function AddAccount() {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Inserir a nova conta no Supabase (tabela "accounts")
    const { error } = await supabase.from("accounts").insert([
      {
        name,
        balance: parseFloat(balance),
      },
    ]);

    if (error) {
      alert("Erro ao adicionar conta: " + error.message);
    } else {
      alert("Conta adicionada com sucesso!");
      navigate("/dashboard"); // voltar para o dashboard 
    }
  };

  return (
    <div className="add-account-container">
      <h2>Adicionar Conta</h2>
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
          placeholder="Saldo inicial"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
        <button type="button" onClick={() => navigate("/dashboard")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
