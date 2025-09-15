// src/componentes/AddAccount/AddAccount.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../../componentes/side-bar/side-bar";
import Topbar from "../../componentes/top-bar/top-bar";
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

  const handleAccountFixed = () => navigate("/add-account-fixed");

  const formatDateLocal = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const { data: { user } } = await supabase.auth.getUser();

    // regra de corte no dia 20
  const today = new Date();
  let referenceMonth;

  if (today.getDate() > 20) {
    // passa pro próximo mês
    referenceMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  } else {
    // fica no mês atual
    referenceMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  const referenceMonthISO = formatDateLocal(referenceMonth);


    // create account with parcel_count and account_type
    const { data: accountsData, error: accountError } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          name,
          description,
          total_value: totalValue,
          parcel_count: installmentsCount,
          reference_month: referenceMonthISO,
          account_type: "VARIAVEL",
        },
      ])
      .select();

    if (accountError) {
      alert("Erro ao adicionar conta: " + accountError.message);
      return;
    }

    const account = accountsData[0];
    const valorParcela = totalValue / installmentsCount;
    const parcelas = [];

    const [year, month] = referenceMonthISO.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);

    for (let i = 1; i <= installmentsCount; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1));

      parcelas.push({
        account_id: account.id,
        parcel_number: i,
        due_date: formatDateLocal(dueDate),
        amount: parseFloat(valorParcela.toFixed(2)),
        status: "Em Aberto",
      });
    }

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
        <Topbar />
        <main className="container">
          <div className="form-container">
            <button onClick={handleAccountFixed}>Adicionar Conta Fixa</button>
            <h2>Adicionar Conta Variável</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nome da conta" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="number" placeholder="Valor" value={value} onChange={(e) => setValue(e.target.value)} required />
              <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
              <input type="number" placeholder="Informe de parcelas" value={installments} onChange={(e) => setInstallments(e.target.value)} />
              <button type="submit">Adicionar Conta</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
