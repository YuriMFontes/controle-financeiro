import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./componentes/LoginRegister/LoginRegister";
import Dashboard from "./componentes/Dashboard/Dashboard";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const user = supabase.auth.getUser(); // retorna o usuário logado
  const isLoggedIn = !!user; // true se tiver usuário

  return (
    <Routes>
      <Route path="/auth" element={<LoginRegister />} />
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" replace />}
      />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
