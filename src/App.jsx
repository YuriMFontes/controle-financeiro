import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./componentes/LoginRegister/LoginRegister";
import Dashboard from "./componentes/Dashboard/Dashboard";
import PrivateRoute from "./componentes/PrivateRoute/PrivateRoute";
import AddAccount from "./componentes/Add_Account/add_account";

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
      <Route
        path="/add-account"
        element={
          <PrivateRoute>
            <AddAccount />
          </PrivateRoute>
    }
  />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
