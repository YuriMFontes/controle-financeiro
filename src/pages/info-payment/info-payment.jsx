// src/componentes/Info_Payment.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/side-bar/side-bar";
import Topbar from "../../componentes/top-bar/top-bar";
import { formatDateLocal, firstDayOfMonth, formatDateBR } from "../../componentes/date/date";
import "./info-payment.css";
import MonthSelector from "../../componentes/monthselector/monthselector";

export default function Info_Payment() {
  const navigate = useNavigate();
  const [installments, setInstallments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
        prev.map((inst) =>
          inst.id === item.id ? { ...inst, status: "Pago", paid_at: new Date() } : inst
        )
      );
    }
  };

  const fetchInstallments = async (monthDate) => {
    const { data: { user } } = await supabase.auth.getUser();

    const start = firstDayOfMonth(monthDate);
    const end = firstDayOfMonth(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1));

    const startStr = formatDateLocal(start);
    const endStr = formatDateLocal(end);

    // Contas variáveis
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

    // Contas fixas
    const { data: fixedAccounts, error: fixedError } = await supabase
      .from("accounts")
      .select("id, name, description, total_value, account_type")
      .eq("user_id", user.id)
      .eq("account_type", "FIXA");

    if (fixedError) console.error(fixedError);

    // Mescla contas variáveis e fixas
    const merged = [
      ...(installmentsData || []).map((i) => ({ ...i, type: "VARIAVEL" })),
      ...(fixedAccounts || []).map((f) => ({
        id: f.id,
        parcel_number: null,
        due_date: new Date(monthDate),
        amount: f.total_value,
        status: "Em Aberto",
        accounts: f,
        type: "FIXA",
      })),
    ];

    setInstallments(merged);
  };

  useEffect(() => {
    fetchInstallments(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="payment">
      <Sidebar onLogout={handleLogout} />

      <main className="main">
        <Topbar />

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
                  {item.type === "VARIAVEL" ? (
                    <>
                      Parcela: {item.parcel_number} / {item.accounts?.parcel_count}
                      <br />
                      Valor: R$ {Number(item.amount).toFixed(2)}
                      <br />
                      Vencimento: {formatDateBR(item.due_date)}
                      <br />
                      Status:{" "}
                      <span className={item.status === "Pago" ? "status-paid" : "status-pending"}>
                        {item.status}
                      </span>
                    </>
                  ) : (
                    <>
                      Conta fixa do mês
                      <br />
                      Valor: R$ {Number(item.amount).toFixed(2)}
                      <br />
                      Vencimento: {formatDateBR(item.due_date)}
                      <br />
                      Status:{" "}
                      <span className={item.status === "Pago" ? "status-paid" : "status-pending"}>
                        {item.status}
                      </span>
                    </>
                  )}

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

        {isModalOpen && selectedItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Editar Conta</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (selectedItem.type === "VARIAVEL") {
                    const { error } = await supabase
                      .from("installments")
                      .update({
                        amount: selectedItem.amount,
                        status: selectedItem.status,
                      })
                      .eq("id", selectedItem.id);

                    if (error) {
                      alert("Erro ao atualizar: " + error.message);
                    } else {
                      setInstallments((prev) =>
                        prev.map((i) => (i.id === selectedItem.id ? selectedItem : i))
                      );
                      handleCloseModal();
                    }
                  } else {
                    const { error } = await supabase
                      .from("accounts")
                      .update({
                        total_value: selectedItem.amount,
                      })
                      .eq("id", selectedItem.id);

                    if (error) {
                      alert("Erro ao atualizar conta fixa: " + error.message);
                    } else {
                      setInstallments((prev) =>
                        prev.map((i) => (i.id === selectedItem.id ? selectedItem : i))
                      );
                      handleCloseModal();
                    }
                  }
                }}
              >
                <label>
                  Valor:
                  <input
                    type="number"
                    value={selectedItem.amount}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, amount: e.target.value })
                    }
                  />
                </label>

                <label>
                  Status:
                  <select
                    value={selectedItem.status}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, status: e.target.value })
                    }
                    disabled={selectedItem.type === "FIXA"} // fixa não tem status
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
                      if (window.confirm("Tem certeza que deseja excluir essa conta?")) {
                        let error;
                        if (selectedItem.type === "VARIAVEL") {
                          const { error: err } = await supabase
                            .from("installments")
                            .delete()
                            .eq("id", selectedItem.id);
                          error = err;
                        } else if (selectedItem.type === "FIXA") {
                          const { error: err } = await supabase
                            .from("accounts")
                            .delete()
                            .eq("id", selectedItem.id);
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
