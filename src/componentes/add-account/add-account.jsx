// src/componentes/AddAccount/AddAccount.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../side-bar/side-bar";
import Header from "../header/header";
import "./add-account.css";

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

  const formatDateLocal = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validações básicas
    const installmentsCount = parseInt(installments, 10);
    if (!installmentsCount || installmentsCount <= 0) {
      alert("Informe um número de parcelas válido.");
      return;
    }
    const totalValue = parseFloat(value);
    if (!totalValue || totalValue <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    // pega usuário logado
    const { data: { user } } = await supabase.auth.getUser();

    // referência do mês (primeiro dia do mês atual) - local
    const referenceMonth = new Date();
    referenceMonth.setDate(1); // sempre dia 1
    const referenceMonthISO = formatDateLocal(referenceMonth); // yyyy-mm-01

    // cria a conta
    const { data: accountsData, error: accountError } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          name,
          description,
          total_value: totalValue,
          parcel_count: installmentsCount,
          reference_month: referenceMonthISO, // salva mês de referência (date ou text dependendo do schema)
        },
      ])
      .select();

    if (accountError) {
      alert("Erro ao adicionar conta: " + accountError.message);
      return;
    }

    const account = accountsData[0]; // conta recém criada

    // gera as parcelas com base no reference_month (sem problemas de fuso)
    const valorParcela = totalValue / installmentsCount;
    const parcelas = [];

    // cria startDate local com ano e mês garantido
    const [year, month] = referenceMonthISO.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);

    for (let i = 1; i <= installmentsCount; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1));

      parcelas.push({
        account_id: account.id,
        parcel_number: i,
        due_date: formatDateLocal(dueDate), // YYYY-MM-DD em fuso local
        amount: parseFloat(valorParcela.toFixed(2)), // arredonda apenas para consistência
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
