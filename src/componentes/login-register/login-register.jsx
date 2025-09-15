import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./login-register.css";

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      // Cadastro
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        alert(error.message);
      } else {
        const user = data.user;

        // Cria o perfil na tabela profiles
        if (user) {
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              id: user.id,
              full_name: fullName,
            },
          ]);

          if (profileError) {
            console.error("Erro ao criar perfil:", profileError.message);
          }
        }

        alert("Conta criada! Faça login.");
        setIsRegister(false);
      }
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
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
    <div className="app">
      <div className="container-login">
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
    </div>
  );
}
