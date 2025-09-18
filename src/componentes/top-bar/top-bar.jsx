import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./top-bar.css";
import logo from "../../assets/logo.png";
import EditProfileModal from "../caixa/edit-profile-modal";

export default function Topbar({ onLogout, onToggleSidebar }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleEditProfile = () => setIsEditModalOpen(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erro ao pegar usuário:", userError.message);
        return;
      }

      if (currentUser) {
        setUserId(currentUser.id);

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

  return (
    <aside className="Header">
      <header className="topbar">
        {/* Botão de menu mobile */}
        <button className="menu-btn" onClick={onToggleSidebar}>
          ☰
        </button>

        <div className="profile">
          <h1 className="bem-vindo desktop-only">
            {fullName ? `Olá, ${fullName}` : "Olá!"}
          </h1>
          <img src={logo} alt="perfil" className="avatar" />
          <div className="actions desktop-only">
            <button onClick={handleEditProfile} className="action-btn">
              Editar Perfil
            </button>
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userId={userId}
          onProfileUpdated={setFullName}
        />
      </header>
    </aside>
  );
}
