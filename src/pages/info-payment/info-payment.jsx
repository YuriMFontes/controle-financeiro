import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/side-bar/side-bar";
import Topbar from "../../componentes/top-bar/top-bar";
import MonthSelector from "../../componentes/monthselector/monthselector";
import "./info-payment.css";

export default function Info_Payment() {
  const navigate = useNavigate();
  const [installments, setInstallments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleMarkPaid = async (item) => {
    const { error } = await supabase
      .from("installments")
      .update({ status: "Pago", paid_at: new Date().toISOString() })
      .eq("id", item.id);

    if (error) {
      alert("Erro ao marcar pagamento: " + error.message);
    } else {
      setInstallments((prev) =>
        prev.map((inst) => (inst.id === item.id ? { ...inst, status: "Pago" } : inst))
      );
    }
  };

  const formatDateBR = (dateStr) => {
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const fetchInstallments = async (monthDate) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const startStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}-01`;
    const endStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 2).padStart(2, "0")}-01`;

    const { data, error } = await supabase
      .from("installments")
      .select("*, accounts(*)")
      .eq("accounts.user_id", user.id)
      .gte("due_date", startStr)
      .lt("due_date", endStr)
      .order("due_date", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setInstallments(data || []);
  };

  useEffect(() => {
    fetchInstallments(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="payment">
      <Sidebar onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main">
        <Topbar onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />

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
                  {item.accounts?.account_type === "VARIAVEL" ? (
                    <>
                      Parcela: {item.parcel_number} / {item.accounts?.parcel_count}
                      <br />
                      Valor: R$ {Number(item.amount).toFixed(2)}
                      <br />
                      Vencimento: {formatDateBR(item.due_date)}
                    </>
                  ) : (
                    <>
                      Conta fixa do mês
                      <br />
                      Valor: R$ {Number(item.amount).toFixed(2)}
                      <br />
                      Vencimento: {formatDateBR(item.due_date)}
                    </>
                  )}
                  <br />
                  Status:{" "}
                  <span className={item.status === "Pago" ? "status-paid" : "status-pending"}>
                    {item.status}
                  </span>
                  <div className="card-buttons">
                    <button onClick={() => handleEdit(item)}>Editar</button>
                    {item.status !== "Pago" && (
                      <button onClick={() => handleMarkPaid(item)}>Informar Pagamento</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
