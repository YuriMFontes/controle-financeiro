// src/componentes/Info_Payment.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/side-bar/side-bar";
import Topbar from "../../componentes/top-bar/top-bar";
import "./info-payment.css";

export default function Info_Payment() {
  const navigate = useNavigate();
  const [installments, setInstallments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // mês selecionado

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // 🔹 função para formatar data em "YYYY-MM-DD"
  const formatDateLocal = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 🔹 busca parcelas e contas fixas
  const fetchInstallments = async (monthDate) => {
    const { data: { user } } = await supabase.auth.getUser();

    const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

    const startStr = formatDateLocal(start);
    const endStr = formatDateLocal(end);

    // parcelas (contas variáveis)
    const { data: installmentsData, error: installmentsError } = await supabase
      .from("installments")
      .select(`
        id,
        parcel_number,
        due_date,
        amount,
        status,
        accounts!inner (
          id,
          user_id,
          name,
          parcel_count,
          description,
          account_type
        )
      `)
      .eq("accounts.user_id", user.id)
      .gte("due_date", startStr)
      .lt("due_date", endStr)
      .order("due_date", { ascending: true });

    if (installmentsError) console.error(installmentsError);

    // contas fixas
    const { data: fixedAccounts, error: fixedError } = await supabase
      .from("accounts")
      .select("id, name, description, total_value, account_type")
      .eq("user_id", user.id)
      .eq("account_type", "FIXA");

    if (fixedError) console.error(fixedError);

    // junta parcelas variáveis e fixas em uma lista só
    const merged = [
      ...(installmentsData || []).map((i) => ({ ...i, type: "VARIAVEL" })),
      ...(fixedAccounts || []).map((f) => ({
        id: f.id,
        parcel_number: null,
        due_date: startStr, // mês selecionado
        amount: f.total_value,
        status: "A Pagar",
        accounts: f,
        type: "FIXA",
      })),
    ];

    setInstallments(merged);
  };

  // busca toda vez que mudar o mês
  useEffect(() => {
    fetchInstallments(selectedMonth);
  }, [selectedMonth]);

  // mudar mês pelo input
  const handleMonthChange = (e) => {
    const [y, m] = e.target.value.split("-");
    setSelectedMonth(new Date(Number(y), Number(m) - 1, 1));
  };

  // valor do input mês
  const monthInputValue = `${selectedMonth.getFullYear()}-${String(
    selectedMonth.getMonth() + 1
  ).padStart(2, "0")}`;

  return (
    <div className="payment">
      <Sidebar onLogout={handleLogout} />

      <main className="main">
        <Topbar />

        {/* Menu de seleção do mês */}
        <div className="month-selector">
          <label>Selecione o mês: </label>
          <input
            type="month"
            value={monthInputValue}
            onChange={handleMonthChange}
          />
        </div>

        <div className="list">
          <h2>Pagamentos do Mês:</h2>
          {installments.length === 0 ? (
            <p>Nenhuma parcela para este mês.</p>
          ) : (
            <ul>
              {installments.map((item) => (
                <li key={item.id}>
                  <strong>{item.accounts?.name}</strong>
                  <br />
                  <em>{item.accounts?.description}</em>
                  <br />
                  {item.type === "VARIAVEL" ? (
                    <>
                      Parcela: {item.parcel_number} / {item.accounts?.parcel_count}
                      <br />
                      Valor: R$ {Number(item.amount).toFixed(2)}
                      <br />
                      Vencimento:{" "}
                      {new Date(item.due_date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                      <br />
                      Status: {item.status}
                    </>
                  ) : (
                    <>
                      Conta fixa do mês
                      <br />
                      Valor: R$ {Number(item.amount).toFixed(2)}
                      <br />
                      Status: {item.status}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
