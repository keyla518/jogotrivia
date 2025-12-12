import axios from "axios";

const API = "http://localhost:3000/api";
const token = localStorage.getItem("token");

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export const getPerguntas = async () => {
  const res = await axios.get(`${API}/perguntas`, config);
  return res.data;
};

export const getRegioes = async () => {
  const res = await axios.get(`${API}/regioes`, config);
  return res.data;
};

export const getCategorias = async () => {
  const res = await axios.get(`${API}/categorias`, config);
  return res.data;
};

export const criarPergunta = async (data: any) => {
  const res = await axios.post(`${API}/perguntas`, data, config);
  return res.data;
};

export const editarPergunta = async (id: number, data: any) => {
  const res = await axios.put(`${API}/perguntas/${id}`, data, config);
  return res.data;
};

export const deletarPerguntaApi = async (id: number) => {
  const res = await axios.delete(`${API}/perguntas/${id}`, config);
  return res.data;
};
