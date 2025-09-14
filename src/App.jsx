// App.jsx
import { useState } from "react";
import "./App.css";

export default function App() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="app">
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
          <form>
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
    </div>
  );
}
