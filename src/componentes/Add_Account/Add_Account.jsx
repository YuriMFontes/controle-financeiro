import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";                                                                                                      
import Sidebar from "../SideBar/SideBar";
import "./Add_Account.css"; 
import Header from "../Header/Header";   

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
    <div className="account">
          <Sidebar onLogout={handleLogout} />
          
          {/* Conteúdo principal */}
          <main className="main">
            <Header/>
            
          </main>
        </div>

  );
}