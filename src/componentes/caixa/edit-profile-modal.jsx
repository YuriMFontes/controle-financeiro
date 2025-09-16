import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./modal.css";

export default function EditProfileModal({ isOpen, onClose, userId, onProfileUpdated }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Carregar perfil quando o modal abrir
  useEffect(() => {
    if (isOpen && userId) {
      const fetchProfile = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Erro ao buscar usuário:", userError.message);
          return;
        }

        setEmail(userData?.user?.email || "");

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Erro ao carregar perfil:", error.message);
        } else {
          setFullName(data.full_name || "");
        }
      };

      fetchProfile();
    }
  }, [isOpen, userId]);

  const handleSave = async () => {
    setLoading(true);

    try {
      // Atualizar nome na tabela profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Atualizar email e senha (auth.users)
      const updates = {};
      if (email) updates.email = email;
      if (newPassword) updates.password = newPassword;

      if (Object.keys(updates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(updates);
        if (authError) throw authError;
      }

      // Atualiza no estado pai
      onProfileUpdated(fullName);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar alterações:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Perfil</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label">Nome Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Digite seu nome"
              className="modal-input"
            />
          </div>
          <div className="modal-actions">
            <button className="modal-button cancel" onClick={onClose}>Cancelar</button>
            <button className="modal-button save" onClick={handleSave} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
