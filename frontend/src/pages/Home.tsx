import { useNavigate } from "react-router-dom";
import jogoLogo from '../assets/logo 2.png';
import '../pages/home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>MENTE CRUZADA</h1>
      <div>
        <img src={jogoLogo} alt="Logo do jogo" />
      </div>
      <div className="btn-home">
        <button className="btn-login" onClick={() => navigate('/login')}>
          INICIAR SESSÃO
        </button>

        <button className="btn-register" onClick={() => navigate('/register')}>
          REGISTAR-SE
        </button>
      </div>
    </>
  );
}