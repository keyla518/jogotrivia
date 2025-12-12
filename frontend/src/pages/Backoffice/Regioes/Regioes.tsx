import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Regioes.css";
import { getRegioes } from "../../../api/regioes";

type Regiao = {
  regiaoID: number;
  nomeRegiao: string;
};

export default function Regioes() {
  const navigate = useNavigate();
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarRegioes();
  }, []);

  const carregarRegioes = async () => {
    setIsLoading(true);
    try {
      const res = await getRegioes();
      setRegioes(res);
    } catch (error) {
      console.error("Erro ao carregar regiões:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backoffice-container">
      {/* Menu hamburguer */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="hamburger"><span></span><span></span><span></span></div>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/backoffice/perguntas")}>📝 Perguntas</button>
          <button onClick={() => navigate("/backoffice/regioes")}>🗺️ Regiões</button>
          <button onClick={() => navigate("/backoffice/categorias")}>📂 Categorias</button>
          <button onClick={() => navigate("/backoffice/utilizadores")}>👥 Utilizadores</button>
          <button onClick={() => navigate("/menu")} className="btn-voltar">← Voltar ao Menu</button>
        </nav>
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Conteúdo */}
      <div className="backoffice-content">
        <h1 className="page-title">Regiões</h1>

        <div className="lista-container">
          {isLoading ? (
            <div className="loading">A carregar...</div>
          ) : regioes.length === 0 ? (
            <div className="empty-state">Nenhuma região encontrada</div>
          ) : (
            regioes.map((r) => (
              <div key={r.regiaoID} className="item">
                {r.nomeRegiao}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
