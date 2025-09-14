import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./componentes/LoginRegister/LoginRegister";
import Dashboard from "./componentes/Dashboard/Dashboard";

export default function App() {
  const isLoggedIn = false; // depois você troca pro Supabase

  return (
    <Routes>
      {/* Login / Registro */}
      <Route path="/auth" element={<LoginRegister />} />

      {/* Dashboard protegido */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" replace />}
      />

      {/* Rota padrão */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
