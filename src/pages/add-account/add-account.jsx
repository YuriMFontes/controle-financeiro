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
  const [accountType, setAccountType] = useState("VARIAVEL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    let installmentsCount;
    if (accountType === "FIXA") {
      installmentsCount = 40;
    } else {
      installmentsCount = parseInt(installments, 10);
      if (
        isNaN(installmentsCount) ||
        installmentsCount <= 0 ||
        installmentsCount > 40
      ) {
        alert("Número de parcelas inválido. Deve ser entre 1 e 40.");
        return;
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const today = new Date();
    let referenceMonth;
    if (today.getDate() > 20) {
      referenceMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    } else {
      referenceMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    const referenceMonthISO = formatDateLocal(referenceMonth);

    const { data: accountsData, error: accountError } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          name,
          description,
          total_value: parseFloat(value), // ✅ corrigido
          parcel_count: installmentsCount,
          reference_month: referenceMonthISO,
          account_type: accountType,
        },
      ])
      .select();

    if (accountError) {
      alert("Erro ao adicionar conta: " + accountError.message);
      return;
    }

    const account = accountsData[0];
    const valorParcela = parseFloat(value) / installmentsCount; // ✅ corrigido
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
      alert(
        "Conta criada, mas erro ao salvar parcelas: " +
          installmentsError.message
      );
    } else {
      alert("Conta e parcelas criadas com sucesso!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="account">
      <Sidebar
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main">
        <Topbar
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="container">
          <div className="form-container">
            <h2>Adicionar Conta</h2>

            {/* Radios bonitos */}
            <div className="radio-group">
              <label className="radio-card">
                <input
                  type="radio"
                  name="accountType"
                  value="VARIAVEL"
                  checked={accountType === "VARIAVEL"}
                  onChange={(e) => setAccountType(e.target.value)}
                />
                <span>Conta Variável</span>
              </label>

              <label className="radio-card">
                <input
                  type="radio"
                  name="accountType"
                  value="FIXA"
                  checked={accountType === "FIXA"}
                  onChange={(e) => setAccountType(e.target.value)}
                />
                <span>Conta Fixa</span>
              </label>
            </div>

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

              {accountType === "VARIAVEL" ? (
                <input
                  type="number"
                  placeholder="Número de parcelas"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                />
              ) : (
                <input type="text" value="36 meses (fixo)" disabled />
              )}

              <button type="submit">Adicionar Conta</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
