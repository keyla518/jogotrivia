import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import navio from "../../assets/navio.png";
import aviao from "../../assets/avião.png";
import linha from "../../assets/linha.png";
import setavoltar from "../../assets/setavoltar.svg";
import { loginUser } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, palavrapasse: password });
      
      localStorage.setItem("token", response.data.token);

      navigate("/Menu/Menu");
    
    } catch (err: any) {
      console.error("Error en login:", err.response?.data || err.message);
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <button className="btn-back">
        <img src={setavoltar} alt="Volver" />
      </button>

      <div className="left-panel">
        <img src={navio} className="navio-img" />
        <div className="fact-box">
          <h2>Sabias que...?</h2>
          <p className="pagrafo_img">
            Portugal foi a primeira potência marítima europeia.
          </p>
        </div>
      </div>

      <div className="divider">
        <img src={linha} className="linha" />
        <img src={aviao} className="aviao" />
      </div>

      <div className="right-panel">
        <h1>Iniciar sessão</h1>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Palavra passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-confirm" onClick={handleLogin}>
          Confirmar
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
