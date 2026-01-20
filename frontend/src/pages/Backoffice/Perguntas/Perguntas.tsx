import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Perguntas.css";
import { getPerguntas, getRegioes, getCategorias, criarPergunta, editarPergunta, deletarPerguntaApi } from "../../../api/perguntas";
import { Button } from "../../../components/Button";

type Pergunta = {
  perguntaID: number;
  textoPergunta: string;
  opcaoA: string;
  opcaoB: string;
  opcaoC: string;
  opcaoD: string;
  opcaoCerta: string;
  regiaoID: number;
  categoriaID: number;
  regiao?: { nomeRegiao: string };
  categoria?: { nomeCategoria: string };
};

type Regiao = {
  regiaoID: number;
  nomeRegiao: string;
};

type Categoria = {
  categoriaID: number;
  nomeCategoria: string;
};

export default function Backoffice() {
  const navigate = useNavigate();

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroRegiao, setFiltroRegiao] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingPergunta, setEditingPergunta] = useState<Pergunta | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    textoPergunta: "",
    opcaoA: "",
    opcaoB: "",
    opcaoC: "",
    opcaoD: "",
    opcaoCerta: "A",
    regiaoID: "",
    categoriaID: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const [resPerguntas, resRegioes, resCategorias] = await Promise.all([
        getPerguntas(),
        getRegioes(),
        getCategorias(),
      ]);

      console.log("Perguntas recibidas:", resPerguntas);
      console.log("Regiões:", resRegioes);
      console.log("Categorias:", resCategorias);

      setPerguntas(resPerguntas);
      setRegioes(resRegioes);
      setCategorias(resCategorias);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalNovo = () => {
    setEditingPergunta(null);
    setFormData({
      textoPergunta: "",
      opcaoA: "",
      opcaoB: "",
      opcaoC: "",
      opcaoD: "",
      opcaoCerta: "A",
      regiaoID: "",
      categoriaID: "",
    });
    setShowModal(true);
  };

  const abrirModalEditar = (pergunta: Pergunta) => {
    setEditingPergunta(pergunta);
    setFormData({
      textoPergunta: pergunta.textoPergunta,
      opcaoA: pergunta.opcaoA,
      opcaoB: pergunta.opcaoB,
      opcaoC: pergunta.opcaoC,
      opcaoD: pergunta.opcaoD,
      opcaoCerta: pergunta.opcaoCerta,
      regiaoID: pergunta.regiaoID.toString(),
      categoriaID: pergunta.categoriaID.toString(),
    });
    setShowModal(true);
  };

  const salvarPergunta = async () => {
    const data = {
      ...formData,
      regiaoID: Number(formData.regiaoID),
      categoriaID: Number(formData.categoriaID),
    };

    try {
      if (editingPergunta) {
        await editarPergunta(editingPergunta.perguntaID, data);
      } else {
        await criarPergunta(data);
      }

      setShowModal(false);
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error);
    }
  };

  const deletarPergunta = async (id: number) => {
    if (!confirm("Tens a certeza?")) return;

    try {
      await deletarPerguntaApi(id);
      carregarDados();
    } catch (error) {
      console.error("Erro ao deletar pergunta:", error);
    }
  };

  const perguntasFiltradas = perguntas.filter((p) => {
    const matchRegiao = !filtroRegiao || p.regiaoID.toString() === filtroRegiao;
    const matchCategoria = !filtroCategoria || p.categoriaID.toString() === filtroCategoria;
    return matchRegiao && matchCategoria;
  });

  return (
    <div className="perguntas-backoffice-container">

      {/* Menu hamburguer */}
      {!menuOpen && (
        <button className="perguntas-menu-btn" onClick={() => setMenuOpen(true)}>
          <div className="perguntas-hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      {/* Sidebar */}
      <div className={`perguntas-sidebar ${menuOpen ? "perguntas-sidebar-open" : ""}`}>
        <div className="perguntas-sidebar-header">
          <h2>Menu</h2>
          <button className="perguntas-close-btn" onClick={() => setMenuOpen(false)}>×</button>
        </div>

        <nav className="perguntas-sidebar-nav">
          <button onClick={() => navigate("/backoffice/perguntas")}>Perguntas</button>
          <button onClick={() => navigate("/backoffice/utilizadores")}>Utilizadores</button>
          <button className="perguntas-logout-btn" onClick={() => { localStorage.removeItem("token"); navigate("/login")}}>Sair</button>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="perguntas-overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Conteúdo */}
      <div className="perguntas-backoffice-content">
        <div className="perguntas-backoffice-header">
          <h1 className="perguntas-page-title">Perguntas</h1>
          <Button variant="action" size="medium" onClick={abrirModalNovo}>Criar Pergunta</Button>
        </div>

        {/* Filtros */}
        <div className="perguntas-filtros-container">
          <div className="perguntas-filtro-group">
            <label>Região</label>
            <select 
              className="perguntas-filtro-select"
              value={filtroRegiao} 
              onChange={(e) => setFiltroRegiao(e.target.value)}
            >
              <option value="">Todas</option>
              {regioes.map((r) => (
                <option key={r.regiaoID} value={r.regiaoID}>{r.nomeRegiao}</option>
              ))}
            </select>
          </div>

          <div className="perguntas-filtro-group">
            <label>Categoria</label>
            <select 
              className="perguntas-filtro-select"
              value={filtroCategoria} 
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.categoriaID} value={c.categoriaID}>{c.nomeCategoria}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="perguntas-table-container">
          {isLoading ? (
            <div className="perguntas-loading">A carregar...</div>
          ) : perguntasFiltradas.length === 0 ? (
            <div className="perguntas-empty-state">Nenhuma pergunta encontrada</div>
          ) : (
            <table className="perguntas-table">
              <thead>
                <tr>
                  <th>Pergunta</th>
                  <th>Região</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {perguntasFiltradas.map((p) => (
                  <tr key={p.perguntaID}>
                    <td className="perguntas-pergunta-texto">{p.textoPergunta}</td>
                    <td>{p.regiao?.nomeRegiao}</td>
                    <td>{p.categoria?.nomeCategoria}</td>
                    <td className="perguntas-pergunta-actions">
                      <button className="perguntas-btn-edit" onClick={() => abrirModalEditar(p)}>✏️</button>
                      <button className="perguntas-btn-delete" onClick={() => deletarPergunta(p.perguntaID)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="perguntas-modal-overlay">
          <div className="perguntas-modal">
            <h2 className="perguntas-modal-title">
              {editingPergunta ? "Editar Pergunta" : "Criar Pergunta"}
            </h2>

            <input
              className="perguntas-modal-input"
              type="text"
              placeholder="Texto da pergunta"
              value={formData.textoPergunta}
              onChange={(e) => setFormData({ ...formData, textoPergunta: e.target.value })}
            />

            <input
              className="perguntas-modal-input"
              type="text"
              placeholder="Opção A"
              value={formData.opcaoA}
              onChange={(e) => setFormData({ ...formData, opcaoA: e.target.value })}
            />

            <input
              className="perguntas-modal-input"
              type="text"
              placeholder="Opção B"
              value={formData.opcaoB}
              onChange={(e) => setFormData({ ...formData, opcaoB: e.target.value })}
            />

            <input
              className="perguntas-modal-input"
              type="text"
              placeholder="Opção C"
              value={formData.opcaoC}
              onChange={(e) => setFormData({ ...formData, opcaoC: e.target.value })}
            />

            <input
              className="perguntas-modal-input"
              type="text"
              placeholder="Opção D"
              value={formData.opcaoD}
              onChange={(e) => setFormData({ ...formData, opcaoD: e.target.value })}
            />

            <select
              className="perguntas-modal-select"
              value={formData.opcaoCerta}
              onChange={(e) => setFormData({ ...formData, opcaoCerta: e.target.value })}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <select
              className="perguntas-modal-select"
              value={formData.regiaoID}
              onChange={(e) => setFormData({ ...formData, regiaoID: e.target.value })}
            >
              <option value="">Selecionar região</option>
              {regioes.map((r) => (
                <option key={r.regiaoID} value={r.regiaoID}>{r.nomeRegiao}</option>
              ))}
            </select>

            <select
              className="perguntas-modal-select"
              value={formData.categoriaID}
              onChange={(e) => setFormData({ ...formData, categoriaID: e.target.value })}
            >
              <option value="">Selecionar categoria</option>
              {categorias.map((c) => (
                <option key={c.categoriaID} value={c.categoriaID}>{c.nomeCategoria}</option>
              ))}
            </select>

            <div className="perguntas-modal-actions">
              <Button variant="accept" size="small" onClick={salvarPergunta}>Guardar</Button>
              <Button variant="cancel" size="small" onClick={() => setShowModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}