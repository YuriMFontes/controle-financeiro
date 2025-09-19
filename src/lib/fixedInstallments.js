import { supabase } from "./supabaseClient";
import { formatDateLocal } from "../componentes/date/date";

export async function ensureFixedInstallments(monthDate) {
  // Pega todas as contas fixas do usuário
  const { data: { user } } = await supabase.auth.getUser();

  const { data: fixedAccounts, error: accError } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("account_type", "FIXA");

  if (accError) throw accError;

  for (const acc of fixedAccounts) {
    // Checa se a parcela para o mês já existe
    const { data: existing, error: existingError } = await supabase
      .from("fixed_installments")
      .select("id")
      .eq("account_id", acc.id)
      .eq("month_date", formatDateLocal(monthDate))
      .maybeSingle(); // evita erro se não existir

    if (!existing) {
      await supabase.from("fixed_installments").insert([
        {
          account_id: acc.id,
          month_date: formatDateLocal(monthDate),
          amount: acc.total_value,
          status: "Em Aberto",
        },
      ]);
    }
  }
}
