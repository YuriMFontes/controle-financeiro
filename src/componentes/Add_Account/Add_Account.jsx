// src/componentes/AddAccount/AddAccount.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";
import "./Add_Account.css";

export default function AddAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [installments, setInstallments] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // pega usuário logado
  const { data: { user } } = await supabase.auth.getUser();

  // referência do mês (primeiro dia do mês atual)
  const referenceMonth = new Date();
  referenceMonth.setDate(1); // sempre dia 1
  const referenceMonthISO = referenceMonth.toISOString().split("T")[0]; // yyyy-mm-01

  // cria a conta
  const { data: accountsData, error: accountError } = await supabase
    .from("accounts")
    .insert([
      {
        user_id: user.id,
        name,
        description,
        total_value: parseFloat(value),
        parcel_count: parseInt(installments),
        reference_month: referenceMonthISO, // salva mês de referência
      },
    ])
    .select();

  if (accountError) {
    alert("Erro ao adicionar conta: " + accountError.message);
    return;
  }

  const account = accountsData[0]; // conta recém criada

  // gera as parcelas com base no reference_month
  const valorParcela = parseFloat(value) / parseInt(installments);
  const parcelas = [];

  // transforma referenceMonthISO em Date
  const startDate = new Date(referenceMonthISO);

  for (let i = 1; i <= installments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    parcelas.push({
      account_id: account.id,
      parcel_number: i,
      due_date: dueDate.toISOString().split("T")[0], // YYYY-MM-DD
      amount: valorParcela,
      status: "Em Aberto",
    });
  }

  // salva parcelas
  const { error: installmentsError } = await supabase
    .from("installments")
    .insert(parcelas);

  if (installmentsError) {
    alert("Conta criada, mas erro ao salvar parcelas: " + installmentsError.message);
  } else {
    alert("Conta e parcelas criadas com sucesso!");
    navigate("/dashboard");
  }
};


  return (
    <div className="account">
      <Sidebar onLogout={handleLogout} />

      <div className="main">
        <Header />

        <main className="container">
          <div className="form-container">
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
              <input
                type="number"
                placeholder="Informe de parcelas"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
              />
              <button type="submit">Adicionar Conta</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
