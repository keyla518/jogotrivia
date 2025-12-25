import { useNavigate } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <h1>MENTE CRUZADA</h1>

      <div className="menu-buttons">
        <div className="menu-buttons">
            <button id="jogar" onClick={() => navigate("/mapa")}><strong>Jogar</strong></button>
            <button id="ajustes" onClick={() => navigate("/ajustes")}>Ajustes</button>
            <button id="perfil" onClick={() => navigate("/perfil")}>Perfil</button>
            <button id="ajuda" onClick={() => navigate("/ajuda")}>Ajuda</button>
        </div>
      </div>
    </div>
  );
}
