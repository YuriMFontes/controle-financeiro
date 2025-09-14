import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // aqui você faria o login/registro com Supabase
    // se der certo:
    navigate("/dashboard"); // redireciona para dashboard
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h1>Bem-vindo!</h1>
        <p>{isRegister ? "Já possui conta?" : "Ainda não tem conta?"}</p>
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Registrar"}
        </button>
      </div>

      <div className="right-panel">
        <h2>{isRegister ? "Registrar" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input type="text" placeholder="Nome completo" required />
          )}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Senha" required />
          {isRegister && (
            <input type="password" placeholder="Confirmar senha" required />
          )}
          <button type="submit">{isRegister ? "Cadastrar" : "Entrar"}</button>
        </form>
      </div>
    </div>
  );
}
