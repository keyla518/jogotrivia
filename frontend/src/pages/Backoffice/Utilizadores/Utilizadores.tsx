import React, { useEffect, useState } from "react";
import { fetchUtilizadores } from "../../../api/utilizadores";
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
            <th>Moedas</th>
            <th>Pontos</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {utilizadores.map((u) => (
            <tr key={u.usuarioID}>
              <td>{u.usuarioID}</td>
              <td>{u.nomeUsuario}</td>
              <td>{u.email}</td>
              <td>{u.moedas}</td>
              <td>{u.pontos}</td>
              <td className={u.role === "administrador" ? "admin" : "jogador"}>
                {u.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
