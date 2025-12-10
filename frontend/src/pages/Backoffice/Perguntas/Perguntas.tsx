import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Perguntas.css";
import { getPerguntas, getRegioes, getCategorias } from "../../../api/perguntas";

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

  // Formulario para crear/editar pregunta
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
    try {
      if (editingPergunta) {
        // PUT /api/perguntas/:id
        console.log("Editar pergunta:", editingPergunta.perguntaID, formData);
      } else {
        // POST /api/perguntas
        console.log("Criar nova pergunta:", formData);
      }
      setShowModal(false);
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error);
    }
  };

  const deletarPergunta = async (id: number) => {
    if (!confirm("Tens a certeza que queres eliminar esta pergunta?")) return;
    
    try {
      // DELETE /api/perguntas/:id
      console.log("Deletar pergunta:", id);
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
      {/* Menu hamburguesa */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar menu */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/backoffice/perguntas")}>
            📝 Perguntas
          </button>
          <button onClick={() => navigate("/backoffice/regioes")}>
            🗺️ Regiões
          </button>
          <button onClick={() => navigate("/backoffice/categorias")}>
            📂 Categorias
          </button>
          <button onClick={() => navigate("/backoffice/utilizadores")}>
            👥 Utilizadores
          </button>
          <button onClick={() => navigate("/menu")} className="btn-voltar">
            ← Voltar ao Menu
          </button>
        </nav>
      </div>

      {/* Overlay para cerrar el menú */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Contenido principal */}
      <div className="backoffice-content">
        {/* Header */}
        <div className="backoffice-header">
          <h1 className="page-title">Perguntas</h1>
          <button className="btn-criar" onClick={abrirModalNovo}>
            Criar nova pergunta
          </button>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Filtro</label>
            <select
              value={filtroRegiao}
              onChange={(e) => setFiltroRegiao(e.target.value)}
              className="filtro-select"
            >
              <option value="">Todas as regiões</option>
              {regioes.map((r) => (
                <option key={r.regiaoID} value={r.regiaoID}>
                  {r.nomeRegiao}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="filtro-select"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c.categoriaID} value={c.categoriaID}>
                  {c.nomeCategoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de perguntas */}
        <div className="perguntas-list">
          {isLoading ? (
            <div className="loading">A carregar...</div>
          ) : perguntasFiltradas.length === 0 ? (
            <div className="empty-state">
              Nenhuma pergunta encontrada
            </div>
          ) : (
            perguntasFiltradas.map((pergunta) => (
              <div key={pergunta.perguntaID} className="pergunta-item">
                <div className="pergunta-texto">
                  {pergunta.textoPergunta}
                </div>
                <div className="pergunta-actions">
                  <button
                    className="btn-delete"
                    onClick={() => deletarPergunta(pergunta.perguntaID)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => abrirModalEditar(pergunta)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para criar/editar */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPergunta ? "Editar Pergunta" : "Nova Pergunta"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Texto da Pergunta *</label>
                <textarea
                  value={formData.textoPergunta}
                  onChange={(e) =>
                    setFormData({ ...formData, textoPergunta: e.target.value })
                  }
                  placeholder="Escreve aqui a pergunta..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Região *</label>
                  <select
                    value={formData.regiaoID}
                    onChange={(e) =>
                      setFormData({ ...formData, regiaoID: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleciona...</option>
                    {regioes.map((r) => (
                      <option key={r.regiaoID} value={r.regiaoID}>
                        {r.nomeRegiao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Categoria *</label>
                  <select
                    value={formData.categoriaID}
                    onChange={(e) =>
                      setFormData({ ...formData, categoriaID: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleciona...</option>
                    {categorias.map((c) => (
                      <option key={c.categoriaID} value={c.categoriaID}>
                        {c.nomeCategoria}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="opcoes-container">
                <div className="form-group">
                  <label>Opção A *</label>
                  <input
                    type="text"
                    value={formData.opcaoA}
                    onChange={(e) =>
                      setFormData({ ...formData, opcaoA: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Opção B *</label>
                  <input
                    type="text"
                    value={formData.opcaoB}
                    onChange={(e) =>
                      setFormData({ ...formData, opcaoB: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Opção C *</label>
                  <input
                    type="text"
                    value={formData.opcaoC}
                    onChange={(e) =>
                      setFormData({ ...formData, opcaoC: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Opção D *</label>
                  <input
                    type="text"
                    value={formData.opcaoD}
                    onChange={(e) =>
                      setFormData({ ...formData, opcaoD: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Resposta Correta *</label>
                <select
                  value={formData.opcaoCerta}
                  onChange={(e) =>
                    setFormData({ ...formData, opcaoCerta: e.target.value })
                  }
                  required
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={salvarPergunta}>
                {editingPergunta ? "Guardar alterações" : "Criar pergunta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}