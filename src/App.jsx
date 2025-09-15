import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./componentes/private-route/private-route"
import Dashboard from "./componentes/Dashboard/Dashboard";
import LoginRegister from "./componentes/login-register/login-register";
import AddAccount from "./componentes/add-account/add-account";
import Info_Payment from "./componentes/info-payment/info-payment";

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
      <Route
        path="/info-payment"
        element={
          <PrivateRoute>
            <Info_Payment />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
