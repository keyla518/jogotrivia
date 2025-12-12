import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categorias.css";
import { getCategorias } from "../../../api/categorias";

type Categoria = {
  categoriaID: number;
  nomeCategoria: string;
};

export default function Categorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setIsLoading(true);
    try {
      const res = await getCategorias();
      setCategorias(res);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
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
        <h1 className="page-title">Categorias</h1>

        <div className="lista-container">
          {isLoading ? (
            <div className="loading">A carregar...</div>
          ) : categorias.length === 0 ? (
            <div className="empty-state">Nenhuma categoria encontrada</div>
          ) : (
            categorias.map((c) => (
              <div key={c.categoriaID} className="item">
                {c.nomeCategoria}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
