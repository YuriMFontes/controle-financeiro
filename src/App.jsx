import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./componentes/LoginRegister/LoginRegister";
import Dashboard from "./componentes/Dashboard/Dashboard";
import PrivateRoute from "./componentes/PrivateRoute/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginRegister />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
