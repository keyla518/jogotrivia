import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

interface PerfilUsuario {
  usuarioID: number;
  email: string;
  moedas: number;
  pontos: number;
}


export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const navigate = useNavigate();

  // 🔽 PASSO 3 – Buscar dados da API (AQUI)
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN NO PERFIL:", token);

    fetch("http://localhost:3000/api/utilizador/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao obter perfil");
        }
        return res.json();
      })
      .then((data) => {
        setPerfil(data.usuario);
      })
      .catch((err) => {
        console.error("Erro:", err);
      });
  }, []); // ← executa só uma vez, quando o componente carrega

  // 🔽 JSX vem sempre depois
  return (
    <div className="perfil-container">
      <div className="btn-topo">
        <button className="btn-back-menu" onClick={() => navigate("/menu")}>
              ←
        </button>
        <button className="logout-btn" onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}>
              Sair
        </button>
      </div>

      <h1 className="titulo">MENTE CRUZADA</h1>

      <div className="perfil-card">
        <div className="foto-perfil">
          <div className="foto-placeholder">
            <i className="fa-regular fa-user"></i>
          </div>
          <p className="alterar-foto">
            <a href="#">Alterar foto do perfil</a>
          </p>
        </div>

        <div className="info">
          {!perfil ? (
            <p>A carregar perfil...</p>
          ) : (
            <>
              <div className="info-box">
                <i className="fa-regular fa-envelope"></i> {perfil.email}
              </div>
              <div className="info-box">
                <i className="fa-regular fa-user"></i> {perfil.usuarioID}
              </div>
              <div className="info-box">
                <i className="fa-solid fa-coins"></i> {perfil.moedas}
              </div>
              <div className="info-box">
                <i className="fa-regular fa-star"></i> {perfil.pontos} pontos
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
