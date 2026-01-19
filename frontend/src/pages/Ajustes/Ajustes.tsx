import "./Ajustes.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Ajustes() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => {
    // Carrega o tema salvo (se existir)
    return localStorage.getItem("theme") === "dark";
  });

  // Aplica o tema sempre que "dark" mudar
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="ajustes-container">
      <button className="btn-back-menu" onClick={() => navigate("/menu")}>
        ←
      </button>

      <h1 className="titulo">MENTE CRUZADA</h1>
      <h2 className="subtitulo">Ajustes</h2>

      <div className="ajustes-lista">
        <div className="ajuste-item">
          <span>Ativar modo escuro</span>
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
        </div>

        <div className="ajuste-item">
          <span>Ativar sons</span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="ajuste-item">
          <span>Idioma</span>
          <select>
            <option>Português</option>
            <option>Inglês</option>
          </select>
        </div>

        <div className="ajuste-item">
          <span>Mostrar dicas automáticas</span>
          <input type="checkbox" />
        </div>

        <div className="ajuste-item botao">
          <button>Repor definições</button>
        </div>
      </div>
    </div>
  );
}
