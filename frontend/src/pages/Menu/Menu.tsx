import { useNavigate } from "react-router-dom";
import "./Menu.css";
import { Button } from "../../components/Button";
import logoutIcon from '../../assets/left-chevron.png';

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="back-button-container">
      <Button
      variant="cancel"
      size="small"
      onClick={() => navigate("/")}
    >
      <img 
        src={logoutIcon} 
        alt="Sair" 
        style={{ width: '20px', height: '20px' }} 
      />
    </Button>
                
      </div>
      <h1>MENTE CRUZADA</h1>

      <div className="menu-buttons">
        <div className="menu-buttons">
            <Button variant="action" size="large" onClick={() => navigate("/mapa")}>Jogar</Button>
            <Button variant="tertiary" size="large" onClick={() => navigate("/ajustes")}>Configurações</Button>
            <Button variant="secondary" size="large" onClick={() => navigate("/perfil")}>Perfil</Button>
            <Button variant="primary" size="large" onClick={() => navigate("/ajuda")}>Ajuda</Button>
        </div>
      </div>
    </div>
  );
}
