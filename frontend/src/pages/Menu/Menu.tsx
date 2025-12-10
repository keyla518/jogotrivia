import { useNavigate } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <h1>Bem-vindo!</h1>
      <p>Escolha uma opção:</p>

      <div className="menu-buttons">
        <button onClick={() => navigate("/game")}>Jogar</button>
        <button onClick={() => navigate("/ajustes")}>Ajustes</button>
        <button onClick={() => navigate("/perfil")}>Perfil</button>
        <button onClick={() => navigate("/ajuda")}>Ajuda</button>
      </div>
    </div>
  );
}
