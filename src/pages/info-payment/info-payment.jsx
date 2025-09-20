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
    setSelectedItem({ ...item });
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
        prev.map((inst) =>
          inst.id === item.id
            ? { ...inst, status: "Pago", paid_at: new Date().toISOString() }
            : inst
        )
      );
    }
  };

  const formatDateBR = (dateStr) => {
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const fetchInstallments = async (monthDate) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const startStr = `${monthDate.getFullYear()}-${String(
      monthDate.getMonth() + 1
    ).padStart(2, "0")}-01`;
    const endStr = `${monthDate.getFullYear()}-${String(
      monthDate.getMonth() + 2
    ).padStart(2, "0")}-01`;

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

  // ✅ Função corrigida fora do JSX
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      if (selectedItem.accounts.account_type === "VARIAVEL") {
        // Atualiza conta variável
        const { error } = await supabase
          .from("installments")
          .update({
            amount: parseFloat(selectedItem.amount),
            status: selectedItem.status,
            paid_at:
              selectedItem.status === "Pago"
                ? new Date().toISOString()
                : null,
          })
          .eq("id", selectedItem.id);

        if (error) throw error;
      } else if (selectedItem.accounts.account_type === "FIXA") {
        // Atualiza conta fixa na installments
        const { error } = await supabase
          .from("installments")
          .update({
            amount: parseFloat(selectedItem.amount),
            status: selectedItem.status,
            paid_at:
              selectedItem.status === "Pago"
                ? new Date().toISOString()
                : null,
          })
          .eq("id", selectedItem.id);

        if (error) throw error;

        // E também atualiza accounts
        const { error: accountError } = await supabase
          .from("accounts")
          .update({
            total_value: parseFloat(selectedItem.amount),
          })
          .eq("id", selectedItem.accounts.id);

        if (accountError) throw accountError;
      }

      setInstallments((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? { ...selectedItem } : i))
      );

      handleCloseModal();
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  return (
    <div className="payment">
      <Sidebar
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main">
        <Topbar
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <MonthSelector
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
        />

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
                      Parcela: {item.parcel_number} /{" "}
                      {item.accounts?.parcel_count}
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
                  <span
                    className={
                      item.status === "Pago"
                        ? "status-paid"
                        : "status-pending"
                    }
                  >
                    {item.status}
                  </span>
                  <div className="card-buttons">
                    <button onClick={() => handleEdit(item)}>Editar</button>
                    {item.status !== "Pago" && (
                      <button onClick={() => handleMarkPaid(item)}>
                        Informar Pagamento
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isModalOpen && selectedItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Editar Conta</h3>
              <form onSubmit={onSubmit}>
                <label>
                  Valor:
                  <input
                    type="number"
                    value={selectedItem.amount}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        amount: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Status:
                  <select
                    value={selectedItem.status}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Em Aberto">A Pagar</option>
                    <option value="Pago">Pago</option>
                  </select>
                </label>

                <div className="modal-buttons">
                  <button type="submit">Salvar</button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Tem certeza que deseja excluir essa conta?"
                        )
                      ) {
                        let error;
                        if (
                          selectedItem.accounts.account_type === "VARIAVEL"
                        ) {
                          const { error: err } = await supabase
                            .from("installments")
                            .delete()
                            .eq("id", selectedItem.id);
                          error = err;
                        } else if (
                          selectedItem.accounts.account_type === "FIXA"
                        ) {
                          const { error: err } = await supabase
                            .from("accounts")
                            .delete()
                            .eq("id", selectedItem.accounts.id);
                          error = err;
                        }

                        if (error) {
                          alert("Erro ao excluir: " + error.message);
                        } else {
                          setInstallments((prev) =>
                            prev.filter((i) => i.id !== selectedItem.id)
                          );
                          handleCloseModal();
                        }
                      }
                    }}
                  >
                    Excluir
                  </button>
                  <button type="button" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
