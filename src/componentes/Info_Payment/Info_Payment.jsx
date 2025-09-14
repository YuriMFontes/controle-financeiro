import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";
import "./Info_Payment.css";

export default function Info_Payment() {
  const navigate = useNavigate();
  const [installments, setInstallments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // mês selecionado

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Função para pegar parcelas do mês selecionado
  const fetchInstallments = async (monthDate) => {
    const { data: { user } } = await supabase.auth.getUser();

    const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

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
          parcel_count
        )
      `)
      .eq("accounts.user_id", user.id)
      .gte("due_date", start.toISOString().split("T")[0])
      .lte("due_date", end.toISOString().split("T")[0])
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
    setSelectedMonth(new Date(e.target.value + "-01")); // formato yyyy-mm
  };

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
            value={selectedMonth.toISOString().slice(0, 7)}
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
                  Parcela: {item.parcel_number} / {item.accounts.parcel_count}  
                  <br />
                  Valor: R$ {item.amount.toFixed(2)}  
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
