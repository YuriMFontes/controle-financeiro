import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./top-bar.css";
import logo from "../../assets/logo.png";

export default function Topbar({ onLogout }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  const handleFiscal = async () => (
    alert("EM CONSTRUÇÃO")
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const user = supabase.auth.getUser(); // pega o usuário logado
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erro ao pegar usuário:", userError.message);
        return;
      }

      if (currentUser) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", currentUser.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error.message);
        } else {
          setFullName(data.full_name);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <aside className="Header">
      <header className="topbar">
        <div className="profile">
          <h1 className="bem-vindo">{fullName ? `Olá, ${fullName}` : "Olá!"}</h1>
          <img src={logo} alt="perfil" className="avatar" />
          <div className="actions">
            <button onClick={handleFiscal} className="action-btn">Editar Perfil</button>
          </div>
        </div>
      </header>
    </aside>
  );
}
