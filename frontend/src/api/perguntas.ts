import axios from "axios";

const API_URL = "http://localhost:3000"; // Cambia según tu backend

const token = localStorage.getItem("token"); // token guardado en login

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`, // incluye token JWT
  },
};

export const getPerguntas = async () => {
  const res = await axios.get(`${API_URL}/perguntas`, axiosConfig);
  return res.data;
};

export const getRegioes = async () => {
  const res = await axios.get(`${API_URL}/regioes`, axiosConfig);
  return res.data;
};

export const getCategorias = async () => {
  const res = await axios.get(`${API_URL}/categorias`, axiosConfig);
  return res.data;
};
