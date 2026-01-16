import React, { useEffect, useState } from "react";
import { fetchUtilizadores, updateUtilizador } from "../../../api/utilizadores";
import "./Utilizadores.css";
import { useNavigate } from "react-router-dom";

interface Utilizador {
  usuarioID: number;
  nomeUsuario: string;
  email: string;
  role: string;
  moedas: number;
  pontos: number;
}

type SortField = "moedas" | "pontos" | null;
type SortOrder = "asc" | "desc";

export default function Utilizadores() {
  const navigate = useNavigate();
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nomeUsuario: "", email: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function carregarUtilizadores() {
    try {
      const data = await fetchUtilizadores();
      setUtilizadores(data);
    } catch (err) {
      console.error("Erro ao carregar utilizadores:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  // Busca
  const utilizadoresFiltrados = utilizadores.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.nomeUsuario.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  // Ordenação
  const utilizadoresOrdenados = [...utilizadoresFiltrados].sort((a, b) => {
    if (!sortField) return 0;

    const multiplier = sortOrder === "asc" ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  // Paginação
  const totalPages = Math.ceil(utilizadoresOrdenados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const utilizadoresPaginados = utilizadoresOrdenados.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Lidando com ordenação
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setSortMenuOpen(false);
    setCurrentPage(1);
  };

  const handleEdit = (u: Utilizador) => {
    setEditingId(u.usuarioID); // linha que indica quem está sendo editado
    setEditForm({ nomeUsuario: u.nomeUsuario, email: u.email });
  };

  const handleSave = async (id: number) => {
    try {
      await updateUtilizador(id, {
        nomeUsuario: editForm.nomeUsuario,
        email: editForm.email,
      });

      setUtilizadores(
        utilizadores.map((u) =>
          u.usuarioID === id
            ? { ...u, nomeUsuario: editForm.nomeUsuario, email: editForm.email }
            : u
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Erro ao atualizar utilizador", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ nomeUsuario: "", email: "" });
  };

  if (loading) return <p>Carregando utilizadores...</p>;

  return (
    <div className="utilizadores-container">
      <h1>Gestão de Utilizadores</h1>

      {/* Menu Hamburguer */}
      {!menuOpen && (
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          <div className="hamburger">
            <span></span><span></span><span></span>
          </div>
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/backoffice/perguntas")}>Perguntas</button>
          <button onClick={() => navigate("/backoffice/utilizadores")}>Utilizadores</button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Sair
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Barra de busca + Filtros */}
      <div className="controles">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />

        {/* Botão de Ordenação */}
        <div className="filtros-container">
          <div className="filtro-ordenar">
            <button
              className="ordenar-btn"
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
            >
              Ordenar ▼
            </button>

            {sortMenuOpen && (
              <div className="ordenar-dropdown">
                <button onClick={() => handleSort("moedas")}>
                  Moedas {sortField === "moedas" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>

                <button onClick={() => handleSort("pontos")}>
                  Pontos {sortField === "pontos" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="info">
          Total: {utilizadoresOrdenados.length} utilizador(es)
        </div>
      </div>

      {/* Tabela */}
      <table className="utilizadores-tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Moedas</th>
            <th>Pontos</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {utilizadoresPaginados.map((u) => (
            <tr key={u.usuarioID}>
              <td>{u.usuarioID}</td>

              {/* Nome editável */}
              <td>
                {editingId === u.usuarioID ? (
                  <input
                    type="text"
                    value={editForm.nomeUsuario}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nomeUsuario: e.target.value })
                    }
                    className="edit-input"
                  />
                ) : (
                  u.nomeUsuario
                )}
              </td>

              {/* Email editável */}
              <td>
                {editingId === u.usuarioID ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="edit-input"
                  />
                ) : (
                  u.email
                )}
              </td>

              <td>{u.moedas}</td>
              <td>{u.pontos}</td>

              <td>
                {editingId === u.usuarioID ? (
                  <div className="edit-buttons">
                    <button onClick={() => handleSave(u.usuarioID)} className="salvar">
                      Guardar
                    </button>
                    <button onClick={handleCancel} className="cancelar">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(u)} className="editar">
                    ✏️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="paginacao">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="paginacao-btn"
          >
            Anterior
          </button>

          <span className="paginacao-info">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="paginacao-btn"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
