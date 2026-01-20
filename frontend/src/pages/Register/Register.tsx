import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import navio from "../../assets/canvanazare.png";
import aviao from "../../assets/avião.png";
import linha from "../../assets/linha.png";
import { registerUser } from "../../api/auth";
import { Button, BackButton } from "../../components/Button";

export default function Register() {
  const navigate = useNavigate();
  const [nomeUsuario, setnomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const isValidEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const isValidName = (name: string) => {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name); 
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };



  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Por favor insira um email válido.");
      return;
    }
    if (!isValidName(nomeUsuario)) {
      setError("O nome só pode conter letras.");
      return;
    }
    if (!isValidPassword(password)) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({ nomeUsuario, email, palavrapasse: password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/login");

      
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      const statusCode = err.response?.status;

      if (statusCode === 400 && apiError === "Email já está em uso.") {
        setError("Este email já está em uso");
      } else if (statusCode === 400 && apiError === "Email inválido.") {
        setError("O email inserido é inválido.");
      } else {
        setError(apiError || "Erro no registro");
      }

      console.error("Erro no registro:", apiError || err.message);
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