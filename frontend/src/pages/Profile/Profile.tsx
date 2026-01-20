import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { getProfile, updateProfile  } from "../../api/user";
import { BackButton, Button } from "../../components/Button";

interface PerfilUsuario {
  usuarioID: number;
  email: string;
  moedas: number;
  pontos: number;
  nomeUsuario: string;
}


export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        setPerfil(response.data.usuario);
        setNomeUsuario(response.data.usuario.nomeUsuario);
        setEmail(response.data.usuario.email);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        setError("Erro ao carregar perfil");
        
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleSalvar = async () => {
    try {
      setSalvando(true);
      setError(null);
      setSucesso(false);

      await updateProfile({
        nomeUsuario,
        email,
      });

      // Atualiza o estado local
      setPerfil((prev) => prev ? { ...prev, nomeUsuario, email } : null);
      setEditando(false);
      setSucesso(true);

      // Remove mensagem de sucesso após 3 segundos
      setTimeout(() => setSucesso(false), 3000);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      if (err.response?.status === 409) {
        setError(err.response.data.error); // "Email já em uso" ou "Nome já em uso"
      } else if (err.response?.status === 400) {
        setError(err.response.data.error); // Erros de validação
      } else {
        setError("Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    if (perfil) {
      setNomeUsuario(perfil.nomeUsuario);
      setEmail(perfil.email);
    }
    setEditando(false);
    setError(null);
  };

  return (
    <div className="perfil-container">
      <div className="back-button-container">
        <BackButton onClick={() => navigate("/menu")} />
      </div>
      <h1 className="titulo">MENTE CRUZADA</h1>
      
      <div className="perfil-card">
        {/* <div className="foto-perfil">
          <div className="foto-placeholder">
            <i className="fa-regular fa-user"></i>
          </div>
          <p className="alterar-foto">
            <a href="#">Alterar foto do perfil</a>
          </p>
        </div> */}

        <div className="info">
          {loading ? (
            <p>A carregar perfil...</p>
          ) : perfil ? (
            <>
              {sucesso && (
                <div className="mensagem-sucesso">
                  Perfil atualizado com sucesso!
                </div>
              )}
              
              {error && (
                <div className="mensagem-erro">
                  {error}
                </div>
              )}

              <div className="info-box">
                <i className="fa-regular fa-user"></i>
                {editando ? (
                  <input
                    type="text"
                    value={nomeUsuario}
                    onChange={(e) => setNomeUsuario(e.target.value)}
                    className="input-editar"
                    placeholder="Nome de usuário"
                  />
                ) : (
                  <span>{perfil.nomeUsuario}</span>
                )}
              </div>

              <div className="info-box">
                <i className="fa-regular fa-envelope"></i>
                {editando ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-editar"
                    placeholder="Email"
                  />
                ) : (
                  <span>{perfil.email}</span>
                )}
              </div>

              <div className="info-box">
                <i className="fa-solid fa-coins"></i> {perfil.moedas}
              </div>

              <div className="info-box">
                <i className="fa-regular fa-star"></i> {perfil.pontos} pontos
              </div>

              <div className="botoes-acao">
                {editando ? (
                  <>
                    <Button
                      variant="accept" size="small"
                      onClick={handleSalvar}
                      disabled={salvando}
                    >
                      {salvando ? "A guardar..." : "Guardar"}
                    </Button>
                    <Button
                      variant="cancel" size="small"
                      onClick={handleCancelar}
                      disabled={salvando}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary" size="small" onClick={() => setEditando(true)}>
                  ✏️
                     Editar Perfil
                  </Button>



                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}