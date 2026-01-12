import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Perguntas.css";
import { getPerguntas, getRegioes, getCategorias, criarPergunta, editarPergunta, deletarPerguntaApi } from "../../../api/perguntas";

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

      console.log("Perguntas recibidas:", resPerguntas); // ← AÑADE ESTO
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

  // ➤ Modal: Criar
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

  // ➤ Modal: Editar
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

  // ➤ Guardar / Editar
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

  // ➤ Deletar
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
          <button onClick={() => navigate("/backoffice/perguntas")}>Perguntas</button>
          <button onClick={() => navigate("/backoffice/utilizadores")}>Utilizadores</button>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Conteúdo */}
      <div className="backoffice-content">
        <div className="backoffice-header">
          <h1 className="page-title">Perguntas</h1>
          <button className="btn-criar" onClick={abrirModalNovo}>Criar nova</button>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Região</label>
            <select value={filtroRegiao} onChange={(e) => setFiltroRegiao(e.target.value)}>
              <option value="">Todas</option>
              {regioes.map((r) => (
                <option key={r.regiaoID} value={r.regiaoID}>{r.nomeRegiao}</option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>Categoria</label>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.categoriaID} value={c.categoriaID}>{c.nomeCategoria}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista */}
        <div className="perguntas-list">
          {isLoading ? (
            <div className="loading">A carregar...</div>
          ) : perguntasFiltradas.length === 0 ? (
            <div className="empty-state">Nenhuma pergunta encontrada</div>
          ) : (
            perguntasFiltradas.map((p) => (
              <div key={p.perguntaID} className="pergunta-item">
                <div className="pergunta-texto">
                  {p.textoPergunta}
                  <div className="subinfo">
                    <span>{p.regiao?.nomeRegiao}</span>
                    <span>{p.categoria?.nomeCategoria}</span>
                  </div>
                </div>

                <div className="pergunta-actions">
                  <button className="btn-edit" onClick={() => abrirModalEditar(p)}>✏️</button>
                  <button className="btn-delete" onClick={() => deletarPergunta(p.perguntaID)}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingPergunta ? "Editar Pergunta" : "Criar Pergunta"}</h2>

            <input
              type="text"
              placeholder="Texto da pergunta"
              value={formData.textoPergunta}
              onChange={(e) => setFormData({ ...formData, textoPergunta: e.target.value })}
            />

            <input
              type="text"
              placeholder="Opção A"
              value={formData.opcaoA}
              onChange={(e) => setFormData({ ...formData, opcaoA: e.target.value })}
            />

            <input
              type="text"
              placeholder="Opção B"
              value={formData.opcaoB}
              onChange={(e) => setFormData({ ...formData, opcaoB: e.target.value })}
            />

            <input
              type="text"
              placeholder="Opção C"
              value={formData.opcaoC}
              onChange={(e) => setFormData({ ...formData, opcaoC: e.target.value })}
            />

            <input
              type="text"
              placeholder="Opção D"
              value={formData.opcaoD}
              onChange={(e) => setFormData({ ...formData, opcaoD: e.target.value })}
            />

            <select
              value={formData.opcaoCerta}
              onChange={(e) => setFormData({ ...formData, opcaoCerta: e.target.value })}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <select
              value={formData.regiaoID}
              onChange={(e) => setFormData({ ...formData, regiaoID: e.target.value })}
            >
              <option value="">Selecionar região</option>
              {regioes.map((r) => (
                <option key={r.regiaoID} value={r.regiaoID}>{r.nomeRegiao}</option>
              ))}
            </select>

            <select
              value={formData.categoriaID}
              onChange={(e) => setFormData({ ...formData, categoriaID: e.target.value })}
            >
              <option value="">Selecionar categoria</option>
              {categorias.map((c) => (
                <option key={c.categoriaID} value={c.categoriaID}>{c.nomeCategoria}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn-save" onClick={salvarPergunta}>Guardar</button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
