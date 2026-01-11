import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import navio from "../../assets/nazare.png";
import aviao from "../../assets/avião.png";
import linha from "../../assets/linha.png";
import setavoltar from "../../assets/setavoltar.svg";
import { registerUser } from "../../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [nomeUsuario, setnomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await registerUser({ nomeUsuario, email, palavrapasse: password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/login");

      
    } catch (err: any) {
      console.error("Ocorreu um erro no registro", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erro no registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        ←
      </button>

      <div className="login-content">
        <div className="left-panel">
          <div className="image-wrapper">
            <img src={navio} className="navio-img" alt="Navio português" />
            <div className="fact-box">
              <h2>Sabias que...?</h2>
              <p>As maiores ondas do mundo são surfadas em Nazaré.
                Atinguem mais de 30 metros de altura.
              </p>
            </div>
          </div>
        </div>

        <div className="divider">
          <img src={linha} className="linha" alt="" />
          <img src={aviao} className="aviao" alt="Avião" />
        </div>

        <div className="right-panel">
          <div className="login-card">
            <h1>Registo</h1>

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="nome">Nome de utilizador</label>
                <input
                  id="nomeUsuario"
                  type="text"
                  value={nomeUsuario}
                  onChange={(e) => setnomeUsuario(e.target.value)}
                  placeholder="exemplo123"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Palavra-passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-confirm"
                disabled={isLoading}
              >
                {isLoading ? "A entrar..." : "Confirmar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}