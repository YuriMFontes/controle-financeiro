import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./LoginRegister.css"

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      // Cadastro
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      } else {
        alert("Conta criada! Faça login.");
        setIsRegister(false);
      }
    } else {
      // Login
      const { error, session } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        navigate("/dashboard");
      }
    }
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
            <input
              type="text"
              placeholder="Nome completo"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <input type="password" placeholder="Confirmar senha" required />
          )}
          <button type="submit">{isRegister ? "Cadastrar" : "Entrar"}</button>
        </form>
      </div>
    </div>
  );
}
