import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";                                                                                                      
import Sidebar from "../SideBar/SideBar";
import "./Info_Payment.css";    

export default function Info_Payment() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate("/dashboard");
  };

  const handleAddAccount = () => {
    navigate("/add-account");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleReports = () => {
    alert("Gerar relatórios em PDF");
  };

  return (
    <div className="payment">
        <Sidebar onLogout={handleLogout} />

      {/* Conteúdo principal */}
      
    </div>
  );
}