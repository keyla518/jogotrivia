import { useNavigate } from "react-router-dom";
import { Button } from '../../components/Button'; 
import jogoLogo from '../../assets/logo 2.png';
import './home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>MENTE CRUZADA</h1>
      <div>
        <img src={jogoLogo} alt="Logo do jogo" />
      </div>
      <div className="btn-home">
        <Button 
          variant="primary"  
          onClick={() => navigate('/login')}
        >
          Iniciar Sessão
        </Button>

        <Button 
          variant="action" 
          onClick={() => navigate('/register')}
        >
          Registar-se
        </Button>
      </div>
    </>
  );
}