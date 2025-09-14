import { useNavigate } from "react-router-dom";
import "./index.css";
import logo from "../../assets/logo.png";

export default function Header({ onLogout }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate("/dashboard");
  };

  return (
    <aside className="Header">
      {/* Topbar */}
              <header className="topbar">
                <div className="profile">
                  <img src={logo} alt="perfil" className="avatar" />
                  <div className="actions">
                    <button className="action-btn">Editar Perfil</button>
                  </div>
                </div>
              </header>
    </aside>
  );
}