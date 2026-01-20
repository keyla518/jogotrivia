import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import navio from "../../assets/navio.png";
import aviao from "../../assets/avião.png";
import linha from "../../assets/linha.png";
import { loginUser } from "../../api/auth";
import { jwtDecode } from "jwt-decode";
import { Button, BackButton } from "../../components/Button";

interface DecodedToken {
  role: string;
  exp?: number;
  iat?: number;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser({ email, palavrapasse: password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode<DecodedToken>(token);

      // Navegação mais clara e consistente
      if (decoded.role === "admin") {
        navigate("/backoffice/perguntas");
      } else {
        navigate("/menu");
      }
      
    } catch (err: any) {
      console.error("Erro no login:", err.response?.data || err.message);
      setError("Email ou palavra-passe incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="back-button-container">
        <BackButton onClick={() => navigate("/")}/>
          
      </div>

      <div className="login-content">
        <div className="left-panel">
          <div className="image-wrapper">
            <img src={navio} className="navio-img" alt="Navio português" />
            <div className="fact-box">
              <h2>Sabias que...?</h2>
              <p>Portugal foi a primeira potência marítima europeia.</p>
            </div>
          </div>
        </div>

        <div className="divider">
          <img src={linha} className="linha" alt="" />
          <img src={aviao} className="aviao" alt="Avião" />
        </div>

        <div className="right-panel">
          <div className="login-card">
            <h1>Iniciar sessão</h1>

            <form onSubmit={handleLogin}>
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

               <div className="btn-login">
                <Button 
                  variant="action"
                  disabled={isLoading}
                >
                  {isLoading ? "A entrar..." : "Confirmar"}
                </Button>
               </div> 
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}