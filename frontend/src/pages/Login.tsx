import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import "./Login.css";
import navio from "../assets/navio.png";
import aviao from "../assets/avião.png";
import linha from "../assets/linha.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [palavrapasse, setPalavrapasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, palavrapasse });

      if (res.data.token) {
        login(res.data.token);
        navigate("/game");
      } else {
        setError(res.data.error || "Erro desconhecido");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro na conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Botão voltar */}
      <button className="btn-back" onClick={() => navigate("/")}>
        ⬅
      </button>

      {/* Painel esquerdo */}
      <div className="left-panel">
        <img src={navio} className="navio-img" alt="Navio português" />

        <div className="fact-box">
          <h2>Sabias que...?</h2>
          <p className="pagrafo_img">
            Portugal foi a primeira potência marítima europeia.
          </p>
        </div>
      </div>

      {/* Linha vertical + avião */}
      <div className="divider">
        <img src={linha} className="linha" alt="" />
        <img src={aviao} className="aviao" alt="" />
      </div>

      {/* Formulário */}
      <div className="right-panel">
        <h1>Iniciar sessão</h1>

        {error && <p className="error-message">{error}</p>}

        <label>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@email.com"
        />

        <label>Palavra passe</label>
        <input 
          type="password"
          value={palavrapasse}
          onChange={(e) => setPalavrapasse(e.target.value)}
          placeholder="••••••••"
        />

        <button 
          className="btn-confirm" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "A entrar..." : "Confirmar"}
        </button>
      </div>
    </div>
  );
}