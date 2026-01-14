import "./Ajustes.css";
import { useNavigate } from "react-router-dom";

export default function Ajustes() {
  const navigate = useNavigate();
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
          <input type="checkbox" />
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
            <option>Espanhol</option>
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
