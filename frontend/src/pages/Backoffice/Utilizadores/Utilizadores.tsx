import React, { useEffect, useState } from "react";
import {
  fetchUtilizadores,
  promoverUtilizador,
  removerAdmin,
} from "../../../api/utilizadores";
import "./Utilizadores.css";

interface Utilizador {
  usuarioID: number;
  nomeUsuario: string;
  email: string;
  role: string;
  moedas: number;
  pontos: number;
}

export default function Utilizadores() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function handlePromover(id: number) {
    await promoverUtilizador(id);
    carregarUtilizadores();
  }

  async function handleRemoverAdmin(id: number) {
    await removerAdmin(id);
    carregarUtilizadores();
  }

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  if (loading) return <p>Carregando utilizadores...</p>;

  return (
    <div className="utilizadores-container">
      <h1>Gestão de Utilizadores</h1>

      <table className="utilizadores-tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Moedas</th>
            <th>Pontos</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {utilizadores.map((u) => (
            <tr key={u.usuarioID}>
              <td>{u.usuarioID}</td>
              <td>{u.nomeUsuario}</td>
              <td>{u.email}</td>
              <td className={u.role === "administrador" ? "admin" : "jogador"}>
                {u.role}
              </td>
              <td>{u.moedas}</td>
              <td>{u.pontos}</td>

              <td>
                {u.role === "jogador" ? (
                  <button
                    className="promover"
                    onClick={() => handlePromover(u.usuarioID)}
                  >
                    Promover a Admin
                  </button>
                ) : (
                  <button
                    className="remover"
                    onClick={() => handleRemoverAdmin(u.usuarioID)}
                  >
                    Remover Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
