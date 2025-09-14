// src/componentes/Info_Payment.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import Header from "../Header";
import "./index.css";

export default function Info_Payment() {
  const navigate = useNavigate();
  const [installments, setInstallments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // mês selecionado

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

  const fetchInstallments = async (monthDate) => {
    const { data: { user } } = await supabase.auth.getUser();

    // start = primeiro dia do mês (local)
    const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    // end = primeiro dia do próximo mês (local)
    const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

    const startStr = formatDateLocal(start);
    const endStr = formatDateLocal(end); // < endStr

    const { data, error } = await supabase
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
          description
        )
      `)
      .eq("accounts.user_id", user.id)
      .gte("due_date", startStr)
      .lt("due_date", endStr)
      .order("due_date", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setInstallments(data);
    }
  };

  useEffect(() => {
    fetchInstallments(selectedMonth);
  }, [selectedMonth]);

  // Handler para mudar mês
  const handleMonthChange = (e) => {
    // e.target.value no formato "YYYY-MM"
    const [y, m] = e.target.value.split("-");
    setSelectedMonth(new Date(Number(y), Number(m) - 1, 1));
  };

  const monthInputValue = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="payment">
      <Sidebar onLogout={handleLogout} />

      <main className="main">
        <Header />

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
          <h2>Pagamentos Do Mês:</h2>
          {installments.length === 0 ? (
            <p>Nenhuma parcela para este mês.</p>
          ) : (
            <ul>
              {installments.map((item) => (
                <li key={item.id}>
                  <strong>{item.accounts?.name}</strong>
                  <br />
                  <em>{item.accounts?.description}</em> {/* <-- Aqui é o lugar mais natural */}
                  <br />
                  Parcela: {item.parcel_number} / {item.accounts?.parcel_count}
                  <br />
                  Valor: R$ {Number(item.amount).toFixed(2)}
                  <br />
                  Mês:{" "}
                  {new Date(item.due_date).toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                  <br />
                  Status: {item.status}
                  <br />
                  <span className="remaining">
                    {item.accounts.parcel_count - item.parcel_number} parcelas restantes
                  </span>
                </li>
              ))}
            </ul>

          )}
        </div>
      </main>
    </div>
  );
}
